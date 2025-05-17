package news.app.rss.entity;

import java.time.LocalDateTime;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Table(name = "posts")
public class Post {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String text;
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

	public Post() {
		// TODO Auto-generated constructor stub
	}

	public Post(Long id, String text, String metaKeywords, String metaDescription, String content, String thumbnail,
			String gallery, String types, String tags, Boolean isPublish, String video, LocalDateTime timePublish,
			LocalDateTime createdAt, LocalDateTime updatedAt) {
		super();
		this.id = id;
		this.text = text;
		this.metaKeywords = metaKeywords;
		this.metaDescription = metaDescription;
		this.content = content;
		this.thumbnail = thumbnail;
		this.gallery = gallery;
		this.types = types;
		this.tags = tags;
		this.isPublish = isPublish;
		this.video = video;
		this.timePublish = timePublish;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public String getMetaKeywords() {
		return metaKeywords;
	}

	public void setMetaKeywords(String metaKeywords) {
		this.metaKeywords = metaKeywords;
	}

	public String getMetaDescription() {
		return metaDescription;
	}

	public void setMetaDescription(String metaDescription) {
		this.metaDescription = metaDescription;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getThumbnail() {
		return thumbnail;
	}

	public void setThumbnail(String thumbnail) {
		this.thumbnail = thumbnail;
	}

	public String getGallery() {
		return gallery;
	}

	public void setGallery(String gallery) {
		this.gallery = gallery;
	}

	public String getTypes() {
		return types;
	}

	public void setTypes(String types) {
		this.types = types;
	}

	public String getTags() {
		return tags;
	}

	public void setTags(String tags) {
		this.tags = tags;
	}

	public Boolean getIsPublish() {
		return isPublish;
	}

	public void setIsPublish(Boolean isPublish) {
		this.isPublish = isPublish;
	}

	public String getVideo() {
		return video;
	}

	public void setVideo(String video) {
		this.video = video;
	}

	public LocalDateTime getTimePublish() {
		return timePublish;
	}

	public void setTimePublish(LocalDateTime timePublish) {
		this.timePublish = timePublish;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}
	
	

}
