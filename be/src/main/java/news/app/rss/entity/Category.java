package news.app.rss.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

import lombok.Data;


@Data
@Table(name="categories")
@Entity
public class Category {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String name;
	private String title;
	private String slug;
	private String metaKeywords;
	@Column(name = "meataDescription")
	private String metaDescription;
	private String thumbnail;
	private Long parentId;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
	private Long countPost;

}
