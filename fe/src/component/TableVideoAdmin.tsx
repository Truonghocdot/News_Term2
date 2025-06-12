import React, { useState, useEffect } from 'react';
import { Play, Clock, Eye, Calendar, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { Category, Post } from '@/util/type';


interface VideoPostsGridProps {
  data: Post[];
  itemsPerPage?: number;
  onVideoClick?: (post: Post) => void;
  categories?: Category[];
}

const VideoPostsGrid: React.FC<VideoPostsGridProps> = ({
  data = [],
  itemsPerPage = 12,
  onVideoClick,
  categories = []
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVideo, setSelectedVideo] = useState<Post | null>(null);

  // Pagination logic
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Strip HTML tags from content
  const stripHtml = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  // Get category name
  const getCategoryName = (categoryId: number) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.title || 'Chưa phân loại';
  };

  // Handle video click
  const handleVideoClick = (post: Post) => {
    setSelectedVideo(post);
    onVideoClick?.(post);
  };

  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToPrevious = () => {
    goToPage(currentPage - 1);
  };

  const goToNext = () => {
    goToPage(currentPage + 1);
  };

  // Generate page numbers
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Video Posts</h2>
        <p className="text-gray-600">
          Hiển thị {startIndex + 1} - {Math.min(endIndex, data.length)} của {data.length} video
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {currentData.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100"
          >
            {/* Thumbnail with play button */}
            <div 
              className="relative aspect-video bg-gray-200 cursor-pointer group"
              onClick={() => handleVideoClick(post)}
            >
              <img
                src={post.thumbnail}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                //   e.currentTarget.src = '/api/placeholder/320/180';
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-white bg-opacity-90 rounded-full p-4 transform scale-90 group-hover:scale-100 transition-transform duration-300">
                  <Play className="w-8 h-8 text-gray-800 ml-1" />
                </div>
              </div>
              
              {/* Video duration indicator (if available) */}
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                <Clock className="w-3 h-3 inline mr-1" />
                Video
              </div>
              
              {/* Published status */}
              <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${
                post.isPublish 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-500 text-white'
              }`}>
                {post.isPublish ? 'Published' : 'Draft'}
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Title */}
              <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                {post.title}
              </h3>

              {/* Meta description */}
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {post.metaDescription || stripHtml(post.content ? post.content : "").substring(0, 100) + '...'}
              </p>

              {/* Category */}
              <div className="flex items-center mb-2">
                <Tag className="w-4 h-4 text-blue-500 mr-1" />
                <span className="text-blue-600 text-sm font-medium">
                  {getCategoryName(post.categoryId? post.categoryId : 0)}
                </span>
              </div>

              {/* Publish date */}
              <div className="flex items-center text-gray-500 text-sm mb-3">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(post.timePublish? post.timePublish : "")}
              </div>

              {/* Tags */}
              {post.tags && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {post.tags.split(',').slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}

              {/* Action button */}
              <button
                onClick={() => handleVideoClick(post)}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-medium text-sm flex items-center justify-center"
              >
                <Play className="w-4 h-4 mr-2" />
                Xem Video
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {data.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Play className="w-16 h-16 mx-auto mb-4" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Chưa có video nào
          </h3>
          <p className="text-gray-500">
            Hiện tại chưa có video nào được đăng tải.
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-8 px-4 py-3 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600">
            Trang <span className="font-medium">{currentPage}</span> của{' '}
            <span className="font-medium">{totalPages}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={goToPrevious}
              disabled={currentPage === 1}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Trước
            </button>

            <div className="flex items-center space-x-1">
              {generatePageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`inline-flex items-center justify-center w-10 h-10 text-sm font-medium rounded-md transition-colors ${
                    currentPage === page
                      ? 'text-white bg-blue-600 hover:bg-blue-700'
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={goToNext}
              disabled={currentPage === totalPages}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Sau
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal header */}
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900 pr-4">
                  {selectedVideo.title}
                </h3>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                >
                  ×
                </button>
              </div>

              {/* Video player */}
              <div className="aspect-video mb-4">
                <video
                  src={selectedVideo.video}
                  controls
                  className="w-full h-full rounded-lg"
                  poster={selectedVideo.thumbnail}
                >
                  Trình duyệt của bạn không hỗ trợ phát video.
                </video>
              </div>

              {/* Video info */}
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDate(selectedVideo.timePublish ? selectedVideo.timePublish : "")}
                  <span className="mx-2">•</span>
                  <Tag className="w-4 h-4 mr-1" />
                  {getCategoryName(selectedVideo.categoryId? selectedVideo.categoryId : 0)}
                </div>

                <div 
                  className="text-gray-700 prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: selectedVideo.content || "" }}
                />

                {selectedVideo.tags && (
                  <div className="flex flex-wrap gap-2 pt-3">
                    {selectedVideo.tags.split(',').map((tag, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPostsGrid;