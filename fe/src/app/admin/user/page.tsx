"use client";

import { useEffect, useState } from "react";
import EditableDataTable, { TableRow } from "@/component/TableAdmin";

const UserPage = () => {
  const [data, setData] = useState<TableRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/auth/list");
        if (!res.ok) throw new Error("Failed to fetch");
        const users = await res.json();
        setData(users);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDataChange = (updatedData: TableRow[]) => {
    setData(updatedData);
    console.log("Updated data:", updatedData);
  };

  if (loading) return <div>Đang tải dữ liệu...</div>;

  return (
    <div>
      <EditableDataTable
        data={data}
        onDataChange={handleDataChange}
        itemsPerPage={10}
        columns={[
          { key: "username", label: "Họ tên", editable: true },
          { key: "gmail", label: "Email", editable: true },
          { key: "phone", label: "Số điện thoại", editable: true },
          { key: "position", label: "Vị trí", editable: true },
        ]}
      />
    </div>
  );
};

export default UserPage;
