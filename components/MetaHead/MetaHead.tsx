import Head from "next/head";
import { useRouter } from "next/router";

interface MetaHeadProps {
    data?: {
        title?: string;
        description?: string;
        ogImage?: string;
        ogUrl?: string;
        ogType?: string;
        fbAppId?: string;
        twitterCard?: string;
    };
    pageContent?: Array<{ type: string; data?: any }>;
}

export default function MetaHead({ data, pageContent }: MetaHeadProps) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lizardinteractive.online";
    const router = useRouter();

    // Get data from props or pageContent
    let title = data?.title;
    let description = data?.description;
    let ogImage = data?.ogImage;
    let ogUrl = data?.ogUrl;
    let ogType = data?.ogType;

    if (!title && pageContent) {
        const seoData = pageContent.find((item) => item.type === "seo");
        if (seoData?.data) {
            title = seoData.data.title;
            description = seoData.data.description;
            ogImage = seoData.data.ogImage;
            ogUrl = seoData.data.ogUrl;
        }
    }

    const finalTitle = title || "Lizard Interactive Online";
    const finalDescription = description || "Free online tools for developers, designers, and creators.";
    const finalOgType = ogType || "website";

    const getAbsoluteUrl = (path?: string) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        const cleanPath = path.startsWith('/') ? path.slice(1) : path;
        return `${siteUrl}/${cleanPath}`;
    };

    const absoluteOgImage = getAbsoluteUrl(ogImage);
    const finalOgUrl = ogUrl || `${siteUrl}${router.asPath}`;

    return (
        <Head>
            {/* Basic Meta Tags */}
            <title>{finalTitle}</title>
            <meta name="description" content={finalDescription} />
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
            <meta charSet="utf-8" />
            <meta name="robots" content="index, follow" />
            <meta name="theme-color" content="#000000" />

            {/* Favicon */}
            <link rel="icon" type="image/png" sizes="32x32" href="/lizardinteractive.png" />
            <link rel="apple-touch-icon" href="/lizardinteractive.png" />

            {/* Open Graph - ALWAYS include these */}
            <meta property="og:title" content={finalTitle} />
            <meta property="og:description" content={finalDescription} />
            <meta property="og:url" content={finalOgUrl} />
            <meta property="og:type" content={finalOgType} />
            <meta property="og:site_name" content="Lizard Interactive Online" />
            <meta property="og:locale" content="en_US" />

            {/* ✅ CRITICAL: og:image MUST be present */}
            {absoluteOgImage ? (
                <>
                    <meta property="og:image" content={absoluteOgImage} />
                    <meta property="og:image:width" content="1200" />
                    <meta property="og:image:height" content="630" />
                    <meta property="og:image:alt" content={finalTitle} />
                </>
            ) : (
                // ✅ Fallback image - ensure this file exists in public/
                <meta property="og:image" content={`${siteUrl}/og-image-homepage.jpg`} />
            )}

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={finalTitle} />
            <meta name="twitter:description" content={finalDescription} />
            {absoluteOgImage && <meta name="twitter:image" content={absoluteOgImage} />}
        </Head>
    );
}