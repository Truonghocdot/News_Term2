package news.app.rss.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name="token")
@Entity
public class Token {
	
	@Id
	private Long id;
	private String token;
	private String userId;
	private LocalDateTime expiryDate;
	private LocalDateTime createdAt;
	
	public Token(String token) {
		this.token = token;
	}
}
