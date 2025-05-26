package news.app.rss.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import news.app.rss.entity.Comment;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByParentId(int parentId);
    List<Comment> findByUserId(int userId);
}
