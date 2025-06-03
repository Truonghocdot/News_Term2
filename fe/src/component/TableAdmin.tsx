import React, { useState } from 'react';
import { Eye, Edit2, Trash2, Save, X, ChevronLeft, ChevronRight } from 'lucide-react';

// Type definitions
export interface TableRow {
  id: number;
  [key: string]: string | number;
}
 
export interface TableColumn {
  key: string;
  label: string;
  editable: boolean;
}

export interface EditableDataTableProps {
  data?: TableRow[];
  onDataChange?: (data: TableRow[]) => void;
  itemsPerPage?: number;
  columns?: TableColumn[];
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
}

// Sample data structure
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

const defaultColumns: TableColumn[] = [
  { key: 'name', label: 'Họ tên', editable: true },
  { key: 'email', label: 'Email', editable: true },
  { key: 'phone', label: 'Số điện thoại', editable: true },
  { key: 'position', label: 'Vị trí', editable: true }
];

const EditableDataTable: React.FC<EditableDataTableProps> = ({ 
  data = initialData, 
  onDataChange,
  itemsPerPage = 5,
  columns = defaultColumns
}) => {
  // State with proper typing
  const [tableData, setTableData] = useState<TableRow[]>(data);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<Partial<TableRow>>({});
  const [viewingItem, setViewingItem] = useState<TableRow | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Pagination logic with proper typing
  const paginationInfo: PaginationInfo = {
    totalPages: Math.ceil(tableData.length / itemsPerPage),
    currentPage,
    startIndex: (currentPage - 1) * itemsPerPage,
    endIndex: (currentPage - 1) * itemsPerPage + itemsPerPage
  };

  const currentData: TableRow[] = tableData.slice(
    paginationInfo.startIndex, 
    paginationInfo.endIndex
  );

  // Handle edit mode with proper typing
  const handleEdit = (item: TableRow): void => {
    setEditingId(item.id);
    setEditingData({ ...item });
  };

  // Handle save edit with proper typing
  const handleSave = (): void => {
    if (editingId === null) return;
    
    const updatedData: TableRow[] = tableData.map((item: TableRow) => 
      item.id === editingId ? { ...item, ...editingData } as TableRow : item
    );
    
    setTableData(updatedData);
    onDataChange?.(updatedData);
    setEditingId(null);
    setEditingData({});
  };

  // Handle cancel edit with proper typing
  const handleCancel = (): void => {
    setEditingId(null);
    setEditingData({});
  };

  // Handle delete with proper typing
  const handleDelete = (): void => {
    if (deletingId === null) return;
    
    const updatedData: TableRow[] = tableData.filter((item: TableRow) => item.id !== deletingId);
    setTableData(updatedData);
    onDataChange?.(updatedData);
    setDeletingId(null);
    
    // Adjust current page if necessary
    const newTotalPages: number = Math.ceil(updatedData.length / itemsPerPage);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }
  };

  // Handle input change during editing with proper typing
  const handleInputChange = (key: string, value: string): void => {
    setEditingData((prev: Partial<TableRow>) => ({
      ...prev,
      [key]: value
    }));
  };

  // Handle view details with proper typing
  const handleView = (item: TableRow): void => {
    setViewingItem(item);
  };

  // Pagination handlers with proper typing
  const goToPage = (page: number): void => {
    setCurrentPage(Math.max(1, Math.min(page, paginationInfo.totalPages)));
  };

  const goToPrevious = (): void => {
    goToPage(currentPage - 1);
  };

  const goToNext = (): void => {
    goToPage(currentPage + 1);
  };

  // Generate page numbers array with proper typing
  const generatePageNumbers = (): number[] => {
    return Array.from({ length: paginationInfo.totalPages }, (_, i: number) => i + 1);
  };

  // Handle modal close with proper typing
  const handleCloseViewModal = (): void => {
    setViewingItem(null);
  };

  const handleCloseDeleteModal = (): void => {
    setDeletingId(null);
  };

  // Render cell content with proper typing
  const renderCellContent = (item: TableRow, column: TableColumn): React.ReactNode => {
    if (editingId === item.id && column.editable) {
      return (
        <input
          type="text"
          value={(editingData[column.key] as string) || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
            handleInputChange(column.key, e.target.value)
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      );
    }
    return <span className="block truncate">{item[column.key]}</span>;
  };

  // Render action buttons with proper typing
  const renderActionButtons = (item: TableRow): React.ReactNode => {
    if (editingId === item.id) {
      return (
        <>
          <button
            onClick={handleSave}
            className="inline-flex items-center justify-center w-8 h-8 text-green-600 bg-green-50 hover:bg-green-100 rounded-md transition-colors"
            title="Lưu"
            type="button"
          >
            <Save className="h-4 w-4" />
          </button>
          <button
            onClick={handleCancel}
            className="inline-flex items-center justify-center w-8 h-8 text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
            title="Hủy"
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </>
      );
    }

    return (
      <>
        <button
          onClick={() => handleView(item)}
          className="inline-flex items-center justify-center w-8 h-8 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
          title="Xem chi tiết"
          type="button"
        >
          <Eye className="h-4 w-4" />
        </button>
        <button
          onClick={() => handleEdit(item)}
          className="inline-flex items-center justify-center w-8 h-8 text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-md transition-colors"
          title="Chỉnh sửa"
          type="button"
        >
          <Edit2 className="h-4 w-4" />
        </button>
        <button
          onClick={() => setDeletingId(item.id)}
          className="inline-flex items-center justify-center w-8 h-8 text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
          title="Xóa"
          type="button"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Quản lý dữ liệu</h2>
      
      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {columns.map((column: TableColumn) => (
                <th key={column.key} className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  {column.label}
                </th>
              ))}
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentData.map((item: TableRow, index: number) => (
              <tr key={item.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}>
                {columns.map((column: TableColumn) => (
                  <td key={column.key} className="px-6 py-4 text-sm text-gray-900">
                    {renderCellContent(item, column)}
                  </td>
                ))}
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    {renderActionButtons(item)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6 px-2">
        <div className="text-sm text-gray-600">
          Hiển thị <span className="font-medium">{paginationInfo.startIndex + 1}</span> đến{' '}
          <span className="font-medium">{Math.min(paginationInfo.endIndex, tableData.length)}</span> của{' '}
          <span className="font-medium">{tableData.length}</span> bản ghi
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={goToPrevious}
            disabled={currentPage === 1}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            type="button"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Trước
          </button>
          
          <div className="flex items-center space-x-1">
            {generatePageNumbers().map((page: number) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`inline-flex items-center justify-center w-10 h-10 text-sm font-medium rounded-md transition-colors ${
                  currentPage === page
                    ? 'text-white bg-blue-600 hover:bg-blue-700'
                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                }`}
                type="button"
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={goToNext}
            disabled={currentPage === paginationInfo.totalPages}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            type="button"
          >
            Sau
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>

      {/* View Details Modal */}
      {viewingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Chi tiết bản ghi</h3>
            <div className="space-y-4">
              {columns.map((column: TableColumn) => (
                <div key={column.key} className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    {column.label}:
                  </label>
                  <div className="px-3 py-2 bg-gray-50 rounded-md text-sm text-gray-900">
                    {viewingItem[column.key]}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={handleCloseViewModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                type="button"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Xác nhận xóa</h3>
            <p className="text-sm text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa bản ghi này? Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCloseDeleteModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                type="button"
              >
                Hủy
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                type="button"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditableDataTable;