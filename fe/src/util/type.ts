export interface Post {
  id: number
  title?: string
  content?: string
  metaKeywords?: string
  metaDescription?: string
  thumbnail?: string
  types?: string
  isPublish?: boolean
  video?: string
  categoryId?: number
  timePublish?: string
  createdAt?: string
  updatedAt?: string
  tags?: string
  slug?: string,
  author?: string,
  countViews?: number

}
export interface Category {
  id: number
  name?: string
  title?: string
  slug?: string
  parentId?: number
  createdAt?: Date
  updatedAt?: Date
  metaKeywords?: string
  metaDescription?: string
  thumbnail?: string
  countPost?: number
}

export interface User {
  id: number
  email?: string
  roleId?: number
  avatar?: string
  birthday?: Date
  degree?: string
  job?: string
  sex?: boolean
  username?: string
  image?: string
  gmail?: string
  googleid?: string
  fbid?: string
  numberphone?: string
  address?: string
  levelatwork?: string
  industry?: string
  income?: string
}


// Type definitions
export interface FileItem {
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  url: string;
  fileType: FileType;
  uploadedAt?: string;
}

export type FileType = 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'UNKNOWN';

export interface AllowedFileTypes {
  images: string[];
  documents: string[];
  videos: string[];
}

export interface UploadProgress {
  [fileId: string]: number;
}

export interface UniversalFileGalleryProps {
  initialFiles: FileItem[];
  onFilesChange?: (files: FileItem[]) => void;
  maxFiles?: number;
  maxFileSize?: number;
  allowedTypes?: AllowedFileTypes;
  uploadEndpoint?: string;
  deleteEndpoint?: string;
  enablePagination?: boolean;
  filesPerPage?: number;
}

export interface UploadResponse {
  filename: string;
  size: number;
  mimeType: string;
  url: string;
  fileType: FileType;
  originalName: string;
}


export enum typeButton {
  TIME_DATE = "TIME_DATE",
  TEXT = "TEXT",
  SELECT = "SELECT",
  NUMBER = "NUMBER"
} 

export enum typeData {
  TIME_DATE = "TIME_DATE",
  TEXT = "TEXT",
  BOOL = "BOOL",
  NUMBER = "NUMBER",
  LIST = "LIST"
}


// Type definitions
export interface TableRow {
  id: number;
  [key: string]: string | number | undefined | boolean | Date | BigInt; 
}
 
export interface TableColumn {
  key: string;
  label: string;
  editable: boolean;
  nullable?: boolean;
  typeButton?: typeButton;
  typeData?: typeData;
}

export interface EditableDataTableProps {
  data?: TableRow[];
  onDataChange?: (data: TableRow[]) => void;
  onDelete?: (id: number) => Promise<boolean>; // New prop for delete API
  onCreate?: (data: Omit<TableRow, 'id'>, image?: File, video?: File) => Promise<boolean>; // New prop for create API
  onEdit?: (item: TableRow) => Promise<boolean>;
  itemsPerPage?: number;
  columns?: TableColumn[];
  showCreateButton?: boolean;
  showThumbnail?: boolean; // Control create button visibility
  categories?: Category[] | []
}


export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
}
