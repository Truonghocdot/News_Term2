import React, { useState } from "react";
import { Play, Calendar, Tag, Clock, X } from "lucide-react";
import { Post, Category } from "@/util/type";
import { BASE_URL } from "../../enviroment";

interface Props {
  data: Post[];
  itemsPerPage?: number;
  categories?: Category[];
}

const TableVideoUser: React.FC<Props> = ({
  data = [],
  itemsPerPage = 12,
  categories = []
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVideo, setSelectedVideo] = useState<Post | null>(null);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const currentData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
    <div>
      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentData.map((post) => (
          <div
            key={post.id}
            className="group bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md cursor-pointer"
            onClick={() => setSelectedVideo(post)}
          >
            <div className="relative aspect-video overflow-hidden">
              <img
                src={BASE_URL + post.thumbnail}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <Play className="w-10 h-10 text-white" />
              </div>
              <span className="absolute bottom-2 right-2 bg-black text-white text-xs px-2 py-1 rounded">
                <Clock className="inline w-3 h-3 mr-1" />
                Video
              </span>
            </div>

            <div className="p-3">
              <h2 className="text-md font-semibold text-gray-900 line-clamp-2">
                {post.title}
              </h2>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {post.metaDescription ||
                  (post.content
                    ? post.content.replace(/<[^>]+>/g, "").slice(0, 100) + "..."
                    : "")}
              </p>
              <div className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(post.timePublish || "")}
              </div>
              <div className="text-sm text-blue-600 mt-1 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                {getCategoryName(post.categoryId || 0)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: totalPages }, (_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentPage(idx + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === idx + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      {/* Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-lg overflow-y-auto max-h-[90vh]">
            <div className="p-4 flex justify-between items-start">
              <h2 className="text-lg font-semibold">{selectedVideo.title}</h2>
              <button
                onClick={() => setSelectedVideo(null)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="aspect-video bg-black">
              <video
                src={BASE_URL + selectedVideo.video}
                controls
                poster={BASE_URL + selectedVideo.thumbnail}
                className="w-full h-full"
              />
            </div>
            <div className="p-4 text-gray-700">
              <div
                className="prose"
                dangerouslySetInnerHTML={{
                  __html: selectedVideo.content || ""
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableVideoUser;
