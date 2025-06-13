"use client";
import { useEffect, useState } from "react";
import CategoryOrArticleView from "../../../component/CategoryOrArticleView";
import { usePathname } from "next/navigation";
import { APICategory, APIPost } from "@/util/api";
import { Category, Post } from "@/util/type";
export default function Page() {
  const pathname = usePathname();
  const [params, setParams] = useState<{category: string, slug?: string}>({category: ""});
  const [article, setAritcle] = useState<Post| undefined>(undefined);
  const [categoryData, setCategoryData] = useState<Category | undefined>(undefined);
  const [articlesData, setArticlesData] = useState<Post[] | []>([]);
  const [articlesRelateData, setArticlesRelateData] = useState<Post[] | []>([])
  useEffect(() => {
    const fetchData = async () => {
      const res_category = await APICategory.getDataBySlug("/api/categories/slug", pathname);
      setParams({
        category: res_category?.title,
        slug: res_category?.slug
      });
      setCategoryData(res_category);
      const res_post_by_slug = await APIPost.getDataFieldByParam("/api/posts/list", "slug", pathname);
      const articleData: Post =  res_post_by_slug.data[0];
      setAritcle(articleData);

      const allPost = await APIPost.getDataFieldByParam("/apit/posts/list","video","");
      setArticlesData(allPost);
      setArticlesRelateData(allPost.slice(1,3));
    }
    fetchData();
  }, []);

  const handlePageChange = (page: number) => {
    console.log("Chuyển sang trang:", page);
  };

  const handleCommentSubmit = (comment: string) => {
    // Logic để gửi comment lên server
    console.log("Gửi comment:", comment);
  };

  return (
    <CategoryOrArticleView
      params={params}
      article={article} // Có thể undefined cho trang danh mục
      category={categoryData}
      articles={articlesData}
      relatedArticles={articlesRelateData}
      currentPage={1}
      totalPages={5}
      onPageChange={handlePageChange}
      onCommentSubmit={handleCommentSubmit}
    />
  );
}
