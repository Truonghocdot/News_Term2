export interface Post {
  id: string
  title?: string
  content?: string
  metaKeywords?: string
  metaDescription?: string
  thumbnail?: string
  gallery?: string
  types?: string
  isPublish?: boolean
  video?: string
  categoryId?: Category
  timePublish?: Date
  createdAt?: Date
  updatedAt?: Date
  tags?: string[]
  slug?: string

}


export interface Category {
  id: number
  name?: string
  title?: string
  slug?: string
  parentId?: string
  createdAt?: Date
  updatedAt?: Date
  metaKeywords?: string
  metaDescription?: string
  thumbnail?: string
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
