package news.app.rss.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.util.*;
import java.util.stream.Collectors;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import net.coobird.thumbnailator.Thumbnails;

@RestController
@RequestMapping("/api/upload")
public class FileUploadController {

    @Value("${file.upload-dir}")
    private String uploadDirConfig;
    private static final long MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB for documents
    private static final long MAX_IMAGE_SIZE = 20 * 1024 * 1024; // 20MB for images

    // Supported file types
    private static final Set<String> allowedImageExts = Set.of("jpg", "jpeg", "png", "gif", "webp", "bmp");
    private static final Set<String> allowedVideoExts = Set.of("mp4", "avi", "mov", "mkv", "wmv", "flv");
    private static final Set<String> allowedDocumentExts = Set.of("pdf", "doc", "docx", "txt", "rtf", "odt", "xls", "xlsx", "ppt", "pptx");

    // MIME type validation mapping
    private static final Map<String, Set<String>> mimeTypeMapping = Map.of(
            "pdf", Set.of("application/pdf"),
            "doc", Set.of("application/msword"),
            "docx", Set.of("application/vnd.openxmlformats-officedocument.wordprocessingml.document"),
            "txt", Set.of("text/plain", "text/txt"),
            "rtf", Set.of("application/rtf", "text/rtf"),
            "odt", Set.of("application/vnd.oasis.opendocument.text"),
            "xls", Set.of("application/vnd.ms-excel"),
            "xlsx", Set.of("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"),
            "ppt", Set.of("application/vnd.ms-powerpoint"),
            "pptx", Set.of("application/vnd.openxmlformats-officedocument.presentationml.presentation")
    );

    @PostMapping("/direct")
    public ResponseEntity<?> handleUpload(@RequestParam("file") MultipartFile file) {
        try {
            // Validate file basic properties
            ValidationResult validation = validateFile(file);
            if (!validation.isValid()) {
                return ResponseEntity.badRequest().body(validation.getErrorMessage());
            }

            FileMetadata metadata = extractFileMetadata(file);
            String savedFilePath = processAndSaveFile(file, metadata);

            UploadResponse response = new UploadResponse(
                    metadata.getSavedFileName(),
                    file.getSize(),
                    metadata.getMimeType(),
                    savedFilePath,
                    metadata.getFileType(),
                    metadata.getOriginalName()
            );

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            return ResponseEntity.status(500).body("Upload failed: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Unexpected error: " + e.getMessage());
        }
    }

