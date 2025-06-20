"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Category, Post, TableRow, User } from "@/util/type";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


interface HistoricWatched {
  id: number;
  userId: number;
  postId: number;
  createdAt: string; // ISO date string
}

interface UploadFile {
  filename: string;
  fileType: string;
}

interface Reaction {
  id: number;
  commentId: number;
}

interface Comment {
  id: number;
}


export default function Dashboard() {
  const [data, setData] = useState<TableRow[]>([]);
  const [stats, setStats] = useState({
    posts: 0,
    categories: [] as Category[],
    videos: 0,
    views: 0,
    reactions: 0,
    comments: 0,
    topViewedPosts: [] as { id: number; title: string; views: number }[],
    categoryCounts: {} as Record<string, number>,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Gọi API để lấy dữ liệu
  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {};

        const requests = [
          axios.get("http://localhost:8080/api/posts/list", config).catch((err) => {
            console.error("Posts API error:", err);
            return { data: { data: [], totalElements: 0 } };
          }),
          axios.get("http://localhost:8080/api/categories/list", config).catch((err) => {
            console.error("Categories API error:", err);
            return { data: [] };
          }),
          axios.get("http://localhost:8080/api/upload/files/videos", config).catch((err) => {
            console.error("Videos API error:", err);
            return { data: [] };
          }),
          axios.get("http://localhost:8080/api/historic-watched", config).catch((err) => {
            console.error("Views API error:", err);
            return { data: [] };
          }),
          axios.get("http://localhost:8080/api/reactions", config).catch((err) => {
            console.error("Reactions API error:", err);
            return { data: [] };
          }),
          axios.get("http://localhost:8080/api/comments", config).catch((err) => {
            console.error("Comments API error:", err);
            return { data: [] };
          }),
          axios.get("http://localhost:8080/api/users", config).catch((err) => {
            console.error("Users API error:", err);
            return { data: [] };
          }),
        ];

        const [postsRes, categoriesRes, videosRes, viewsRes, reactionsRes, commentsRes, usersRes] = await Promise.all(requests);

        const postsData: Post[] = postsRes.data.data || [];
        const categoriesData: Category[] = categoriesRes.data || [];
        const videosData: UploadFile[] = videosRes.data || [];
        const viewsData: HistoricWatched[] = viewsRes.data || [];
        const reactionsData: Reaction[] = reactionsRes.data || [];
        const commentsData: Comment[] = commentsRes.data || [];
        const usersData: User[] = usersRes.data || [];

        // Tính số bài viết theo danh mục
        const categoryCounts = postsData.reduce((acc: Record<string, number>, post: Post) => {
          if (post.categoryId) {
            acc[post.categoryId] = (acc[post.categoryId] || 0) + 1;
          }
          return acc;
        }, {});

        // Ánh xạ danh mục với số bài viết
        const categories = categoriesData.map((cat: Category) => ({
          id: cat.id,
          name: cat.name || "Không xác định",
          count: categoryCounts[cat.id] || 0,
        }));

        // Tính bài viết được xem nhiều nhất trong tuần
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        console.log("One week ago:", oneWeekAgo.toISOString());
        console.log("Views data:", viewsData);

        const weeklyViews = viewsData.filter((view) => {
          const viewDate = new Date(view.createdAt);
          return viewDate >= oneWeekAgo;
        });
        console.log("Weekly views:", weeklyViews);

        const viewCounts = weeklyViews.reduce((acc: Record<number, number>, view) => {
          acc[view.postId] = (acc[view.postId] || 0) + 1;
          return acc;
        }, {});
        console.log("View counts:", viewCounts);

        const topViewedPosts = Object.entries(viewCounts)
          .map(([postId, views]) => {
            const post = postsData.find((p) => p.id === Number(postId));
            return {
              id: Number(postId),
              title: post?.title || "Bài viết không tồn tại",
              views,
            };
          })
          .sort((a, b) => b.views - a.views)
          .slice(0, 5);
        console.log("Top viewed posts:", topViewedPosts);

        // Chuyển đổi dữ liệu bài viết thành định dạng TableRow
        const dataTable: TableRow[] = postsData.map((post: Post) => {
          
          return {
            id: post.id,
            title: post.title || "Không có tiêu đề",
            category: categories.find((cat: Category) => cat.id === post.categoryId)?.name || "Không xác định",
            isPublish: post.isPublish ? "Đã xuất bản" : "Chưa xuất bản",
            author: post.author,
          };
        });

        setStats({
          posts: postsRes.data.totalElements || 0,
          categories,
          videos: videosData.length || 0,
          views: viewsData.length || 0,
          reactions: reactionsData.length || 0,
          comments: commentsData.length || 0,
          topViewedPosts,
          categoryCounts,
        });
        setData(dataTable);
        setLoading(false);
      } catch (err) {
        setError("Lỗi khi lấy dữ liệu: " + (err as Error).message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Xử lý cập nhật dữ liệu bảng
  const handleDataChange = async (updatedData: TableRow[]) => {
    setData(updatedData);
    console.log("Updated posts:", updatedData);
    try {
      const config = {};
      const usersRes = await axios.get("http://localhost:8080/api/users", config);
      const usersData: User[] = usersRes.data || [];

      for (const row of updatedData) {
        const category = stats.categories.find((cat) => cat.name === row.category);
        const user = usersData.find((u) => u.username === row.author);
        await axios.put(
          `http://localhost:8080/api/posts/${row.id}`,
          {
            title: row.title,
            categoryId: category ? category.id : null,
            isPublish: row.isPublish === "Đã xuất bản",
            author: row.id
          },
          config
        );
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật bài viết:", err);
    }
  };

  // Xử lý xóa bài viết
  const handleDeleteItem = async (id: number) => {
    try {
      const config = {};
      await axios.delete(`http://localhost:8080/api/posts/${id}`, config);
      return true;
    } catch (error) {
      throw error;
    }
  };

  // Dữ liệu cho biểu đồ danh mục
  const categoryChartData = {
    labels: stats.categories.length > 0 ? stats.categories.map((cat) => cat.name) : ["Không có danh mục"],
    datasets: [
      {
        label: "Số bài viết",
        data: stats.categories.length > 0 ? stats.categories.map((cat) => cat.id || 0) : [0],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl">Đang tải dữ liệu...</div>;

  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600 text-xl">Lỗi: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h3 className="text-3xl font-bold mb-6 text-gray-800">Dashboard Báo Điện Tử</h3>
      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">Số lượng bài viết</h2>
          <p className="text-3xl font-bold text-blue-600">{stats.posts}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">Số lượng danh mục</h2>
          <p className="text-3xl font-bold text-green-600">{stats.categories.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">Số lượng video</h2>
          <p className="text-3xl font-bold text-purple-600">{stats.videos}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">Lượt xem</h2>
          <p className="text-3xl font-bold text-orange-600">{stats.views}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">Lượt tương tác</h2>
          <p className="text-3xl font-bold text-red-600">{stats.reactions}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">Số bình luận</h2>
          <p className="text-3xl font-bold text-indigo-600">{stats.comments}</p>
        </div>
      </div>

      {/* Biểu đồ */}
      <div className="mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Phân bố bài viết theo danh mục</h2>
          <Bar
            data={categoryChartData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Số bài viết theo danh mục" },
              },
            }}
          />
        </div>
      </div>

      {/* Bài viết xem nhiều nhất trong tuần */}
      <div className="mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Bài viết xem nhiều nhất trong tuần</h2>
          {stats.topViewedPosts.length > 0 ? (
            <ul className="list-disc pl-5">
              {stats.topViewedPosts.map((post) => (
                <li key={post.id} className="mb-2">
                  <span className="font-medium">{post.title}</span> - {post.views} lượt xem
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">Không có bài viết nào được xem trong tuần qua.</p>
          )}
        </div>
      </div>

      
    </div>
  );
}