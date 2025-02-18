/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'notemeet.vercel.app',
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig; 