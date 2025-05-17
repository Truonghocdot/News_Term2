package news.app.rss.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import news.app.rss.entity.Comment;

public interface CommentRepository extends JpaRepository<Comment, Long> {
}
