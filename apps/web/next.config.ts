import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@verdikt/shared", "@verdikt/verifier", "@verdikt/chain"],
  serverExternalPackages: ["@hashgraph/sdk"],
};

export default nextConfig;
