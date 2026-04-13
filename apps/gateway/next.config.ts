import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@jumon/domain", "@jumon/db", "@jumon/auth", "@jumon/linkedin", "@jumon/ui"]
};

export default nextConfig;
