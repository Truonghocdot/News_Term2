package news.app.rss.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import news.app.rss.entity.Reaction;


public interface ReactionRepository extends JpaRepository<Reaction, Long> {
}
