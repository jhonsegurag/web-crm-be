/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['sequelize', 'mysql2'],
    instrumentationHook: true,
  },
};
module.exports = nextConfig;
