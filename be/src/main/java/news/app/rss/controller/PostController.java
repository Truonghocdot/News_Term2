package news.app.rss.controller;
import jakarta.validation.Valid;
import news.app.rss.dto.post.request.PostCreateRequestDto;
import news.app.rss.dto.post.request.PostSearchRequestDto;
import news.app.rss.dto.post.request.PostUpdateRequestDto;
import news.app.rss.dto.post.response.PostResponseDto;
import news.app.rss.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*")
public class PostController {

    @Autowired
    private PostService postService;

    /**
     * GET - Lấy danh sách posts với filter và pagination (sử dụng OR logic)
     * URL: GET /api/posts
     * Request Parameters:
     * - keyword: tìm kiếm chung trong title, content, tags, metaKeywords
     * - title, tags, timePublish, categoryId, createdAt, updatedAt: filter cơ bản
     * - searchContent, searchKeywords, isPublished: tìm kiếm nâng cao
     * - page, size, sortBy, sortDirection: pagination
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getPosts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String tags,
            @RequestParam(required = false) String timePublish,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String createdAt,
            @RequestParam(required = false) String updatedAt,
            @RequestParam(required = false) String searchContent,
            @RequestParam(required = false) String searchKeywords,
            @RequestParam(required = false) Boolean isPublished,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection) {

        try {
            PostSearchRequestDto searchDto = new PostSearchRequestDto();
            searchDto.setKeyword(keyword);
            searchDto.setTitle(title);
            searchDto.setTags(tags);
            searchDto.setCategoryId(categoryId);
            searchDto.setSearchContent(searchContent);
            searchDto.setSearchKeywords(searchKeywords);
            searchDto.setIsPublished(isPublished);
            searchDto.setPage(page);
            searchDto.setSize(size);
            searchDto.setSortBy(sortBy);
            searchDto.setSortDirection(sortDirection);

            // Parse date strings if provided
            if (timePublish != null && !timePublish.isEmpty()) {
                searchDto.setTimePublish(java.time.LocalDateTime.parse(timePublish));
            }
            if (createdAt != null && !createdAt.isEmpty()) {
                searchDto.setCreatedAt(java.time.LocalDateTime.parse(createdAt));
            }
            if (updatedAt != null && !updatedAt.isEmpty()) {
                searchDto.setUpdatedAt(java.time.LocalDateTime.parse(updatedAt));
            }

            Page<PostResponseDto> posts = postService.searchPosts(searchDto);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", posts.getContent());
            response.put("totalElements", posts.getTotalElements());
            response.put("totalPages", posts.getTotalPages());
            response.put("currentPage", posts.getNumber());
            response.put("size", posts.getSize());
            response.put("hasNext", posts.hasNext());
            response.put("hasPrevious", posts.hasPrevious());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error retrieving posts: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * GET by ID - Lấy post theo ID
     * URL: GET /api/posts/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getPostById(@PathVariable Long id) {
        try {
            PostResponseDto post = postService.getPostById(id);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", post);

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error retrieving post: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * POST - Tạo post mới
     * URL: POST /api/posts
     * Request Body: PostCreateRequestDto
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createPost(@Valid @RequestBody PostCreateRequestDto createDto) {
        try {
            PostResponseDto createdPost = postService.createPost(createDto);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Post created successfully");
            response.put("data", createdPost);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error creating post: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    /**
     * PUT - Cập nhật post
     * URL: PUT /api/posts/{id}
     * Request Body: PostUpdateRequestDto
     */
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updatePost(
            @PathVariable Long id,
            @RequestBody PostUpdateRequestDto updateDto) {
        try {
            PostResponseDto updatedPost = postService.updatePost(id, updateDto);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Post updated successfully");
            response.put("data", updatedPost);

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error updating post: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    /**
     * DELETE - Xóa post theo ID
     * URL: DELETE /api/posts/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deletePost(@PathVariable Long id) {
        try {
            postService.deletePost(id);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Post deleted successfully");

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error deleting post: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
