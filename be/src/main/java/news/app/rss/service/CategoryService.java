package news.app.rss.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import news.app.rss.entity.Category;
import news.app.rss.repository.CategoryRepository;

@Service
public class CategoryService {
	@Autowired
    private CategoryRepository categoryRepository;

    public List<Category> getAll() {
        return categoryRepository.findAll();
    }

    public Optional<Category> findById(Long id) {
        return categoryRepository.findById(id);
    }

    @Transactional
    public Category save(Category category) {
        category.setCreatedAt(LocalDateTime.now());
        category.setUpdatedAt(LocalDateTime.now());
        return categoryRepository.save(category);
    }

    public void deleteById(Long id) {
        categoryRepository.deleteById(id);
    }

    public boolean existsById(Long id) {
        return categoryRepository.existsById(id);
    }

    public Category findBySlug(String slug) {
        return  categoryRepository.findBySlug(slug);
    }
}
