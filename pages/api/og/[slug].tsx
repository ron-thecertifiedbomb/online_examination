// pages/api/og/[slug].tsx
import { ImageResponse } from '@vercel/og';
import { blogArticles } from '@/data/lists/blogArticle';

export const config = {
    runtime: 'edge',
};

export default async function handler(req: Request) {
    const url = new URL(req.url);
    const slug = url.pathname.split('/').pop();

    const post = blogArticles.find((article) => article.id === slug);

    if (!post) {
        return new Response('Post not found', { status: 404 });
    }

    const title = post.title;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lizardinteractive.online';

    // Try to get the background image (use ogImage if available, fallback to image)
    let backgroundImageUrl = null;
    try {
        // Prefer ogImage (jpg) for better compatibility, fallback to image (webp)
        const imagePath = post.ogImage || post.image;
        const imageUrl = `${siteUrl}/${imagePath}`;
        console.log('Fetching image from:', imageUrl);
        const imageResponse = await fetch(imageUrl);
        if (imageResponse.ok) {
            const blob = await imageResponse.blob();
            backgroundImageUrl = URL.createObjectURL(blob);
        } else {
            console.log('Image not found:', imageUrl);
        }
    } catch (error) {
        console.log('Could not load blog image:', error);
    }

    // Simple logo - use emoji to avoid image loading issues
    const useEmojiLogo = true;

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#0a0a0a',
                }}
            >
                {/* Background image (the actual blog photo) */}
                {backgroundImageUrl && (
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundImage: `url(${backgroundImageUrl})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            opacity: 0.35,
                        }}
                    />
                )}

                {/* Gradient overlay for text readability */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 100%)',
                    }}
                />

                {/* Content overlay */}
                <div
                    style={{
                        position: 'relative',
                        zIndex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '60px 80px',
                        width: '100%',
                        height: '100%',
                    }}
                >
                    {/* Logo - using emoji for reliability */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            marginBottom: '32px',
                        }}
                    >
                        <div
                            style={{
                                width: '56px',
                                height: '56px',
                                background: '#10b981',
                                borderRadius: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '28px',
                            }}
                        >
                            🦎
                        </div>
                        <span
                            style={{
                                fontSize: '22px',
                                fontWeight: 'bold',
                                color: '#10b981',
                                letterSpacing: '2px',
                            }}
                        >
                            LIZARD INTERACTIVE
                        </span>
                    </div>

                    {/* Title */}
                    <h1
                        style={{
                            fontSize: '42px',
                            fontWeight: '900',
                            color: 'white',
                            textTransform: 'uppercase',
                            letterSpacing: '-0.02em',
                            lineHeight: 1.2,
                            textAlign: 'center',
                            maxWidth: '800px',
                            textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                            marginBottom: '20px',
                        }}
                    >
                        {title}
                    </h1>
                </div>

                {/* Footer */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '30px',
                        left: 0,
                        right: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        zIndex: 1,
                    }}
                >
                    <span
                        style={{
                            fontSize: '12px',
                            color: '#666',
                            fontFamily: 'monospace',
                            letterSpacing: '0.3em',
                        }}
                    >
                        LIZARD INTERACTIVE ONLINE
                    </span>
                </div>

                {/* Top accent line */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: 'linear-gradient(90deg, #10b981, #3b82f6, #a855f7)',
                    }}
                />
            </div>
        ),
        {
            width: 1200,
            height: 630,
        }
    );
}