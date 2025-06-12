import dayjs from "dayjs"
import React, { ReactNode, useState } from 'react';
import { Eye, Edit2, Trash2, Save, X, ChevronLeft, ChevronRight, Loader2, Plus, Upload } from 'lucide-react';
import TiptapEditor from '@/lib/post/wysiwyg';
import { EditableDataTableProps, PaginationInfo, TableColumn, TableRow, typeButton } from '@/util/type';


const EditableDataTable: React.FC<EditableDataTableProps> = ({ 
  data = [], 
  onDataChange,
  onDelete, // New prop
  onCreate, // New prop
  onEdit,
  itemsPerPage = 5,
  columns = [],
  showCreateButton = true,
  showThumbnail = true
}) => {


  // State with proper typing
  const [tableData, setTableData] = useState<TableRow[]>(data);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<Partial<TableRow>>({});
  const [viewingItem, setViewingItem] = useState<TableRow | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false); // New loading state
  const [deleteError, setDeleteError] = useState<string | null>(null); // New error state
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [contentPost, SetContentPost] = useState<string> ("");

  // Thêm state cho edit API
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editError, setEditError] = useState<string | null>(null);
  
  // Create modal states
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [createData, setCreateData] = useState<Partial<TableRow>>({});
  const [createImage, setCreateImage] = useState<File | null>(null);
  const [createImagePreview, setCreateImagePreview] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [multipleImages, setMultipleImages] = useState<File[]>([]);
  const [multiplePreviews, setMultiplePreviews] = useState<string[]>([]);

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

  const handleMultipleImageUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
  const files = Array.from(e.target.files || []);
  const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024;

  const validFiles: File[] = [];
  const previews: string[] = [];

  files.forEach(file => {
    if (!validTypes.includes(file.type)) return;
    if (file.size > maxSize) return;

    validFiles.push(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      previews.push(event.target?.result as string);
      setMultiplePreviews([...previews]);
    };
    reader.readAsDataURL(file);
  });

  setMultipleImages(validFiles);
};

  // Handle edit mode with proper typing
 // Handle edit mode
  const handleEdit = (item: TableRow): void => {
    setEditingId(item.id);
    setEditingData({ ...item });
    setEditError(null); // Reset error khi bắt đầu edit
  };

  // Handle save edit with proper typing
