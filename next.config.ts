import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/house-cleaning-portland",
        destination: "/cities/house-cleaning-portland",
        permanent: true,
      },
      {
        source: "/house-cleaning-beaverton",
        destination: "/cities/house-cleaning-beaverton",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
