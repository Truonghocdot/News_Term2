"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import EditableDataTable from "@/component/TableAdmin";
import { TableRow, User } from "@/util/type";

const UserPage = () => {
  const [data, setData] = useState<TableRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/auth/list");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        const users: User[] = data.map((dt: any) => ({
          id: dt.userId,
          ...dt
        }));
        const dataTable : TableRow[] = users.map((u) => ({
          id: u.id,
          username: u.username,
          gmail: u.gmail,
          numberphone: u.numberphone,
          sex: u.sex,
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

  const handleDataChange =  (updatedData: TableRow[]) => {
    setData(updatedData);
    console.log("Updated data:", updatedData);
  };

 const handleDeleteItem = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8080/api/auth/${id}`);
      return true;
    } catch (error) {
      throw error;
    }
  }

  if (loading) return <div>Đang tải dữ liệu...</div>;

  return (
    <div>
      <EditableDataTable
        data={data}
        onDataChange={handleDataChange}
        onDelete={handleDeleteItem}
        itemsPerPage={10}
        columns={[
          { key: "username", label: "Họ tên", editable: true },
          { key: "gmail", label: "Email", editable: true },
          { key: "numberphone", label: "Số điện thoại", editable: true },
        ]}
      />
    </div>
  );
};

export default UserPage;
