#!/usr/bin/env bash
# Build the static export and publish it to the DigitalOcean droplet.
#
#   ./scripts/deploy-droplet.sh
#
# Needs SSH access as $DROPLET (default deploy@168.144.20.21) with the key in
# $DROPLET_KEY. The nginx site (deploy/nginx-activeiolabs.conf) is installed
# once by hand; this script only swaps the files in /var/www/activeiolabs.
set -euo pipefail

DROPLET="${DROPLET:-deploy@168.144.20.21}"
DROPLET_KEY="${DROPLET_KEY:-$HOME/.ssh/pramukhdarshan_droplet}"
ssh_cmd="ssh -i $DROPLET_KEY -o IdentitiesOnly=yes"

cd "$(dirname "$0")/.."
npm run build
test -f out/index.html

rsync -az --delete --exclude .htaccess -e "$ssh_cmd" out/ "$DROPLET:/var/www/activeiolabs/"
echo "Deployed. Check: curl -sI https://activeiolabs.com/"
