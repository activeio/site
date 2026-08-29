#!/usr/bin/env bash
# Deploy the static export to Hostinger shared hosting via the Hostinger API.
#
#   HOSTINGER_API_TOKEN=... ./scripts/deploy-hostinger.sh [domain]
#
# Requires a *provisioned* website for the domain (hPanel -> Hosting -> Set up,
# choosing the blank site option). A Website Builder site has no file storage:
# its upload-urls call 404s and this script will say so.
set -euo pipefail

DOMAIN="${1:-activeiolabs.com}"
API="https://developers.hostinger.com"
ARCHIVE="activeiolabs-site.zip"

: "${HOSTINGER_API_TOKEN:?set HOSTINGER_API_TOKEN (hPanel -> API)}"
auth=(-H "Authorization: Bearer ${HOSTINGER_API_TOKEN}" -H "Accept: application/json")

say() { printf '\n\033[1m==> %s\033[0m\n' "$*"; }

say "Building $ARCHIVE"
npm run package:hostinger >/dev/null
ls -lh "$ARCHIVE"

say "Resolving website for $DOMAIN"
site=$(curl -sS --fail-with-body "${auth[@]}" "$API/api/hosting/v1/websites?domain=$DOMAIN")
username=$(printf '%s' "$site" | python3 -c 'import sys,json; d=json.load(sys.stdin)["data"]; print(d[0]["username"] if d else "")')
wtype=$(printf '%s' "$site" | python3 -c 'import sys,json; d=json.load(sys.stdin)["data"]; print(d[0]["website_type"] if d else "")')

if [ -z "$username" ]; then
  echo "No website exists for $DOMAIN. Set the hosting plan up in hPanel first." >&2
  exit 1
fi
echo "username=$username website_type=$wtype"
if [ "$wtype" = "builder" ]; then
  echo "This is a Website Builder site — it has no public_html to upload into." >&2
  echo "Switch it to a regular site in hPanel, then re-run." >&2
  exit 1
fi

say "Requesting upload credentials"
creds=$(curl -sS --fail-with-body "${auth[@]}" -H 'Content-Type: application/json' \
  -d "{\"username\":\"$username\",\"domain\":\"$DOMAIN\"}" \
  -X POST "$API/api/hosting/v1/files/upload-urls")
read -r url akey rkey <<<"$(printf '%s' "$creds" | python3 -c \
  'import sys,json; d=json.load(sys.stdin); print(d["url"], d["auth_key"], d["rest_auth_key"])')"

size=$(stat -c%s "$ARCHIVE")
tus=(-H "X-Auth: $akey" -H "X-Auth-Rest: $rkey" -H "Tus-Resumable: 1.0.0")

say "Creating upload ($size bytes)"
curl -sS --fail-with-body -o /dev/null -X POST "$url/$ARCHIVE?override=true" \
  "${tus[@]}" -H "Upload-Length: $size" -H "Upload-Offset: 0"

say "Uploading archive"
curl -sS --fail-with-body -o /dev/null -X PATCH "$url/$ARCHIVE?override=true" \
  "${tus[@]}" -H 'Content-Type: application/offset+octet-stream' \
  -H "Upload-Offset: 0" --data-binary "@$ARCHIVE"

say "Deploying (overwrites the website's current contents)"
curl -sS --fail-with-body "${auth[@]}" -H 'Content-Type: application/json' \
  -d "{\"username\":\"$username\",\"domain\":\"$DOMAIN\",\"archive_path\":\"$ARCHIVE\"}" \
  -X POST "$API/api/hosting/v1/accounts/$username/websites/$DOMAIN/deploy"

say "Verifying https://$DOMAIN/"
sleep 5
curl -sSI -m 25 "https://$DOMAIN/?cb=$$" | head -1
curl -sS -m 25 "https://$DOMAIN/?cb=$$" | grep -o '<title>[^<]*</title>' || echo "(no <title> yet — CDN may still be caching)"
