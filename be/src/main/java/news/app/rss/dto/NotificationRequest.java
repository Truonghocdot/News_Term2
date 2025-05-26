package news.app.rss.dto;

import lombok.Data;

@Data
public class NotificationRequest {
    private Long userId;
    private String type;
    private String message;
    private String email;
}
