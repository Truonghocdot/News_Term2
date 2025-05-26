package news.app.rss.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import news.app.rss.entity.Reaction;

import java.util.List;
import java.util.Optional;


public interface ReactionRepository extends JpaRepository<Reaction, Long> {
    Optional<Reaction> findByUserIdAndCommentId(Long userId, Long commentId);
    List<Reaction> findByCommentId(Long commentId);
    Long countByCommentIdAndType(Long commentId, String type);
}
