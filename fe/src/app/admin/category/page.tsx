"use client";

import { useEffect, useState } from "react";
import EditableDataTable from "@/component/TableAdmin";
import { Category, TableRow } from "@/util/type";
import axios from "axios";

const CategoryPage = () => {
  const [data, setData] = useState<TableRow[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/categories/list");
        if (!res.ok) throw new Error("Failed to fetch");
        const data: any[] = await res.json();
        data.forEach((dt: any) => {
          console.log(dt.slug);
        })
        const categories: Category[] = data.map((dt: any) => ({
          id: dt.id,
          name: dt.name,
          title: dt.title,
          slug: dt.slug,
          parentId: dt.parentId,
          metaKeywords: dt.metaKeywords,
          metaDescription: dt.metaDescription

        }))
        const dataTable: TableRow[] = categories.map((dt) => ({
          id: dt.id,
          name: dt.name,
          title: dt.title,
          slug: dt.slug,
          parentId: dt.parentId,
          metaKeywords: dt.metaKeywords,
          metaDescription: dt.metaDescription

        }))
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
      await axios.delete(`http://localhost:8080/api/categories/${id}`);
      return true;
    } catch (error) {
      throw error;
    }
  }
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
        thumbnail: thumbnailUrl || data.thumbnail || ''
      };

      const response = await axios.post(
        'http://localhost:8080/api/categories/insert',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return response.status === 200 || response.status === 201;
    } catch (error) {
      throw error;
    }
  };

  const handleEditItem = async (updatedItem: TableRow): Promise<boolean> => {
  try {
    const response = await axios.put(
      `http://localhost:8080/api/categories/${updatedItem.id}`,
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


  if (loading) return <div>Đang tải dữ liệu...</div>;

  return (
    <div>
      <EditableDataTable
        data={data}
        onDataChange={handleDataChange}
        onDelete={handleDeleteItem}
        onEdit={handleEditItem} 
        onCreate={handleCreateItem}
        itemsPerPage={10}
        columns={[
          {key: "id", label: "id", editable: false, nullable: false},
          { key: "name", label: "Tên", editable: true, nullable: true },
          { key: "title", label: "Tiêu đề", editable: true },
          { key: "parentId", label: "parentId", editable: true },
          {
            key: "metaKeywords", label: "từ khóa index", editable: true
          }, {
            key: "metaDescription", label: "miêu tả bài viết", editable: true
          },
          { key: "slug", label: "Đường dẫn", editable: true }
        ]}
      />
    </div>
  );
};

export default CategoryPage;
