/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    // لا نتجاهل أخطاء TypeScript أثناء البناء لكي لا نخفي مشاكل فعلية
    ignoreBuildErrors: false,
  },
  eslint: {
    // لا نتجاهل أخطاء ESLint أثناء البناء
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;
