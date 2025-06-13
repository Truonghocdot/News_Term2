import NewsCard from "@/component/NewsCard";
import { SidebarClient } from "@/component/SidebarClient";
import { Category, Post } from "@/util/type";
import { Metadata } from "next";
import Link from "next/link";

interface CategoryOrArticleViewProps {
  params: {
    category: string;
    slug?: string;
  };
  // Props để phân biệt trang danh mục hay chi tiết
  article?: Post;
  category?: Category;
  articles?: Post[];
  relatedArticles?: Post[];
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onCommentSubmit?: (comment: string) => void;
}

const metadata: Metadata = {};

export default function CategoryOrArticleView({
  params,
  article,
  category,
  articles = [],
  relatedArticles = [],
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  onCommentSubmit,
}: CategoryOrArticleViewProps) {
  // Nếu có article thì hiển thị trang chi tiết, không thì hiển thị danh mục
  const isArticleDetail = !!article;

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Convert Article to NewsCard format
  const convertToNewsCardFormat = (articleData: Post) => ({
    id: articleData.id,
    title: articleData.title || "",
    excerpt: articleData.metaDescription || "Không có mô tả",
    featuredImage: articleData.thumbnail || "",
    category: {
      name: category?.name || params.category,
      slug: category?.slug || params.category,
    },
    publishedAt: new Date(articleData.timePublish || ""),
    author: { name: articleData.author || "" },
  });

  // Handle comment submission
  const handleCommentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const comment = formData.get("comment") as string;
    if (comment.trim() && onCommentSubmit) {
      onCommentSubmit(comment);
      e.currentTarget.reset();
    }
  };

  // Handle social share
  const handleShare = (platform: string) => {
    if (!article) return;

    const url = window.location.href;
    const title = article.title ? article.title : "";

    switch (platform) {
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url
          )}`,
          "_blank"
        );
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            title
          )}&url=${encodeURIComponent(url)}`,
          "_blank"
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            url
          )}`,
          "_blank"
        );
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        alert("Đã sao chép link bài viết!");
        break;
    }
  };

  if (isArticleDetail && article) {
    // Render trang chi tiết bài viết
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {/* Breadcrumb */}
            <nav className="flex mb-6 text-sm text-gray-600">
              <Link href="/" className="hover:text-gray-900">
                Trang chủ
              </Link>
              <span className="mx-2">/</span>
              <Link
                href={`/category/${params.category}`}
                className="hover:text-gray-900"
              >
                {category?.name || params.category}
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900 truncate">{article.title}</span>
            </nav>

            {/* Article Detail */}
            <article className="bg-white rounded-lg shadow-sm">
              {/* Category Tag */}
              <div className="mb-4">
                <Link
                  href={`/category/${params.category}`}
                  className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium hover:bg-primary/20 transition-colors"
                >
                  {category?.name || params.category}
                </Link>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {article.title}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium">
                      {article.author?.charAt(0)}
                    </span>
                  </div>
                  <span>
                    Bởi <strong>{article.author}</strong>
                  </span>
                </div>
                <span>•</span>
                <span>{formatDate(article.timePublish || "")}</span>
                <span>•</span>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    article.isPublish
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {article.isPublish ? "Đã xuất bản" : "Bản nháp"}
                </span>
              </div>

              {/* Featured Image */}
              {article.thumbnail && (
                <div className="mb-8">
                  <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={article.thumbnail}
                      alt={article.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        target.parentElement!.innerHTML = `
                          <div class="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                            <span class="text-gray-600">Không thể tải ảnh</span>
                          </div>
                        `;
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Article Content */}
              <div className="prose prose-lg max-w-none mb-8">
                <div
                  className="text-gray-800 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: article.content || "" }}
                />
              </div>

              {/* Meta Keywords as Tags */}
              {article.metaKeywords && (
                <div className="border-t pt-6 mb-8">
                  <h3 className="text-lg font-semibold mb-3">Từ khóa:</h3>
                  <div className="flex flex-wrap gap-2">
                    {article.metaKeywords.split(",").map((keyword, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 cursor-pointer"
                      >
                        {keyword.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Share */}
              <div className="border-t pt-6 mb-8">
                <h3 className="text-lg font-semibold mb-3">
                  Chia sẻ bài viết:
                </h3>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleShare("facebook")}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    Facebook
                  </button>
                  <button
                    onClick={() => handleShare("twitter")}
                    className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-500 transition-colors"
                  >
                    Twitter
                  </button>
                  <button
                    onClick={() => handleShare("linkedin")}
                    className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-900 transition-colors"
                  >
                    LinkedIn
                  </button>
                  <button
                    onClick={() => handleShare("copy")}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                  >
                    Copy Link
                  </button>
                </div>
              </div>
            </article>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <section className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Bài viết liên quan</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedArticles.map((relatedArticle) => (
                    <NewsCard
                      key={relatedArticle.id}
                      post={convertToNewsCardFormat(relatedArticle)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Comment Section */}
            <section className="mt-12 bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-6">Bình luận</h2>

              {/* Comment Form */}
              <form onSubmit={handleCommentSubmit} className="mb-8">
                <textarea
                  name="comment"
                  placeholder="Viết bình luận của bạn..."
                  className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={4}
                  required
                />
                <div className="mt-3 flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    Vui lòng giữ bình luận tích cực và có ý nghĩa.
                  </p>
                  <button
                    type="submit"
                    className="bg-primary text-primary-foreground px-6 py-2 rounded hover:bg-primary/90 transition-colors"
                  >
                    Gửi bình luận
                  </button>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border-b pb-6 last:border-b-0">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">U{i}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">Người dùng {i}</span>
                          <span className="text-sm text-gray-500">
                            {i} giờ trước
                          </span>
                        </div>
                        <p className="text-gray-700 mb-2">
                          Đây là một bình luận mẫu cho bài viết này. Nội dung
                          rất hữu ích và thông tin.
                        </p>
                        <button className="text-sm text-primary hover:underline">
                          Trả lời
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="lg:col-span-1">
            <SidebarClient />
          </aside>
        </div>
      </div>
    );
  }

  // Render trang danh mục
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {category?.name || params.category}
            </h1>
            <p className="text-gray-600">
              {category?.metaDescription ||
                `Tin tức mới nhất về ${category?.name || params.category}`}
            </p>
            {category?.title && category.title !== category.name && (
              <p className="text-sm text-gray-500 mt-1">{category.title}</p>
            )}
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.length > 0
              ? articles.map((articleData) => (
                  <NewsCard
                    key={articleData.id}
                    post={convertToNewsCardFormat(articleData)}
                  />
                ))
              : // Fallback với mock data nếu không có articles
                [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <NewsCard
                    key={i}
                    post={{
                      id: i,
                      title: `${
                        category?.name || params.category
                      } tin tức số ${i}`,
                      excerpt: "Mô tả ngắn về tin tức trong danh mục này...",
                      featuredImage: "undefined",
                      category: {
                        name: category?.name || params.category,
                        slug: category?.slug || params.category,
                      },
                      publishedAt: new Date(),
                      author: { name: "Tác giả" },
                    }}
                  />
                ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <div className="flex space-x-2">
                <button
                  onClick={() => onPageChange && onPageChange(currentPage - 1)}
                  className="px-3 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
                  disabled={currentPage === 1}
                >
                  Trước
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange && onPageChange(pageNum)}
                      className={`px-3 py-2 rounded ${
                        pageNum === currentPage
                          ? "bg-primary text-primary-foreground"
                          : "border hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => onPageChange && onPageChange(currentPage + 1)}
                  className="px-3 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
                  disabled={currentPage === totalPages}
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </div>

        <aside className="lg:col-span-1">
          <SidebarClient />
        </aside>
      </div>
    </div>
  );
}
