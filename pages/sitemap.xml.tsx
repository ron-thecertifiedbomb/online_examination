// pages/sitemap.xml.tsx
import { GetServerSideProps } from 'next'
import { utilities } from '@/data/lists/utilities'

const generateSitemap = () => {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lizardinteractive.online'

    // Static pages
    const staticPages = [
        { url: '', priority: '1.0', changefreq: 'daily' },
        { url: '/tools', priority: '0.9', changefreq: 'daily' },
    ]

    // Dynamic tool pages
    const toolPages = utilities.map(tool => ({
        url: `/tools/${tool.slug}`,
        priority: '0.8',
        changefreq: 'weekly'
    }))

    const allPages = [...staticPages, ...toolPages]

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`

    return sitemap
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
    const sitemap = generateSitemap()

    res.setHeader('Content-Type', 'text/xml')
    res.write(sitemap)
    res.end()

    return {
        props: {},
    }
}

export default function Sitemap() {
    return null
}