import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This repo does not set a global Content-Security-Policy.
  async redirects() {
    return [
      {
        source: "/satisfaction-guaruntee",
        destination: "/satisfaction-guarantee",
        permanent: true,
      },
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
      {
        source: "/house-cleaning-oregon-city",
        destination: "/cities/house-cleaning-oregon-city",
        permanent: true,
      },
      {
        source: "/house-cleaning-happy-valley",
        destination: "/cities/house-cleaning-happy-valley",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
