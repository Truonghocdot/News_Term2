package news.app.rss.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import news.app.rss.entity.Category;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
	boolean existsByName(String name);

    List<Category> slug(String slug);

    Category findBySlug(String slug);
}