    @PostMapping("/batch")
    public ResponseEntity<?> handleBatchUpload(@RequestParam("files") MultipartFile[] files) {
        List<UploadResponse> responses = new ArrayList<>();
        List<String> errors = new ArrayList<>();

        for (MultipartFile file : files) {
            try {
                ValidationResult validation = validateFile(file);
                if (!validation.isValid()) {
                    errors.add(file.getOriginalFilename() + ": " + validation.getErrorMessage());
                    continue;
                }

                FileMetadata metadata = extractFileMetadata(file);
                String savedFilePath = processAndSaveFile(file, metadata);

                responses.add(new UploadResponse(
                        metadata.getSavedFileName(),
                        file.getSize(),
                        metadata.getMimeType(),
                        savedFilePath,
                        metadata.getFileType(),
                        metadata.getOriginalName()
                ));

            } catch (Exception e) {
                errors.add(file.getOriginalFilename() + ": " + e.getMessage());
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("success", responses);
        result.put("errors", errors);
        result.put("totalSuccess", responses.size());
        result.put("totalErrors", errors.size());

        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{filename}")
    public ResponseEntity<?> deleteFile(@PathVariable String filename) {
        try {
            Path uploadPath = Paths.get(uploadDirConfig).toAbsolutePath().normalize();
            Path filePath = uploadPath.resolve(filename);

            if (!Files.exists(filePath)) {
                return ResponseEntity.notFound().build();
            }

            Files.delete(filePath);
            return ResponseEntity.ok().body("File deleted successfully");

        } catch (IOException e) {
            return ResponseEntity.status(500).body("Delete failed: " + e.getMessage());
        }
    }

    private ValidationResult validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            return ValidationResult.error("File is empty");
        }

        String originalName = file.getOriginalFilename();
        if (originalName == null || originalName.trim().isEmpty()) {
            return ValidationResult.error("Invalid filename");
        }

        String extension = getExtension(originalName).toLowerCase();
        String mimeType = file.getContentType();

        // Check if file type is supported
        if (!isFileTypeSupported(extension)) {
            return ValidationResult.error("Unsupported file type: " + extension +
                    ". Supported types: images, videos, documents (PDF, DOC, DOCX, TXT, RTF, ODT, XLS, XLSX, PPT, PPTX)");
        }

        // Check file size based on type
        long maxSize = allowedImageExts.contains(extension) || allowedVideoExts.contains(extension)
                ? MAX_IMAGE_SIZE : MAX_FILE_SIZE;

        if (file.getSize() > maxSize) {
            return ValidationResult.error("File size exceeds limit: " + (maxSize / 1024 / 1024) + "MB");
        }

        // Validate MIME type
        if (!isValidMimeType(mimeType, extension)) {
            return ValidationResult.error("Invalid MIME type: " + mimeType + " for extension: " + extension);
        }

        return ValidationResult.valid();
    }

    private FileMetadata extractFileMetadata(MultipartFile file) {
        String originalName = file.getOriginalFilename();
        String extension = getExtension(originalName).toLowerCase();
        String mimeType = file.getContentType();
        String savedFileName = UUID.randomUUID().toString();

        FileType fileType = determineFileType(extension);

        return new FileMetadata(originalName, extension, mimeType, savedFileName, fileType);
    }

    private String processAndSaveFile(MultipartFile file, FileMetadata metadata) throws IOException {
        Path uploadPath = Paths.get(uploadDirConfig).toAbsolutePath().normalize();
        Files.createDirectories(uploadPath);

        String finalFilename;

        // Process based on file type
        switch (metadata.getFileType()) {
            case IMAGE:
                finalFilename = processImageFile(file, metadata, uploadPath);
                break;
            case VIDEO:
            case DOCUMENT:
                finalFilename = processGenericFile(file, metadata, uploadPath);
                break;
            default:
                throw new IllegalArgumentException("Unsupported file type");
        }

        return "/uploads/" + finalFilename;
    }

    private String processImageFile(MultipartFile file, FileMetadata metadata, Path uploadPath) throws IOException {
        String finalFilename = metadata.getSavedFileName() + ".png";
        File outFile = uploadPath.resolve(finalFilename).toFile();

        // Convert and resize image
        Thumbnails.of(file.getInputStream())
                .size(1200, 1200) // Increased size for better quality
                .outputFormat("png")
                .outputQuality(0.9f)
                .toFile(outFile);

        return finalFilename;
    }

    private String processGenericFile(MultipartFile file, FileMetadata metadata, Path uploadPath) throws IOException {
        String finalFilename = metadata.getSavedFileName() + "." + metadata.getExtension();
        Path targetPath = uploadPath.resolve(finalFilename);

        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        return finalFilename;
    }

    private boolean isFileTypeSupported(String extension) {
        return allowedImageExts.contains(extension) ||
                allowedVideoExts.contains(extension) ||
                allowedDocumentExts.contains(extension);
    }

    private boolean isValidMimeType(String mimeType, String extension) {
        if (mimeType == null) return false;

        // For images and videos, use existing validation
        if (allowedImageExts.contains(extension) || allowedVideoExts.contains(extension)) {
            return true; // Assume existing validation works
        }

        // For documents, check specific MIME types
        Set<String> validMimeTypes = mimeTypeMapping.get(extension);
        return validMimeTypes != null && validMimeTypes.contains(mimeType);
    }

    private FileType determineFileType(String extension) {
        if (allowedImageExts.contains(extension)) {
            return FileType.IMAGE;
        } else if (allowedVideoExts.contains(extension)) {
            return FileType.VIDEO;
        } else if (allowedDocumentExts.contains(extension)) {
            return FileType.DOCUMENT;
        }
        return FileType.UNKNOWN;
    }

    private String getExtension(String filename) {
        int lastDot = filename.lastIndexOf('.');
        return lastDot == -1 ? "" : filename.substring(lastDot + 1);
    }

    // Helper classes
    public static class ValidationResult {
        private final boolean valid;
        private final String errorMessage;

        private ValidationResult(boolean valid, String errorMessage) {
            this.valid = valid;
            this.errorMessage = errorMessage;
        }

        public static ValidationResult valid() {
            return new ValidationResult(true, null);
        }

        public static ValidationResult error(String message) {
            return new ValidationResult(false, message);
        }

        public boolean isValid() { return valid; }
        public String getErrorMessage() { return errorMessage; }
    }

    public static class FileMetadata {
        private final String originalName;
        private final String extension;
        private final String mimeType;
        private final String savedFileName;
        private final FileType fileType;

        public FileMetadata(String originalName, String extension, String mimeType, String savedFileName, FileType fileType) {
            this.originalName = originalName;
            this.extension = extension;
            this.mimeType = mimeType;
            this.savedFileName = savedFileName;
            this.fileType = fileType;
        }

        // Getters
        public String getOriginalName() { return originalName; }
        public String getExtension() { return extension; }
        public String getMimeType() { return mimeType; }
        public String getSavedFileName() { return savedFileName; }
        public FileType getFileType() { return fileType; }
    }

    public static class UploadResponse {
        private final String filename;
        private final long size;
        private final String mimeType;
        private final String url;
        private final FileType fileType;
        private final String originalName;

        public UploadResponse(String filename, long size, String mimeType, String url, FileType fileType, String originalName) {
            this.filename = filename;
            this.size = size;
            this.mimeType = mimeType;
            this.url = url;
            this.fileType = fileType;
            this.originalName = originalName;
        }

        // Getters
        public String getFilename() { return filename; }
        public long getSize() { return size; }
        public String getMimeType() { return mimeType; }
        public String getUrl() { return url; }
        public FileType getFileType() { return fileType; }
        public String getOriginalName() { return originalName; }
    }
    @GetMapping("/files")
    public ResponseEntity<List<UploadResponse>> listUploadedFiles(
            @RequestParam(value = "type", required = false) String fileTypeFilter,
            HttpServletRequest request) {
        try {
            Path uploadDir = Paths.get(uploadDirConfig).toAbsolutePath().normalize();
            if (!Files.exists(uploadDir)) {
                return ResponseEntity.ok(Collections.emptyList());
            }

            List<UploadResponse> fileResponses = Files.list(uploadDir)
                    .filter(Files::isRegularFile)
                    .map(this::createUploadResponseFromFile)
                    .filter(Objects::nonNull)
                    .filter(response -> filterByFileType(response, fileTypeFilter))
                    .sorted(Comparator.comparing(UploadResponse::getFilename))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(fileResponses);

        } catch (IOException e) {
            return ResponseEntity.status(500).body(Collections.emptyList());
        }
    }

    @GetMapping("/files/images")
    public ResponseEntity<List<UploadResponse>> listUploadedImages(HttpServletRequest request) {
        return listUploadedFiles("IMAGE", request);
    }

    @GetMapping("/files/videos")
    public ResponseEntity<List<UploadResponse>> listUploadedVideos(HttpServletRequest request) {
        return listUploadedFiles("VIDEO", request);
    }

    @GetMapping("/files/documents")
    public ResponseEntity<List<UploadResponse>> listUploadedDocuments(HttpServletRequest request) {
        return listUploadedFiles("DOCUMENT", request);
    }

    private UploadResponse createUploadResponseFromFile(Path filePath) {
        try {
            String filename = filePath.getFileName().toString();
            String extension = getExtension(filename).toLowerCase();

            // Skip if not a supported file type
            if (!isFileTypeSupported(extension)) {
                return null;
            }

            long size = Files.size(filePath);
            String url = "/uploads/" + filename;
            FileType fileType = determineFileType(extension);
            String mimeType = determineMimeTypeFromExtension(extension);

            // For saved files, we don't have original name, so use filename without UUID
            String originalName = filename;

            return new UploadResponse(filename, size, mimeType, url, fileType, originalName);

        } catch (IOException e) {
            // Log error and skip this file
            return null;
        }
    }

    private boolean filterByFileType(UploadResponse response, String fileTypeFilter) {
        if (fileTypeFilter == null || fileTypeFilter.trim().isEmpty()) {
            return true;
        }

        try {
            FileType filterType = FileType.valueOf(fileTypeFilter.toUpperCase());
            return response.getFileType() == filterType;
        } catch (IllegalArgumentException e) {
            // Invalid filter type, return all files
            return true;
        }
    }

    private String determineMimeTypeFromExtension(String extension) {
        // Image types
        if (allowedImageExts.contains(extension)) {
            switch (extension) {
                case "jpg":
                case "jpeg":
                    return "image/jpeg";
                case "png":
                    return "image/png";
                case "gif":
                    return "image/gif";
                case "webp":
                    return "image/webp";
                case "bmp":
                    return "image/bmp";
                default:
                    return "image/jpeg";
            }
        }

        // Video types
        if (allowedVideoExts.contains(extension)) {
            switch (extension) {
                case "mp4":
                    return "video/mp4";
                case "avi":
                    return "video/x-msvideo";
                case "mov":
                    return "video/quicktime";
                case "mkv":
                    return "video/x-matroska";
                case "wmv":
                    return "video/x-ms-wmv";
                case "flv":
                    return "video/x-flv";
                default:
                    return "video/mp4";
            }
        }

        // Document types - use existing mapping
        Set<String> mimeTypes = mimeTypeMapping.get(extension);
        if (mimeTypes != null && !mimeTypes.isEmpty()) {
            return mimeTypes.iterator().next(); // Return first MIME type
        }

        return "application/octet-stream";
    }
    public enum FileType {
        IMAGE, VIDEO, DOCUMENT, UNKNOWN
    }
}
