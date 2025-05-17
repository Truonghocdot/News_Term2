package news.app.rss.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import news.app.rss.entity.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
}
