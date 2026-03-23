import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.discordapp.com' }],
  },
}

export default withPayload(nextConfig)
