/**
 * @fileoverview Configuration file for Next.js.
 * This file contains settings for the Next.js application,
 * such as image optimization, build options, and environment variables.
 *
 * @see https://nextjs.org/docs/api-reference/next.config.js/introduction
 */
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  // This is required to allow the Next.js dev server to accept requests from the
  // sandboxed environment of Firebase Studio. The wildcard allows it to work
  // across different user sessions.
  allowedDevOrigins: ['https://*.cloudworkstations.dev'],
  typescript: {
    // This is set to `false` to enforce type checking during the build process.
    // This is the recommended setting for production to ensure code quality and safety.
    ignoreBuildErrors: false,
  },
  eslint: {
    // This is set to `false` to enforce linting rules during the build process.
    // This is the recommended setting for production.
    ignoreDuringBuilds: false,
  },
  images: {
    // Configures allowed domains for the next/image component.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
