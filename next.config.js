/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    reactCompiler: true,

  },
  reactStrictMode: false,
  serverExternalPackages: ['pdf2json', 'pdf-parse']
};

module.exports  = nextConfig