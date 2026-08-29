import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project (other lockfiles exist higher up).
  turbopack: {
    root: __dirname,
  },

  // Hostinger shared hosting serves plain files from `public_html`, so the
  // site is built as a static export (`out/`) instead of running a Node server.
  output: "export",

  // Emit `/about/index.html` rather than `/about.html` so Apache's
  // DirectoryIndex resolves every route without rewrite rules.
  trailingSlash: true,

  // No image optimizer on shared hosting — `next/image` serves files as-is.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
