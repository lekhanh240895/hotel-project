/** @type {import('next').NextConfig} */

const basePath = process.env.NEXT_PUBLIC_BASE_PATH;

const nextConfig = {
  basePath: basePath,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `http://localhost:3000/api/v1/:path*`
      }
    ];
  }
};

export default nextConfig;
