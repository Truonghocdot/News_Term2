import { Category, Post } from "@/util/type";
import Link from "next/link";
type PropsNewsCard = {
  post: Post;
  category: Category;
}
export default function NewsCard({post, category}: PropsNewsCard) {
  const featuredImage = 'localhost:8080' + post.thumbnail ||'localhost:8080' + "/images/default-thumbnail.jpg";
  console.log(post.slug);
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden transition hover:shadow-xl">
      <Link href={`${post.slug}`} className="block">
        <img
          src={featuredImage}
          alt={post.title}
          className="w-full h-52 object-cover"
        />
        <div className="p-4">
          <p className="text-xs text-blue-500 font-medium mb-1">
            {category.name}
          </p>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            {post.title}
          </h2>
          <p className="text-sm text-gray-600 mb-3">{post.content}...</p>
          <div className="flex justify-between items-center text-xs text-gray-400">
            <span>{post.author}</span>
            <span>{post.timePublish}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
