"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import NewsCard from "@/component/NewsCard";
import { SidebarClient } from "@/component/SidebarClient";
import { Category, Post } from "@/util/type";
import { APICategory, APIPost } from "@/util/api";
import { getCategoryOfPost } from "@/util/util";

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categoriesF, setCategoriesF] = useState<Category[] | []>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await APIPost.getDataField("/api/posts/list");
        const resCategory = await APICategory.getDataField(
          "/api/categories/list"
        );
        if (res.status < 300 && resCategory.status < 300)
          throw new Error("Failed to fetch");

        const result = await res.data;
        const resultCategories = await resCategory;
        console.log(result);
        console.log(resCategory);
        const categories: Category[] = Array.isArray(resultCategories)
          ? resultCategories?.map((dt: Category) => ({
              ...dt,
            }))
          : [];

        setPosts(result);
        setCategoriesF(categories);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      } finally {
      }
    };
    fetchData();
  }, []);

  const featuredPost = posts[0];
  const hotPosts = posts.slice(0, 3);
  const latestPosts = posts.slice(3);
  // Loại bỏ tất cả thẻ HTML trước khi lấy 100 ký tự
  const stripHtml = (html: string) => html.replace(/<[^>]*>?/gm, "");


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Nội dung chính */}
        <div className="lg:col-span-3 space-y-10">
          {/* Tin nổi bật */}
          {featuredPost && (
            <section>
              <h2 className="text-2xl font-bold mb-4 border-b pb-2 text-primary">
                Tin nổi bật
              </h2>
              <NewsCard
                post={{
                  ...featuredPost,
                  content: stripHtml(featuredPost.content || ""),
                }}
                category={getCategoryOfPost(featuredPost.categoryId || 0, categoriesF)}
              />
            </section>
          )}

          {/* Tin hot */}
          {hotPosts.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4 border-b pb-2 text-red-500">
                Tin hot
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {hotPosts.map((post) => (
                  <NewsCard
                    key={post.id}
                    post={{
                      ...post,
                      content: stripHtml(post.content || ""),
                    }}
                    category={getCategoryOfPost(post.categoryId || 0, categoriesF)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Tin mới nhất */}
          {latestPosts.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4 border-b pb-2 text-green-600">
                Tin mới nhất
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {latestPosts.map((post) => (
                  <NewsCard
                    key={post.id}
                    post={{
                      ...post,
                      content: stripHtml(post.content || ""),
                    }}
                    category={getCategoryOfPost(post.categoryId || 0, categoriesF)}
                  />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <SidebarClient />
        </aside>
      </div>
    </div>
  );
}
