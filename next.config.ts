import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", basePath: "/obelisk-site", assetPrefix: "/obelisk-site/", images: { unoptimized: true }, trailingSlash: true,
  /* config options here */
};

export default nextConfig;
