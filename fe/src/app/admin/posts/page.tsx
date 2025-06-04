
"use client";

import { useEffect, useState } from "react";
import EditableDataTable, { TableRow } from "@/component/TableAdmin";



const PostPage = () => {
  const [data, setData] = useState<TableRow[]>([]);
   const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/posts");
        const posts = await res.json();
        setData(posts);
      } catch (err) {
        console.error("Lỗi khi lấy bài viết:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

   const handleDataChange = (updatedData: TableRow[]) => {
    setData(updatedData);
    console.log("Updated data:", updatedData);
  };
  if (loading) return <div>Đang tải bài viết...</div>;

  return (
    <EditableDataTable
      data={data}
      onDataChange={handleDataChange}
      itemsPerPage={10}
      columns={[
        { key: "title", label: "Tiêu đề", editable: true },
        { key: "metaKeywords", label: "Từ khóa", editable: true },
        { key: "metaDescription", label: "Mô tả", editable: true },
        { key: "categoryId", label: "Danh mục", editable: true },
      ]}
    />
  );
};

export default PostPage;