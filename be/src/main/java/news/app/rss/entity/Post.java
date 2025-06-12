package news.app.rss.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "posts")
public class Post {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String title;
	private String slug;
	private String metaKeywords;
	private String metaDescription;
	private String content;
	private String thumbnail;
	private String types;
	private String tags;
	private Boolean isPublish;
	private String video;
	private Long categoryId;
	private LocalDateTime timePublish;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
	private String author;
}
