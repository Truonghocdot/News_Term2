package news.app.rss.dto.post.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PostCreateRequestDto {
    @NotBlank(message = "Title is required")
    private String title;
    private String slug;
    private String metaKeywords;
    private String metaDescription;

    @NotBlank(message = "Content is required")
    private String content;

    private String thumbnail;
    private String gallery;
    private String types;
    private String tags;
    private Boolean isPublish = false;
    private String video;
    private LocalDateTime timePublish;

    @NotNull(message = "Category ID is required")
    private Long categoryId;
}
