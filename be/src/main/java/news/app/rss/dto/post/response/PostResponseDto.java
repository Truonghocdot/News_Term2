package news.app.rss.dto.post.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PostResponseDto {
    private Long id;
    private String title;
    private String metaKeywords;
    private String metaDescription;
    private String content;
    private String thumbnail;
    private String gallery;
    private String types;
    private String tags;
    private Boolean isPublish;
    private String video;
    private LocalDateTime timePublish;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long categoryId;
}