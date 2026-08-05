import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prisma + pg are Node natives — keep them external for the server bundle.
  serverExternalPackages: ["@prisma/client", "pg"],
  images: {
    qualities: [75, 80, 85],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
