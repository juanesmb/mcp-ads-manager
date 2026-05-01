import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@jumon/ui",
    "@jumon/domain",
    "@jumon/db",
    "@jumon/auth",
    "@jumon/linkedin",
    "@jumon/providers"
  ]
};

export default nextConfig;
