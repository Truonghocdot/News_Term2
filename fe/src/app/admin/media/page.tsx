"use client"

import UniversalFileGallery from "@/component/TableMediaAdmin";
import { FileItem } from "@/util/type";
import axios from "axios";
import { useEffect, useState } from "react";


const MediaPage = () => {

    const [files, setFiles] = useState<FileItem[]>([]);

    useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/upload/files/images");
        const data: FileItem[] = res.data;
        setFiles(data);
        console.log(data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    fetchData();
  }, []);

    
    
    const handleFilesChange = (newFiles: FileItem[]): void => {
      console.log('Files updated:', newFiles);
      setFiles(newFiles);
    };
    return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Universal File Gallery</h1>
      
      <UniversalFileGallery
        initialFiles={files}
        onFilesChange={handleFilesChange}
        maxFiles={20}
        maxFileSize={50 * 1024 * 1024} // 50MB
        enablePagination={true}
        filesPerPage={12}
        uploadEndpoint="/api/files/direct"
        deleteEndpoint="/api/files/"
      />
      
      {/* Display current files data */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium mb-2">Current Files Data:</h3>
        <pre className="text-sm text-gray-600 overflow-x-auto max-h-60">
          {JSON.stringify(files, null, 4)}
        </pre>
      </div>
    </div>
  );
}
export default MediaPage;


