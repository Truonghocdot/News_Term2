package news.app.rss.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import news.app.rss.entity.Category;
import news.app.rss.service.CategoryService;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
	@Autowired
    private CategoryService categoryService;

    @GetMapping("/slug")
    public Category getCategoryBySlug(@RequestParam("slug") String slug) {return categoryService.findBySlug(slug);}
	
	//show
    @GetMapping("/list")
    public List<Category> getAll() {
        return categoryService.getAll();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Category> getById(@PathVariable Long id) {
        return categoryService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    //thêm
    @PostMapping("/insert")
    public ResponseEntity<Category> create(@Valid @RequestBody Category category) {
        Category saved = categoryService.save(category);
        return ResponseEntity.ok(saved);
    }
    //sửa
    @PutMapping("/update/{id}")
    public ResponseEntity<Category> update(@PathVariable Long id, @Valid @RequestBody Category updatedCategory) {
        if (!categoryService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        updatedCategory.setId(id); // đảm bảo cập nhật đúng ID
        return ResponseEntity.ok(categoryService.save(updatedCategory));
    }
    //xóa
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!categoryService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        categoryService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
