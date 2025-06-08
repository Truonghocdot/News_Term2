import React, { useState, useRef, ChangeEvent, DragEvent, JSX, useEffect } from 'react';
import { 
  Upload, X, Plus, FileImage, AlertCircle, File, FileText, 
  FileSpreadsheet, Presentation, Video, Download, Eye 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileItem, FileType, UniversalFileGalleryProps, UploadProgress, UploadResponse } from '@/util/type';
import { redirect } from 'next/navigation';


const UniversalFileGallery: React.FC<UniversalFileGalleryProps> = ({ 
  initialFiles, 
  onFilesChange,
  maxFiles = 20,
  maxFileSize = 50 * 1024 * 1024, // 50MB
  allowedTypes = {
    images: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp'],
    documents: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'application/rtf',
      'application/vnd.oasis.opendocument.text',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ],
    videos: ['video/mp4', 'video/avi', 'video/mov', 'video/mkv']
  },
  uploadEndpoint = '/api/files/direct',
  deleteEndpoint = '/api/files/',
  enablePagination = true,
  filesPerPage = 12
}) => {
  const [files, setFiles] = useState<FileItem[]>([...initialFiles]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [dragOver, setDragOver] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    setFiles([...initialFiles]);
  }, [initialFiles]);
  // Pagination logic
  const totalPages: number = Math.ceil(files.length / filesPerPage);
  const startIndex: number = (currentPage - 1) * filesPerPage;
  const endIndex: number = startIndex + filesPerPage;
  const currentFiles: FileItem[] = enablePagination ? files.slice(startIndex, endIndex) : files;

  const getFileIcon = (file: FileItem, className: string = "h-8 w-8"): JSX.Element => {
    const mimeType: string = file.mimeType || '';
    const fileType: FileType = file.fileType || determineFileType(mimeType);

    switch (fileType) {
      case 'IMAGE':
        return <FileImage className={className} />;
      case 'VIDEO':
        return <Video className={className} />;
      case 'DOCUMENT':
        if (mimeType.includes('pdf')) {
          return <FileText className={`${className} text-red-500`} />;
        } else if (mimeType.includes('sheet') || mimeType.includes('excel')) {
          return <FileSpreadsheet className={`${className} text-green-500`} />;
        } else if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) {
          return <Presentation className={`${className} text-orange-500`} />;
        } else {
          return <FileText className={`${className} text-blue-500`} />;
        }
      default:
        return <File className={className} />;
    }
  };

  const determineFileType = (mimeType: string): FileType => {
    if (!mimeType) return 'UNKNOWN';
    
    if (mimeType.startsWith('image/')) return 'IMAGE';
    if (mimeType.startsWith('video/')) return 'VIDEO';
    if (allowedTypes.documents.includes(mimeType)) return 'DOCUMENT';
    
    return 'UNKNOWN';
  };

  const getAllowedTypes = (): string[] => {
    return [
      ...allowedTypes.images,
      ...allowedTypes.documents,
      ...allowedTypes.videos
    ];
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k: number = 1024;
    const sizes: string[] = ['Bytes', 'KB', 'MB', 'GB'];
    const i: number = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    const allowedTypesFlat: string[] = getAllowedTypes();
    
    if (!allowedTypesFlat.includes(file.type)) {
      return `File type ${file.type} not supported`;
    }
    
    if (file.size > maxFileSize) {
      return `File size exceeds ${formatFileSize(maxFileSize)} limit`;
    }
    
    return null;
  };

  const handleFileSelect = (fileList: FileList | null): void => {
    if (!fileList) return;
    
    const fileArray: File[] = Array.from(fileList);
    
    // Validate files
    const validFiles: File[] = [];
    const errors: string[] = [];
    
    fileArray.forEach((file: File) => {
      const error: string | null = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    if (files.length + validFiles.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    if (errors.length > 0) {
      setError(errors.join('; '));
      return;
    }

    if (validFiles.length > 0) {
      uploadFiles(validFiles);
    }
  };

  const uploadFiles = async (fileList: File[]): Promise<void> => {
    setUploading(true);
    setError('');
    
    const uploadPromises: Promise<FileItem>[] = fileList.map(async (file: File, index: number): Promise<FileItem> => {
      const fileId: string = `${Date.now()}-${index}`;
      
      try {
        setUploadProgress((prev: UploadProgress) => ({ ...prev, [fileId]: 0 }));
        
        const formData: FormData = new FormData();
        formData.append('file', file);

        const response: Response = await fetch(uploadEndpoint, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorText: string = await response.text();
          throw new Error(errorText);
        }

        const result: UploadResponse = await response.json();
        
        setUploadProgress((prev: UploadProgress) => ({ ...prev, [fileId]: 100 }));
        
        return {
          ...result,
          originalName: file.name,
          fileType: determineFileType(file.type),
          uploadedAt: new Date().toISOString()
        };
      } catch (error: any) {
        setUploadProgress((prev: UploadProgress) => ({ ...prev, [fileId]: -1 }));
        throw new Error(`${file.name}: ${error.message}`);
      } finally {
        setTimeout(() => {
          setUploadProgress((prev: UploadProgress) => {
            const newProgress: UploadProgress = { ...prev };
            delete newProgress[fileId];
            return newProgress;
          });
        }, 2000);
      }
    });

    try {
      const results: FileItem[] = await Promise.all(uploadPromises);
      const updatedFiles: FileItem[] = [...files, ...results];
      setFiles(updatedFiles);
      onFilesChange?.(updatedFiles);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = async (file: FileItem, index: number): Promise<void> => {
    try {
      const actualIndex: number = enablePagination ? startIndex + index : index;
      
      if (file.filename) {
        const response: Response = await fetch(`${deleteEndpoint}${file.filename}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete file from server');
        }
      }
      
      const updatedFiles: FileItem[] = files.filter((_: FileItem, i: number) => i !== actualIndex);
      setFiles(updatedFiles);
      onFilesChange?.(updatedFiles);
      
      // Adjust current page if necessary
      if (enablePagination && updatedFiles.length <= startIndex && currentPage > 1) {
        setCurrentPage((prev: number) => prev - 1);
      }
    } catch (error: any) {
      setError(`Failed to delete file: ${error.message}`);
    }
  };

  const handlePreview = (file: FileItem): void => {
    if (file.url) {
      redirect('localhost:8080'+ file.url +'_blank')
    }
  };

  const handleDownload = (file: FileItem): void => {
    if (file.url) {
      const link: HTMLAnchorElement = document.createElement('a');
      link.href = file.url;
      link.download = file.originalName || file.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const renderFilePreview = (file: FileItem): JSX.Element => {
    if (file.fileType === 'IMAGE' && file.url) {
      return (
        <img
          src={"localhost:8080" + file.url}
          alt={file.originalName}
          className="w-full h-full object-cover"
          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            if (target.nextSibling) {
              (target.nextSibling as HTMLElement).style.display = 'flex';
            }
          }}
        />
      );
    }
    
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50">
        {getFileIcon(file, "h-12 w-12")}
        <span className="text-xs mt-2 text-gray-600 text-center px-2 line-clamp-2">
          {file.originalName || file.filename}
        </span>
      </div>
    );
  };

  // Event handlers for drag and drop
  const handleDragOver = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const openFileDialog = (): void => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    handleFileSelect(e.target.files);
  };

  const handlePageChange = (newPage: number): void => {
    setCurrentPage(newPage);
  };

  const clearError = (): void => {
    setError('');
  };

  return (
    <div className="w-full space-y-6">
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${uploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={getAllowedTypes().join(',')}
          onChange={handleFileInputChange}
          className="hidden"
        />
        
        <div className="flex flex-col items-center space-y-3">
          {uploading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          ) : (
            <Upload className="h-10 w-10 text-gray-400" />
          )}
          
          <div>
            <p className="text-lg font-medium text-gray-700">
              {uploading ? 'Uploading files...' : 'Drop files here or click to upload'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Support: Images, Documents (PDF, DOC, XLS, PPT, TXT), Videos
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Maximum {formatFileSize(maxFileSize)} per file, up to {maxFiles} files total
            </p>
          </div>
        </div>

        {/* Upload Progress */}
        {Object.keys(uploadProgress).length > 0 && (
          <div className="mt-4 space-y-2">
            {Object.entries(uploadProgress).map(([fileId, progress]: [string, number]) => (
              <div key={fileId} className="bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    progress === -1 ? 'bg-red-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.max(0, progress)}%` }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
        >
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
          <button
            onClick={clearError}
            className="ml-auto hover:text-red-900 flex-shrink-0"
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}

      {/* Files Grid */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-800">
              Files ({files.length}/{maxFiles})
            </h3>
            
            {enablePagination && totalPages > 1 && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  type="button"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  type="button"
                >
                  Next
                </button>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            <AnimatePresence>
              {currentFiles.map((file: FileItem, index: number) => (
                <motion.div
                  key={file.url || file.filename || index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group"
                >
                  <div className="aspect-square bg-white rounded-lg border-2 border-gray-200 overflow-hidden hover:border-gray-300 transition-colors">
                    {renderFilePreview(file)}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {file.fileType !== 'VIDEO' && (
                      <button
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                          e.stopPropagation();
                          handlePreview(file);
                        }}
                        className="p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 text-xs"
                        title="Preview"
                        type="button"
                      >
                        <Eye className="h-3 w-3" />
                      </button>
                    )}
                    
                    <button
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation();
                        handleDownload(file);
                      }}
                      className="p-1 bg-green-500 text-white rounded-full hover:bg-green-600 text-xs"
                      title="Download"
                      type="button"
                    >
                      <Download className="h-3 w-3" />
                    </button>
                    
                    <button
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation();
                        handleRemoveFile(file, index);
                      }}
                      className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 text-xs"
                      title="Delete"
                      type="button"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                  
                  {/* File Info */}
                  <div className="mt-2 text-xs text-gray-600">
                    <p className="truncate font-medium" title={file.originalName || file.filename}>
                      {file.originalName || file.filename}
                    </p>
                    <p className="text-gray-400">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Empty State */}
      {files.length == 0 && !uploading && (
        <div className="text-center py-12">
          <File className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No files uploaded yet</p>
          <p className="text-gray-400 text-sm mt-1">
            Upload images, documents, or videos to get started
          </p>
        </div>
      )}
    </div>
  );
};
export default UniversalFileGallery;