const handleSave = async (): Promise<void> => {
    if (editingId === null) return;
    
    setIsEditing(true);
    setEditError(null);
    
    try {
      // Tạo object với dữ liệu đã được cập nhật
      const updatedItem: TableRow = {
        ...tableData.find(item => item.id === editingId)!,
        ...editingData
      } as TableRow;
      
      // Gọi API nếu onEdit prop được cung cấp
      if (onEdit) {
        const success = await onEdit(updatedItem);
        if (!success) {
          setEditError('Có lỗi xảy ra khi cập nhật. Vui lòng thử lại.');
          return;
        }
      }
      
      // Cập nhật local state sau khi API call thành công
      const updatedData: TableRow[] = tableData.map((item: TableRow) => 
        item.id === editingId ? updatedItem : item
      );
      
      setTableData(updatedData);
      onDataChange?.(updatedData);
      setEditingId(null);
      setEditingData({});
      
    } catch (error: any) {
      console.error('Edit error:', error);
      // Xử lý các loại lỗi khác nhau
      if (error.response) {
        const statusCode = error.response.status;
        const errorMessage = error.response.data?.message || 'Có lỗi xảy ra từ server';
        setEditError(`Lỗi ${statusCode}: ${errorMessage}`);
      } else if (error.request) {
        setEditError('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
      } else {
        setEditError('Có lỗi xảy ra khi cập nhật. Vui lòng thử lại.');
      }
    } finally {
      setIsEditing(false);
    }
  };



  // Handle cancel edit with proper typing
  const handleCancel = (): void => {
    setEditingId(null);
    setEditingData({});
    setEditError(null);
  };

  // Enhanced delete handler with API call using axios
  const handleDelete = async (): Promise<void> => {
    if (deletingId === null) return;
    
    setIsDeleting(true);
    setDeleteError(null);
    
    try {
      // Call API if onDelete prop is provided
      if (onDelete) {
        const success = await onDelete(deletingId);
        if (!success) {
          setDeleteError('Có lỗi xảy ra khi xóa. Vui lòng thử lại.');
          return;
        }
      }
      
      // Update local state after successful API call
      const updatedData: TableRow[] = tableData.filter((item: TableRow) => item.id !== deletingId);
      setTableData(updatedData);
      onDataChange?.(updatedData);
      setDeletingId(null);
      
      // Adjust current page if necessary
      const newTotalPages: number = Math.ceil(updatedData.length / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    } catch (error: any) {
      console.error('Delete error:', error);
      // Handle different axios error types
      if (error.response) {
        // Server responded with error status
        const statusCode = error.response.status;
        const errorMessage = error.response.data?.message || 'Có lỗi xảy ra từ server';
        setDeleteError(`Lỗi ${statusCode}: ${errorMessage}`);
      } else if (error.request) {
        // Network error
        setDeleteError('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
      } else {
        // Other error
        setDeleteError('Có lỗi xảy ra khi xóa. Vui lòng thử lại.');
      }
    } finally {
      setIsDeleting(false);
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
    setDeleteError(null);
  };

  // Handle confirm delete with proper typing
  const handleConfirmDelete = (id: number): void => {
    setDeletingId(id);
    setDeleteError(null);
  };

  // Create modal handlers
  const handleOpenCreateModal = (): void => {
    setShowCreateModal(true);
    setCreateData({});
    setCreateImage(null);
    setCreateImagePreview(null);
    setCreateError(null);
  };

  const handleCloseCreateModal = (): void => {
    setShowCreateModal(false);
    setCreateData({});
    setCreateImage(null);
    setCreateImagePreview(null);
    setCreateError(null);
  };

  const handleCreateInputChange = (key: string, value: string): void => {
    setCreateData((prev: Partial<TableRow>) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setCreateError('Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WebP)');
        return;
      }

      // Validate file size (5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setCreateError('Kích thước file không được vượt quá 5MB');
        return;
      }

      setCreateImage(file);
      setCreateError(null);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setCreateImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (): void => {
    setCreateImage(null);
    setCreateImagePreview(null);
  };

  const handleCreate = async (): Promise<void> => {
    setIsCreating(true);
    setCreateError(null);

    try {
      // Validate required fields
      const requiredFields = columns.filter(col => col.nullable);
      const missingFields = requiredFields.filter(field => !createData[field.key]);
      
      if (missingFields.length > 0) {
        setCreateError(`Vui lòng điền đầy đủ thông tin: ${missingFields.map(f => f.label).join(', ')}`);
        return;
      }

      // Call API if onCreate prop is provided
      if (onCreate) {
        const success = await onCreate(createData as Omit<TableRow, 'id'>, createImage || undefined);
        if (!success) {
          setCreateError('Có lỗi xảy ra khi tạo mới. Vui lòng thử lại.');
          return;
        }
      }

      // Add to local state (generate temporary ID)
      const newId = Math.max(...tableData.map(item => item.id), 0) + 1;
      const newItem: TableRow = { id: newId, ...createData } as TableRow;
      const updatedData = [...tableData, newItem];
      
      setTableData(updatedData);
      onDataChange?.(updatedData);
      handleCloseCreateModal();
      
    } catch (error: any) {
      console.error('Create error:', error);
      // Handle different axios error types
      if (error.response) {
        const statusCode = error.response.status;
        const errorMessage = error.response.data?.message || 'Có lỗi xảy ra từ server';
        setCreateError(`Lỗi ${statusCode}: ${errorMessage}`);
      } else if (error.request) {
        setCreateError('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
      } else {
        setCreateError('Có lỗi xảy ra khi tạo mới. Vui lòng thử lại.');
      }
    } finally {
      setIsCreating(false);
    }
  };

  // Render cell content with proper typing
  const renderCellContent = (item: TableRow, column: TableColumn): React.ReactNode => {
  const value = item[column.key]

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
    )
  }

  let displayValue: React.ReactNode

  if (value instanceof Date) {
    displayValue = dayjs(value).format("DD/MM/YYYY HH:mm") // định dạng tùy chọn
  } else if (typeof value === 'boolean') {
    displayValue = value ? "✅ Có" : "❌ Không"
  } else {
    displayValue = String(value ?? "")
  }

  return <span className="block truncate">{displayValue}</span>
}

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
          onClick={() => handleConfirmDelete(item.id)}
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý dữ liệu</h2>
        {showCreateButton && (
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            type="button"
          >
            <Plus className="h-4 w-4 mr-2" />
            Tạo mới
          </button>
        )}
      </div>


       {/* CẢI TIẾN: Hiển thị error message khi edit */}
      {editError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{editError}</p>
        </div>
      )}
      
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-l max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Chi tiết bản ghi</h3>
            <div className="space-y-4">
              {columns.map((column: TableColumn) => {
                let renderNode: ReactNode;
                const val: any = viewingItem[column.key];
                renderNode = val;
                if(val instanceof Date) {
                  renderNode = dayjs(val).format("DD/MM/YYYY HH:mm");
                }
                return (
                <div key={column.key} className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    {column.label}:
                  </label>
                  <div className="px-3 py-2 bg-gray-50 rounded-md text-sm text-gray-900">
                    {renderNode}
                  </div>
                </div>
              );
              })}
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

      {/* Enhanced Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Xác nhận xóa</h3>
            <p className="text-sm text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa bản ghi này? Hành động này không thể hoàn tác.
            </p>
            
            {/* Error message */}
            {deleteError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{deleteError}</p>
              </div>
            )}
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCloseDeleteModal}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                type="button"
              >
                Hủy
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
                type="button"
              >
                {isDeleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {isDeleting ? 'Đang xóa...' : 'Xóa'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-l max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tạo mới bản ghi</h3>
              
              {/* Image Upload Section */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ảnh đại diện
                </label>
                <div className="flex flex-col items-center justify-center w-full">
                  {createImagePreview ? (
                    <div className="relative w-full h-48 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <img
                        src={createImagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        type="button"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-4 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click để upload</span> hoặc kéo thả
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF (MAX. 5MB)</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}
                </div>
              </div>

             { showThumbnail && <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bộ sưu tập ảnh
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleMultipleImageUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0 file:text-sm file:font-semibold
                            file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {multiplePreviews.map((src, index) => (
                    <img key={index} src={src} className="w-full h-24 object-cover rounded-md border" alt={`Ảnh ${index + 1}`} />
                  ))}
                </div>
              </div> } 


              {/* Form Fields */}
              <div className="space-y-4">
                {columns.filter(col => col.editable ).map((column: TableColumn) => (
                  <div key={column.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    {column.label} { column.nullable && <span className="text-red-500">*</span>}
                    </label>
                      { column.key !== "content" && <input
                        type="text"
                        value={(createData[column.key] as string) || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                          handleCreateInputChange(column.key, e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={`Nhập ${column.label.toLowerCase()}`}
                      />}
                      {
                        column.key === "content" && <TiptapEditor onChange={SetContentPost} value={contentPost}  />
                      }
                  </div>
                ))}
              </div>

              {/* Error message */}
              {createError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{createError}</p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={handleCloseCreateModal}
                  disabled={isCreating}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  type="button"
                >
                  Hủy
                </button>
                <button
                  onClick={handleCreate}
                  disabled={isCreating}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
                  type="button"
                >
                  {isCreating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {isCreating ? 'Đang tạo...' : 'Tạo mới'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditableDataTable;