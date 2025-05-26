package news.app.rss.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import news.app.rss.dto.NotificationRequest;
import news.app.rss.entity.Notification;
import news.app.rss.repository.NotificationRepository;
import news.app.rss.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    public Notification createNotification(Notification notification) {
        notification.setIsRead(false);
        notification.setCreatedAt(LocalDateTime.now());
        Notification saved = notificationRepository.save(notification);

        String userEmail = userService.getEmailByUserId(notification.getUserId());
        String subject = "📢 New Notification - " + notification.getType();
        String body = notification.getMessage();

        emailService.sendNotificationEmail(userEmail, subject, body);

        return saved;
    }
}
