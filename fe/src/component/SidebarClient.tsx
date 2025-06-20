"use client";
import Link from "next/link";
import { TrendingUp, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { Category, Post } from "@/util/type";
import { APICategory, APIPost } from "@/util/api";

export function SidebarClient() {
  const [postCurrent, setPostCurrent] = useState<Post[] | []>([]);
  const [categoryCurrent, setCategoryCurrent] = useState<Category[] | []>([]);

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
        setCategoryCurrent(categories);
        console.log(categories);
        const posts: Post[] = Array.isArray(result)
          ? result?.map((dt: Post) => ({
              ...dt,
            }))
          : [];

        // const dataTable: TableRow[] = posts.map((dt: Post) => ({
        //   ...dt
        // }));

        setPostCurrent(posts);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      } finally {
        // setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Popular Posts */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-primary" />
          Tin phổ biến
        </h3>
        <div className="space-y-4">
          {postCurrent.map((i: Post, index: number) => {
            if (index < 6) {
              return (
                <article key={i.id} className="flex space-x-3">
                  <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded"></div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium line-clamp-2 mb-1">
                      <Link href="#" className="hover:text-primary">
                        {i.title}
                      </Link>
                    </h4>
                    <div className="flex items-center text-xs text-gray-500">
                      <Eye className="h-3 w-3 mr-1" />
                      <span> {i.countViews ? i.countViews : 0} views</span>
                    </div>
                  </div>
                </article>
              );
            }
          })}
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold mb-4">Danh mục</h3>
        <div className="space-y-2">
          {categoryCurrent.map((category: Category, i: number) => {
            if (i < 6)
              return (
                <Link
                  key={category.name}
                  href={`${category.slug}`}
                  className="flex justify-between items-center py-2 px-3 rounded hover:bg-gray-50 text-sm"
                >
                  <span>{category.name}</span>
                  <span className="text-gray-500">{category.countPost?.toString()}</span>
                </Link>
              );
          })}
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-primary text-primary-foreground rounded-lg p-6">
        <h3 className="text-lg font-bold mb-2">Đăng ký nhận tin</h3>
        <p className="text-sm opacity-90 mb-4">
          Nhận thông tin tin tức mới nhất qua email
        </p>
        <div className="space-y-3">
          <input
            type="email"
            placeholder="Email của bạn"
            className="w-full px-3 py-2 rounded text-gray-900 text-sm"
          />
          <button className="w-full bg-white text-primary py-2 rounded text-sm font-medium hover:bg-gray-100">
            Đăng ký
          </button>
        </div>
      </div>
    </div>
  );
}
