package news.app.rss.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.GenerationType;

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
	private String metaKeywords;
	private String meataDescription;
	private String thumbnail;
	private Long parentId;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;

}
