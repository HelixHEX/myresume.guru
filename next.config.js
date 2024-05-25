/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    reactCompiler: true,

  },
  serverExternalPackages: ['pdf2json', 'pdf-parse']
};

module.exports  = nextConfig