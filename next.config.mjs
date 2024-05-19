import createMDX from '@next/mdx'
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    mdxRs: true,
  }
}
 
const withMDX = createMDX({
  extension: /\.mdx?$/,
})

export default withMDX(nextConfig)
