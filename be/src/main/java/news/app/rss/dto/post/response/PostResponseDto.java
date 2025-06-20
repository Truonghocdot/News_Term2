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
    private String slug;
    private String thumbnail;
    private String types;
    private String tags;
    private Boolean isPublish;
    private String video;
    private LocalDateTime timePublish;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long categoryId;
    private String author;
    private long countViews;
//
//    public PostResponseDto(Long id, String title, String metaKeywords, String metaDescription, String content, String slug, String thumbnail, String types, String tags, Boolean isPublish, String video, LocalDateTime timePublish, LocalDateTime createdAt, LocalDateTime updatedAt, Long categoryId, String author, long countViews) {
//        this.id = id;
//        this.title = title;
//        this.metaKeywords = metaKeywords;
//        this.metaDescription = metaDescription;
//        this.content = content;
//        this.slug = slug;
//        this.thumbnail = thumbnail;
//        this.types = types;
//        this.tags = tags;
//        this.isPublish = isPublish;
//        this.video = video;
//        this.timePublish = timePublish;
//        this.createdAt = createdAt;
//        this.updatedAt = updatedAt;
//        this.categoryId = categoryId;
//        this.author = author;
//        this.countViews = countViews;
//    }
}