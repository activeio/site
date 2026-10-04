import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "RankReels privacy policy",
  description:
    "How the RankReels Android app handles your data: your clips stay on your phone; ads are handled by Google AdMob.",
  alternates: { canonical: `https://${site.domain}/rankreels/privacy/` },
};

const UPDATED = "4 October 2026";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-xl text-ink">{title}</h2>
      <div className="mt-3 space-y-3 leading-relaxed text-ink/85">{children}</div>
    </section>
  );
}

const link = "text-accent underline underline-offset-2 hover:text-ink";

export default function RankReelsPrivacy() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-14 sm:py-20">
      <Link href="/" className="text-sm text-muted transition-colors hover:text-ink">
        ← {site.domain}
      </Link>

      <h1 className="mt-8 font-display text-3xl text-ink sm:text-4xl">RankReels privacy policy</h1>
      <p className="mt-3 text-sm text-muted">Last updated {UPDATED}</p>

      <p className="mt-8 leading-relaxed text-ink/85">
        RankReels is an Android app for making Top 5 countdown videos, published by activeiolabs
        (&ldquo;we&rdquo;). This policy explains what happens to your data when you use it. In short:
        you don&rsquo;t need an account, we run no servers, and your clips and projects stay on your
        phone. RankReels is free and shows ads from Google AdMob.
      </p>

      <Section title="What stays on your phone">
        <p>
          The clips and music you pick, your projects (titles, rank names, styles and edits), their
          thumbnails and the videos you render are stored in the app&rsquo;s private storage on your
          device. So are your settings, such as the colour theme.
          We never receive any of it.
        </p>
        <p>
          When you save a video to your gallery or to a folder you choose, or create a project
          backup file, that copy lives where you put it and is yours to manage. Deleting a project in
          the app removes its files from the app&rsquo;s storage; uninstalling the app removes all of
          them.
        </p>
      </Section>

      <Section title="Permissions">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="font-medium text-ink">Your videos and music:</strong> picked through
            Android&rsquo;s own picker, so the app only sees the files you choose, not your whole
            library.
          </li>
          <li>
            <strong className="font-medium text-ink">Storage (Android 8 and 9 only):</strong> to save
            finished videos to Movies/RankReels.
          </li>
          <li>
            <strong className="font-medium text-ink">Notifications and running in the background:</strong>{" "}
            to keep rendering while the screen is off and show its progress.
          </li>
        </ul>
      </Section>

      <Section title="Ads">
        <p>
          RankReels shows banner and full-screen ads from Google AdMob. To show and measure
          ads and to prevent fraud, Google may collect information from your device, such as your
          advertising ID, IP address, device and app information, and how you interact with ads.
          Google handles this data under its own policy:{" "}
          <a className={link} href="https://policies.google.com/technologies/partner-sites">
            how Google uses information from apps that use its services
          </a>
          .
        </p>
        <p>
          Where the law requires it (for example in the EEA, the UK and Switzerland), the app asks for
          your consent through Google&rsquo;s consent form before ads are personalised, and you can
          change your choice any time from <em>Ad privacy choices</em> on the app&rsquo;s home
          screen. You can also reset or delete your advertising ID in your phone&rsquo;s settings.
        </p>
      </Section>

      <Section title="Sharing to other apps">
        <p>
          When you share a video to YouTube, Instagram, TikTok or any other app, RankReels hands the
          file to that app on your phone, and the app&rsquo;s own privacy policy applies from then
          on. For Instagram and TikTok, your caption is copied to the clipboard so you can paste it.
        </p>
      </Section>

      <Section title="What we don&rsquo;t do">
        <ul className="list-disc space-y-2 pl-5">
          <li>We don&rsquo;t run analytics or crash reporting of our own.</li>
          <li>We don&rsquo;t collect your name, email, contacts or location.</li>
          <li>We don&rsquo;t sell or share your data with anyone.</li>
        </ul>
      </Section>

      <Section title="Children">
        <p>
          RankReels is not directed at children under 13, and we don&rsquo;t knowingly collect
          personal information from them.
        </p>
      </Section>

      <Section title="Security">
        <p>
          Your projects are kept in storage that other apps can&rsquo;t read. The Google ads
          service the app uses encrypts its traffic in transit.
        </p>
      </Section>

      <Section title="Changes">
        <p>
          If this policy changes, we&rsquo;ll update this page and the date at the top.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          Questions about this policy or your data:{" "}
          <a className={link} href={`mailto:${site.email}?subject=RankReels%20privacy`}>
            {site.email}
          </a>
          .
        </p>
      </Section>
    </main>
  );
}
