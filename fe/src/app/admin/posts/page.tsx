"use client";

import { useEffect, useState } from "react";
import EditableDataTable, { TableRow } from "@/component/TableAdmin";
import axios from "axios";
import { Post } from "@/util/type";

const PostPage = () => {
  const [data, setData] = useState<TableRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/posts/list");
        if (!res.ok) throw new Error("Failed to fetch");

        const result = await res.json();
        const posts: Post[] = result.data.map((dt: any) => ({
          id: dt.id,
          title: dt.title,
          content: dt.content,
          metaKeywords: dt.metaKeywords,
          metaDescription: dt.metaDescription,
          gallery: dt.gallery,
          types: dt.types,
          isPublish: dt.isPublish,
          video: dt.video,
          categoryId: dt.categoryId,
          tags: dt.tags,
          slug: dt.slug,
          timePublish: dt.timePublish,
        }));

        const dataTable: TableRow[] = posts.map((dt) => ({
          id: dt.id,
          title: dt.title,
          content: dt.content,
          metaKeywords: dt.metaKeywords,
          metaDescription: dt.metaDescription,
          gallery: dt.gallery,
          types: dt.types,
          isPublish: dt.isPublish,
          video: dt.video,
          categoryId: dt.categoryId,
          tags: dt.tags,
          slug: dt.slug,
          timePublish: dt.timePublish,
        }));

        setData(dataTable);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteItem = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8080/api/posts/${id}`);
      return true;
    } catch (error) {
      console.error("Lỗi khi xóa bài viết:", error);
      return false;
    }
  };

  const handleDataChange = (updatedData: TableRow[]) => {
    setData(updatedData);
    console.log("Updated data:", updatedData);
  };

  const handleCreateItem = async (data: Omit<TableRow, 'id'>, image?: File): Promise<boolean> => {
    try {
      // Nếu có ảnh thì upload ảnh trước và lấy URL
      let thumbnailUrl = '';
      if (image) {
        const formData = new FormData();
        formData.append("file", image);
        const res = await axios.post("http://localhost:8080/api/upload/direct", formData);
        thumbnailUrl = res.data.url;
      }

      const payload = {
        ...data,
        thumbnail: thumbnailUrl || data.thumbnail || '',
        timePublish: data.timePublish || new Date().toISOString(), // đảm bảo không null
      };

      const response = await axios.post(
        'http://localhost:8080/api/posts/insert',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return response.status === 200 || response.status === 201;
    } catch (error: any) {
      console.error("Lỗi tạo bài viết:", error?.response?.data?.message || error.message);
      alert("Tạo bài viết thất bại: " + (error?.response?.data?.message || error.message));
      return false;
    }
  };

  const handleEditItem = async (updatedItem: TableRow): Promise<boolean> => {
      try {
        const response = await axios.put(
          `http://localhost:8080/api/posts/${updatedItem.id}`,
          updatedItem,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        return response.status === 200;
      } catch (error) {
        console.error("Lỗi khi cập nhật mục:", error);
        return false;
      }
    };

  if (loading) return <div>Đang tải bài viết...</div>;

  return (
    <EditableDataTable
      data={data}
      onDataChange={handleDataChange}
      onDelete={handleDeleteItem}
      onEdit={handleEditItem}
      onCreate={handleCreateItem}
      itemsPerPage={10}
      columns={[
        { key: "title", label: "Tiêu đề", editable: true },
        { key: "content", label: "Nội dung", editable: true },
        { key: "metaKeywords", label: "Từ khóa", editable: true },
        { key: "metaDescription", label: "Mô tả", editable: true },
        { key: "gallery", label: "Gallery", editable: true },
        { key: "types", label: "Types", editable: true },
        { key: "isPublish", label: "Đăng?", editable: true },
        { key: "video", label: "Video", editable: true },
        { key: "categoryId", label: "Danh mục", editable: true },
        { key: "tags", label: "Tags", editable: true },
        { key: "slug", label: "Slug", editable: true },
      ]}
    />
  );
};

export default PostPage;