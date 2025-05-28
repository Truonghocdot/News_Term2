package news.app.rss.dto.post.request;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class PostSearchRequestDto {
    private String title;
    private String tags;
    private LocalDateTime timePublish;
    private Long categoryId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Thêm các tùy chọn tìm kiếm mới
    private String keyword; // Tìm kiếm chung trong title, content, tags, metaKeywords
    private String searchContent; // Tìm kiếm trong content
    private String searchKeywords; // Tìm kiếm trong metaKeywords
    private Boolean isPublished; // Lọc theo trạng thái publish

    // Pagination parameters
    private int page = 0;
    private int size = 10;
    private String sortBy = "createdAt";
    private String sortDirection = "desc";
}
