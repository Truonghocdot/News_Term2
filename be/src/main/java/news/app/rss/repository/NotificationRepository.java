package news.app.rss.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import news.app.rss.entity.Notification;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);
}
