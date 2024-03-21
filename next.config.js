/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  assetPrefix: isProd
    ? "https://hack-nu-2024-registration.vercel.app/"
    : undefined,
};

module.exports = nextConfig;
