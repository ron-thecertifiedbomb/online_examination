import { getBlogById } from '@/lib/data/blog';
import { notFound } from 'next/navigation';
import Image from 'next/image';

export default async function BlogPostPage({ params }: { params: { id: string } }) {
  const article = await getBlogById(params.id);

  // Automatically trigger a 404 page if the article isn't found
  if (!article) {
    notFound();
  }

  return (
    <main className="max-w-3xl mx-auto py-10 px-4">
      <header className="mb-10">
        <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
        <div className="flex gap-4 text-sm text-gray-600 mb-6">
          <span>{article.category}</span>
          <span>&bull;</span>
          <time>{new Date(article.createdAt).toLocaleDateString()}</time>
        </div>
        <div className="relative w-full h-[400px]">
           <Image src={`/${article.image}`} alt={article.title} fill className="object-cover rounded-xl" priority />
        </div>
      </header>

      <article className="prose lg:prose-xl">
        {article.sections.map((section) => (
          <section key={section.id} className="mb-8">
            <h2>{section.heading}</h2>
            <p>{section.content}</p>
            {/* Add logic to render section.items or code blocks here based on section.type */}
          </section>
        ))}
      </article>
    </main>
  );
}
