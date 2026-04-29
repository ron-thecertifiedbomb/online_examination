// pages/robots.txt.tsx
import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lizardinteractive.online'

    const robots = `# *
User-agent: *
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml

# Host
Host: ${baseUrl}

# Crawl delay
Crawl-delay: 1

# Disallow admin/private paths
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /404
Disallow: /500

# Allow all tool pages
Allow: /tools/
`

    res.setHeader('Content-Type', 'text/plain')
    res.write(robots)
    res.end()

    return {
        props: {},
    }
}

export default function Robots() {
    return null
}