package news.app.rss.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import news.app.rss.entity.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
	boolean existsByName(String name);
}
