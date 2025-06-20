"use client";

import { HeaderClient } from "../../component/HeaderClient";
import { FooterClient } from "../../component/FooterClient";
import { useEffect, useState } from "react";
import { Category, Post } from "@/util/type";
import { APICategory, APIPost } from "@/util/api";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [categoryHeader, setCategoryHeader] = useState<Category[] | []>([]);
  const [hotNews, setHotNews] = useState<Post[] | []>([]);

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
        setCategoryHeader(categories);
        console.log(categories);
        const posts: Post[] = Array.isArray(result)
          ? result?.map((dt: Post) => ({
              ...dt,
            }))
          : [];

        // const dataTable: TableRow[] = posts.map((dt: Post) => ({
        //   ...dt
        // }));

        setHotNews(posts);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      } finally {
        // setLoading(false);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="min-h-screen flex flex-col">
      <HeaderClient categories={categoryHeader} />
      <main className="flex-1">{children}</main>
      <FooterClient />
    </div>
  );
}
