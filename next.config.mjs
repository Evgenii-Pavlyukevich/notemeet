/** @type {import('next').NextConfig} */
const nextConfig = {
  api: {
    bodyParser: false,
  },
  images: {
    domains: ['notemeet.vercel.app'],
  },
};

export default nextConfig; 