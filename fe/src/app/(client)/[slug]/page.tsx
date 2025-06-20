"use client";
import { useEffect, useState } from "react";
import CategoryOrArticleView from "../../../component/CategoryOrArticleView";
import { usePathname } from "next/navigation";
import { APICategory, APIPost } from "@/util/api";
import { Category, Post } from "@/util/type";

export default function Page() {
  const pathname = usePathname();
  const [params, setParams] = useState<{ category: string; slug?: string }>({
    category: "",
  });
  const [article, setArticle] = useState<Post | undefined>(undefined);
  const [categoryData, setCategoryData] = useState<Category | undefined>(
    undefined
  );
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [articlesData, setArticlesData] = useState<Post[]>([]);
  const [articlesRelateData, setArticlesRelateData] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageType, setPageType] = useState<"article" | "category" | "notfound">(
    "notfound"
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Extract slug from pathname (e.g., /post-slug -> post-slug)

        if (!pathname) {
          setIsLoading(false);
          return;
        }

        // Fetch all categories first for later use
        const allCategoriesRes = await APICategory.getDataField(
          "/api/categories/list"
        );
        setAllCategories(allCategoriesRes);

        // Strategy: Try to fetch as POST first, then as CATEGORY
        // This prioritizes articles over categories if there's a slug conflict

        // 1. Try to get as POST first
        let articleData: Post | undefined;
        try {
          const postRes = await APIPost.getDataBySlug(
            "/api/posts/slug",
            pathname
          );
          articleData = postRes.data;
          console.log(articleData);
        } catch (error) {
          console.log("No post found for slug:", pathname);
        }

        if (articleData) {
          // This is a POST page
          setPageType("article");
          setArticle(articleData);

          // Get category data for the article
          const categoryForArticle = allCategoriesRes.find(
            (cat: Category) => cat.id === articleData.categoryId
          );
          setCategoryData(categoryForArticle);

          setParams({
            category: categoryForArticle?.slug || "",
            slug: pathname,
          });

          // Get related articles from same category
          try {
            const relatedPostsRes = await APIPost.getDataFieldByParam(
              "/api/posts/list",
              "categoryId",
              articleData.categoryId?.toString() || ""
            );
            const relatedPosts =
              relatedPostsRes.data
                ?.filter((post: Post) => post.id !== articleData.id)
                .slice(0, 3) || [];
            setArticlesRelateData(relatedPosts);
          } catch (error) {
            console.log("Error fetching related posts:", error);
          }
        } else {
          // 2. Try to get as CATEGORY
          let categoryDataRes: Category | undefined;
          try {
            categoryDataRes = await APICategory.getDataBySlug(
              "/api/categories/slug",
              pathname
            );
          } catch (error) {
            console.log("No category found for slug:", pathname);
          }

          if (categoryDataRes) {
            // This is a CATEGORY page
            setPageType("category");
            setCategoryData(categoryDataRes);

            setParams({
              category: pathname,
            });

            // Get articles for this category
            try {
              const categoryPostsRes = await APIPost.getDataFieldByParam(
                "/api/posts/list",
                "categoryId",
                categoryDataRes.id.toString()
              );
              setArticlesData(categoryPostsRes.data || []);
            } catch (error) {
              console.log("Error fetching category posts:", error);
            }
          } else {
            // Neither post nor category found
            setPageType("notfound");
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setPageType("notfound");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [pathname]);

  const handlePageChange = (page: number) => {
    console.log("Chuyển sang trang:", page);
    // TODO: Implement pagination logic with API call
  };

  const handleCommentSubmit = (comment: string) => {
    console.log("Gửi comment:", comment);
    // TODO: Implement comment submission logic
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải...</p>
          </div>
        </div>
      </div>
    );
  }

  // Not found state
  if (pageType === "notfound") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center min-h-[400px] flex items-center justify-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
            <p className="text-gray-600 mb-6">
              Không tìm thấy trang bạn yêu cầu
            </p>
            <a
              href="/"
              className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Về trang chủ
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <CategoryOrArticleView
      params={params}
      article={pageType === "article" ? article : undefined}
      category={categoryData}
      articles={articlesData}
      relatedArticles={articlesRelateData}
      categoriesF={allCategories}
      currentPage={1}
      totalPages={Math.ceil(articlesData.length / 10)} // Assuming 10 articles per page
      onPageChange={handlePageChange}
      onCommentSubmit={handleCommentSubmit}
    />
  );
}
