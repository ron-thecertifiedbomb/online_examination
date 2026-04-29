import Head from "next/head";

interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: "website" | "article";
    noIndex?: boolean;
    examName?: string;
    examCategory?: string;
}

const BASE_URL = "https://online-examination-neon.vercel.app";
const SITE_NAME = "Online Examination | Secure Proctoring & Exam Engine";
const DEFAULT_DESCRIPTION =
    "High-integrity online examination platform with real-time proctoring, tab-monitoring, instant grading, and MongoDB state persistence. Built for educational institutions and corporate certifications.";
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;

export default function SEO({
    title,
    description = DEFAULT_DESCRIPTION,
    image = DEFAULT_IMAGE,
    url,
    type = "website",
    noIndex = false,
    examName,
    examCategory,
}: SEOProps) {
    const pageTitle = title ? `${title} | Online Examination` : SITE_NAME;
    const canonicalUrl = url ? `${BASE_URL}${url}` : BASE_URL;

    const jsonLd = examName
        ? {
            "@context": "https://schema.org",
            "@type": "Course",
            name: examName,
            description: description,
            provider: {
                "@type": "Organization",
                name: "RonDevSolutions",
                url: BASE_URL,
            },
            educationalLevel: examCategory ?? "Professional",
            url: canonicalUrl,
        }
        : {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: SITE_NAME,
            url: BASE_URL,
            description: DEFAULT_DESCRIPTION,
            potentialAction: {
                "@type": "SearchAction",
                target: `${BASE_URL}/exams?q={search_term_string}`,
                "query-input": "required name=search_term_string",
            },
        };

    return (
        <Head>
            <title>{pageTitle}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={canonicalUrl} />
            {noIndex && <meta name="robots" content="noindex, nofollow" />}

            <meta property="og:type" content={type} />
            <meta property="og:site_name" content="Online Examination" />
            <meta property="og:title" content={pageTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:url" content={canonicalUrl} />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={pageTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
        </Head>
    );
}