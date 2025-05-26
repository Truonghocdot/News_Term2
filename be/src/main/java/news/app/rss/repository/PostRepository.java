package news.app.rss.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import news.app.rss.entity.Post;


public interface PostRepository extends JpaRepository<Post, Long> {
}
