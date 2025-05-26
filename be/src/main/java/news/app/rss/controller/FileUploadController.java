package news.app.rss.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import net.coobird.thumbnailator.Thumbnails;

@RestController
@RequestMapping("/api/upload")
public class FileUploadController {

    @Value("${upload.path}")
    private String uploadDirConfig;

    private final long MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

    private final Set<String> allowedImageExts = Set.of("jpg", "jpeg", "png", "gif");
    private final Set<String> allowedVideoExts = Set.of("mp4", "mov", "avi", "mkv", "flv", "wmv");

    public FileUploadController(@Value("${upload.path}") String uploadDirConfig) {
        try {
            Path uploadPath = Paths.get(uploadDirConfig).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory", e);
        }
    }

    @PostMapping("/direct")
    public ResponseEntity<?> handleUpload(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            return ResponseEntity.badRequest().body("File size exceeds 20MB limit");
        }

        try {
            String originalName = file.getOriginalFilename();
            String extension = getExtension(originalName).toLowerCase();
            String mimeType = file.getContentType();

            if (!allowedImageExts.contains(extension) && !allowedVideoExts.contains(extension)) {
                return ResponseEntity.badRequest().body("Unsupported file type: " + extension);
            }

            if (!isValidMimeType(mimeType, extension)) {
                return ResponseEntity.badRequest().body("Invalid MIME type: " + mimeType);
            }

            String savedFileName = UUID.randomUUID().toString();
            Path uploadPath = Paths.get(uploadDirConfig).toAbsolutePath().normalize();

            if (allowedImageExts.contains(extension)) {
                savedFileName += ".png"; // chuyển về PNG thay vì WEBP
                File outFile = uploadPath.resolve(savedFileName).toFile();

                Thumbnails.of(file.getInputStream())
                        .size(800, 800)
                        .outputFormat("png")
                        .toFile(outFile);
            } else {
                savedFileName += "." + extension;
                Path targetPath = uploadPath.resolve(savedFileName);
                Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
            }

            return ResponseEntity.ok(new UploadResponse(savedFileName, file.getSize(), mimeType));
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Upload failed: " + e.getMessage());
        }
    }

    @DeleteMapping("/{filename}")
    public ResponseEntity<?> deleteFile(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(uploadDirConfig).resolve(filename).normalize();
            if (Files.notExists(filePath)) {
                return ResponseEntity.status(404).body("File not found");
            }
            Files.delete(filePath);
            return ResponseEntity.ok("File deleted: " + filename);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Delete failed: " + e.getMessage());
        }
    }

    private String getExtension(String filename) {
        if (filename == null) return "";
        int lastDot = filename.lastIndexOf('.');
        return (lastDot == -1) ? "" : filename.substring(lastDot + 1);
    }

    private boolean isValidMimeType(String mimeType, String extension) {
        if (mimeType == null) return false;
        if (allowedImageExts.contains(extension)) return mimeType.startsWith("image/");
        if (allowedVideoExts.contains(extension)) return mimeType.startsWith("video/");
        return false;
    }

    // Phản hồi JSON khi upload thành công
    static class UploadResponse {
        private String filename;
        private long size;
        private String mimeType;

        public UploadResponse(String filename, long size, String mimeType) {
            this.filename = filename;
            this.size = size;
            this.mimeType = mimeType;
        }

        public String getFilename() { return filename; }
        public long getSize() { return size; }
        public String getMimeType() { return mimeType; }
    }
}
