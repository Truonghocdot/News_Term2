package news.app.rss.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import news.app.rss.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
