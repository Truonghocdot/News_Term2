"use client";

import { useEffect, useState } from "react";
import { APIPost, APICategory } from "@/util/api";
import axios from "axios";
import { Category, Post, TableRow, typeButton, typeData } from "@/util/type";
import EditableDataTablePost from "@/component/TablePostAdmin";
const PostPage = () => {
  const [data, setData] = useState<TableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataCategories, setDataCategories] = useState<Category[] | []>([])
  const aPIPost = APIPost;
  const aPICategory = APICategory;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await aPIPost.getDataField('/api/posts/list');
        const resCategory = await aPICategory.getDataField("/api/categories/list");
        if ( res.status < 300 &&  resCategory.status < 300) throw new Error("Failed to fetch");

        const result =   await res.data;
        const resultCategories =  await resCategory;
        console.log(result);
        console.log(resCategory);
        const categories: Category[] = Array.isArray(resultCategories) ? resultCategories?.map((dt: Category) =>  ({
          ...dt
        })) : [] ;
        setDataCategories(categories);
        console.log(categories)
        const posts: Post[] = Array.isArray(result) ?  result?.map((dt: Post) => ({
          ...dt
        })) : [] ;

        const dataTable: TableRow[] = posts.map((dt: Post) => ({
          ...dt
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

  const handleCreateItem = async (
    data: Omit<TableRow, "id">,
    image?: File, video?: File
  ): Promise<boolean> => {
    try {
      // Nếu có ảnh thì upload ảnh trước và lấy URL
      let thumbnailUrl = "";
      if (image) {
        const formData = new FormData();
        formData.append("file", image);
        const res = await aPIPost.uploadFile('/api/upload/direct', formData);
        thumbnailUrl = res.url;
        console.log(thumbnailUrl);
      }
      let videoUrl = "";
      if(video){
        const formDataVideo = new FormData();
        formDataVideo.append("file", video);
        const res = await aPIPost.uploadFile('/api/upload/direct', formDataVideo);
        videoUrl = res.url;
      }
      
      const payload = {
        ...data,
        thumbnail: thumbnailUrl || data.thumbnail || "",
        timePublish: data.timePublish || new Date().toISOString(),
        video: videoUrl || data.video || "" // đảm bảo không null
      };

      const response = await axios.post(
        "http://localhost:8080/api/posts/insert",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response.status === 200 || response.status === 201;
    } catch (error: any) {
      console.error(
        "Lỗi tạo bài viết:",
        error?.response?.data?.message || error.message
      );
      alert(
        "Tạo bài viết thất bại: " +
          (error?.response?.data?.message || error.message)
      );
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
            "Content-Type": "application/json",
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
    <EditableDataTablePost
      data={data}
      onDataChange={handleDataChange}
      onDelete={handleDeleteItem}
      onEdit={handleEditItem}
      onCreate={handleCreateItem}
      itemsPerPage={10}
      categories={dataCategories}
      columns={[
        {
          key: "title",
          label: "Tiêu đề",
          editable: true,
          nullable: false,
          typeButton: typeButton.TEXT,
          typeData: typeData.TEXT,
        },
        {
          key: "video",
          label: "Video",
          editable: true,
          nullable: false,
          typeButton: typeButton.TEXT,
          typeData: typeData.TEXT,
        },
        {
          key: "content",
          label: "Nội dung",
          editable: true,
          nullable: false,
          typeButton: typeButton.TEXT,
          typeData: typeData.TEXT,
        },
        {
          key: "metaKeywords",
          label: "Từ khóa",
          editable: true,
          nullable: false,
          typeButton: typeButton.TEXT,
          typeData: typeData.TEXT,
        },
        {
          key: "metaDescription",
          label: "Mô tả",
          editable: true,
          nullable: false,
          typeButton: typeButton.TEXT,
          typeData: typeData.TEXT,
        },
        {
          key: "types",
          label: "Kiểu",
          editable: true,
          nullable: false,
          typeButton: typeButton.SELECT,
          typeData: typeData.NUMBER,
        },
        {
          key: "isPublish",
          label: "Đăng?",
          editable: true,
          nullable: false,
          typeButton: typeButton.SELECT,
          typeData: typeData.BOOL,
        },
        {
          key: "categoryId",
          label: "Danh mục",
          editable: true,
          nullable: false,
          typeButton: typeButton.SELECT,
          typeData: typeData.NUMBER,
        },
        {
          key: "tags",
          label: "Tags",
          editable: true,
          nullable: false,
          typeButton: typeButton.TEXT,
          typeData: typeData.LIST,
        },
        {
          key: "slug",
          label: "Slug",
          editable: true,
          nullable: false,
          typeButton: typeButton.TEXT,
          typeData: typeData.TEXT,
        },
        {
          key: "timePublish",
          label: "Thời Gian Đăng",
          editable: true,
          nullable: false,
          typeButton: typeButton.TIME_DATE,
          typeData: typeData.TIME_DATE,
        },
        {
          key: "createdAt",
          label: "Thời Gian Tạo",
          editable: false,
          nullable: false,
          typeButton: typeButton.TIME_DATE,
          typeData: typeData.TIME_DATE,
        },{
          key: "author",
          label: "Tác Giả",
          editable: true,
          nullable: true,
          typeButton: typeButton.TEXT,
          typeData: typeData.TEXT
        }
      ]}
    />
  );
};

export default PostPage;
