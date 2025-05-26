package news.app.rss.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;


@Data
@Table(name="comments")
@Entity
public class Comment {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private int userId;
	private int parentId;
	private String types;
	private String contents;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;

}
