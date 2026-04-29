import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import { BlogArticle, blogArticles } from '@/data/lists/blogArticle';
import ScreenContainer from '@/components/shared/ScreenContainer/ScreenContainer';
import BlogContent from '@/components/BlogContent/BlogContent';
import Head from 'next/head';

interface BlogPostPageProps {
  article: BlogArticle | null;
}

export default function BlogPostPage({ article }: BlogPostPageProps) {
  if (!article) {
    return (
      <ScreenContainer>
        <div className="min-h-screen flex items-center justify-center text-zinc-500">Article not found.</div>
      </ScreenContainer>
    );
  }

  return (
    <>
      <Head>
        <title>{article.title}</title>
        <meta name="description" content={article.sections?.[0]?.content?.substring(0, 160) || "Read this blog article."} />
        {article.ogImage && <meta property="og:image" content={article.ogImage} />}
      </Head>
      <ScreenContainer>
        <div className="max-w-4xl mx-auto pt-20 md:pt-28 pb-20 md:pb-40 px-4 md:px-6">
          <h1 className="text-4xl font-black uppercase text-white mb-8">{article.title}</h1>
          <BlogContent article={article} />
        </div>
      </ScreenContainer>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = blogArticles.map((article) => ({
    params: { slug: article.id },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<BlogPostPageProps> = async (context) => {
  const slug = context.params?.slug as string;
  const article = blogArticles.find((a) => a.id === slug) || null;

  return {
    props: { article },
  };
};