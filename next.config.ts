import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["mongoose", "bcryptjs"],
  output: "standalone",
  images: {
    
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'testingmenow.s3.us-east-1.amazonaws.com',
        pathname: '/**',
      },
      // Add more S3 regions/patterns if needed
      {
        protocol: 'https',
        hostname: '*.s3.*.amazonaws.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
