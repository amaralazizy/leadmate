import type { NextConfig } from "next";
import "dotenv/config";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    OPENAI_API_KEY: process.env.OPENAI_KEY as string,
  },
};

export default nextConfig;
