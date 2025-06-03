"use client"

import EditableDataTable, { TableRow } from "@/component/TableAdmin";

const UserPage = () => {
    const initialData: TableRow[] = [
      { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@email.com', phone: '0123456789', position: 'Developer' },
      { id: 2, name: 'Trần Thị B', email: 'tranthib@email.com', phone: '0987654321', position: 'Designer' },
      { id: 3, name: 'Lê Văn C', email: 'levanc@email.com', phone: '0369852147', position: 'Manager' },
      { id: 4, name: 'Phạm Thị D', email: 'phamthid@email.com', phone: '0147258369', position: 'Tester' },
      { id: 5, name: 'Hoàng Văn E', email: 'hoangvane@email.com', phone: '0258147369', position: 'BA' },
      { id: 6, name: 'Vũ Thị F', email: 'vuthif@email.com', phone: '0741852963', position: 'Developer' },
      { id: 7, name: 'Đỗ Văn G', email: 'dovang@email.com', phone: '0963852741', position: 'Designer' },
      { id: 8, name: 'Bùi Thị H', email: 'buithih@email.com', phone: '0852741963', position: 'Manager' },
    ];
    
    return (
        <div>
            <EditableDataTable
            data={initialData}
            onDataChange={(updatedData) => console.log(updatedData)}
            itemsPerPage={10}
            columns={[
                 { key: 'name', label: 'Họ tên', editable: true },
                { key: 'email', label: 'Email', editable: true },
                { key: 'phone', label: 'Số điện thoại', editable: true },
                { key: 'position', label: 'Vị trí', editable: true }
            ]}
            ></EditableDataTable>
        </div>
    );
}

export default UserPage;