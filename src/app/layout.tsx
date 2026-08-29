import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(`https://${site.domain}`),
  title: {
    default: `${site.name} — Full-Stack Engineer`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  keywords: [
    "full-stack engineer",
    "software development",
    "app development",
    "web apps",
    "mobile apps",
    "TypeScript",
    "Next.js",
    "React Native",
    "Pradeep",
  ],
  authors: [{ name: site.name }],
  alternates: {
    canonical: `https://${site.domain}`,
  },
  openGraph: {
    title: `${site.name} — Full-Stack Engineer`,
    description: site.description,
    url: `https://${site.domain}`,
    siteName: site.name,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Full-Stack Engineer`,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#faf9f5",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Pradeep",
  jobTitle: "Full-Stack Engineer",
  url: `https://${site.domain}`,
  sameAs: site.socials.map((social) => social.href),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-ink">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
