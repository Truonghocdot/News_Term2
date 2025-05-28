package news.app.rss.dto.post.request;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PostUpdateRequestDto {
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
    private Long categoryId;
}