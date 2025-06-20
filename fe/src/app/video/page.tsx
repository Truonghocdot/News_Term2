"use client";
import { useEffect, useState } from "react";
import { Category, Post } from "@/util/type";
import { APICategory, APIPost } from "@/util/api";
import { useRouter } from "next/navigation";
import { BASE_URL } from "../../../enviroment";
import { Calendar, Tag, ArrowLeft } from "lucide-react";
import TableVideoUser from "@/component/TableVideoUser";

const UserVideoPage = () => {
  const [videos, setVideos] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resPost, resCategory] = await Promise.all([
          APIPost.getDataField("/api/posts/list"),
          APICategory.getDataField("/api/categories/list")
        ]);

        if (resPost.status >= 300 || resCategory.status >= 300)
          throw new Error("Lỗi tải dữ liệu");

        const posts: Post[] = resPost.data || [];
        const filtered = posts.filter((post) => post.video);
        setVideos(filtered);
        setCategories(resCategory);
      } catch (err) {
        console.error("Lỗi khi lấy video:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const featuredVideo = videos.length > 0 ? videos[0] : null;
  const remainingVideos = videos.slice(1);

  const getCategoryName = (id: number) =>
    categories.find((cat) => cat.id === id)?.title || "Chưa phân loại";

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-12">
      {/* Nút quay lại trang chủ */}
      <button
        onClick={() => router.push("/")}
        className="inline-flex items-center  text-blank-800 hover:none text-sm font-medium cursor-pointer"
      >
        <ArrowLeft className="w-6 h-6 mr-2 text-green-600" />
        Quay lại trang chủ
      </button>

      {/* Featured Video Section */}
      {featuredVideo && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start bg-white rounded-xl shadow p-4 border">
          {/* Video player */}
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <video
              src={BASE_URL + featuredVideo.video}
              poster={featuredVideo.thumbnail}
              controls
              className="w-full h-full object-cover"
            />
          </div>

          {/* Textual content */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">
              {featuredVideo.title}
            </h2>
            <div className="flex items-center text-sm text-gray-600 space-x-4">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(featuredVideo.timePublish || "")}
              </div>
              <div className="flex items-center text-blue-600">
                <Tag className="w-4 h-4 mr-1" />
                {getCategoryName(featuredVideo.categoryId || 0)}
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed text-base">
              {featuredVideo.metaDescription ||
                (featuredVideo.content
                  ? featuredVideo.content.replace(/<[^>]+>/g, "").slice(0, 300) + "..."
                  : "Không có mô tả.")}
            </p>
          </div>
        </section>
      )}

      {/* List of videos */}
      {!loading && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Các video khác</h2>
          <TableVideoUser
            data={remainingVideos}
            itemsPerPage={12}
            categories={categories}
          />
        </section>
      )}
    </div>
  );
};

export default UserVideoPage;
