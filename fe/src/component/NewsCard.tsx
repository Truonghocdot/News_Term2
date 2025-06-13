import Link from 'next/link';

interface NewsCardProps {
  post: {
    id: number;
    title: string;
    excerpt: string;
    featuredImage: string;
    publishedAt: Date;
    author: {
      name: string;
    };
    category: {
      name: string;
      slug: string;
    };
  };
}

export default function NewsCard({ post }: NewsCardProps) {
  const featuredImage = post.featuredImage || '/images/default-thumbnail.jpg';

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden transition hover:shadow-xl">
      <Link href={`/news/${post.id}`} className="block">
        <img
          src={featuredImage}
          alt={post.title}
          className="w-full h-52 object-cover"
        />
        <div className="p-4">
          <p className="text-xs text-blue-500 font-medium mb-1">
            {post.category.name}
          </p>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">{post.title}</h2>
          <p className="text-sm text-gray-600 mb-3">{post.excerpt}...</p>
          <div className="flex justify-between items-center text-xs text-gray-400">
            <span>{post.author.name}</span>
            <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}