/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
   images: {
    remotePatterns: [
      {
        // https://images.unsplash.com/photo-1523240795612-9a054b0db644
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;
