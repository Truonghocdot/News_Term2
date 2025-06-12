"use client";
import { useEffect, useState } from "react";

import VideoPostsGrid from "@/component/TableVideoAdmin";
import { Category, Post } from "@/util/type";
import { APICategory, APIPost } from "@/util/api";

const VideoPage = () => {
  const [videoPosts, setVideoPosts] = useState<Post[] | []>([]);
  const [categories, setCategories] = useState<Category[] | []>([]);
  const [loading, setLoading] = useState<boolean>();
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
        setCategories(categories);
        console.log(categories);
        const posts: Post[] = Array.isArray(result)
          ? result?.filter((dt: Post) => {
            if(dt.video)
            return {
              ...dt,
            };
          })
          : [];

        const dataTable: Post[] = posts.map((dt: Post) => ({
          ...dt,
        }));

        setVideoPosts(dataTable);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <VideoPostsGrid
        data={videoPosts}
        itemsPerPage={16}
        categories={categories}
        onVideoClick={(post) => {
          console.log("Video clicked:", post);
          // Custom logic
        }}
      />
    </div>
  );
};
export default VideoPage;
