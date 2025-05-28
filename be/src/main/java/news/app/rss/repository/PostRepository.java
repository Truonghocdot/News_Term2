package news.app.rss.repository;

import news.app.rss.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    @Query("""
        SELECT p FROM Post p 
        WHERE (
            (:title IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :title, '%')))
            OR (:tags IS NULL OR LOWER(p.tags) LIKE LOWER(CONCAT('%', :tags, '%')))
            OR (:timePublish IS NULL OR p.timePublish >= :timePublish)
            OR (:categoryId IS NULL OR p.categoryId = :categoryId)
            OR (:createdAtFrom IS NULL OR p.createdAt >= :createdAtFrom)
            OR (:updatedAtFrom IS NULL OR p.updatedAt >= :updatedAtFrom)
        )
        AND NOT (
            :title IS NULL AND :tags IS NULL AND :timePublish IS NULL 
            AND :categoryId IS NULL AND :createdAtFrom IS NULL AND :updatedAtFrom IS NULL
        )
        """)
    Page<Post> findPostsWithFilters(
            @Param("title") String title,
            @Param("tags") String tags,
            @Param("timePublish") LocalDateTime timePublish,
            @Param("categoryId") Long categoryId,
            @Param("createdAtFrom") LocalDateTime createdAtFrom,
            @Param("updatedAtFrom") LocalDateTime updatedAtFrom,
            Pageable pageable
    );

    // Method để lấy tất cả posts khi không có filter nào
    Page<Post> findAll(Pageable pageable);

    // Method tìm kiếm với từ khóa chung (search trong title, content, tags)
    @Query("""
        SELECT p FROM Post p 
        WHERE (:keyword IS NULL OR 
               LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
               LOWER(p.content) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
               LOWER(p.tags) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
               LOWER(p.metaKeywords) LIKE LOWER(CONCAT('%', :keyword, '%'))
              )
        """)
    Page<Post> findPostsByKeyword(@Param("keyword") String keyword, Pageable pageable);

    // Method tìm kiếm linh hoạt với nhiều tiêu chí OR
    @Query("""
        SELECT DISTINCT p FROM Post p 
        WHERE (
            (:searchTitle IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :searchTitle, '%')))
            OR (:searchContent IS NULL OR LOWER(p.content) LIKE LOWER(CONCAT('%', :searchContent, '%')))
            OR (:searchTags IS NULL OR LOWER(p.tags) LIKE LOWER(CONCAT('%', :searchTags, '%')))
            OR (:searchKeywords IS NULL OR LOWER(p.metaKeywords) LIKE LOWER(CONCAT('%', :searchKeywords, '%')))
            OR (:categoryId IS NULL OR p.categoryId = :categoryId)
            OR (:isPublished IS NULL OR p.isPublish = :isPublished)
        )
        AND NOT (
            :searchTitle IS NULL AND :searchContent IS NULL AND :searchTags IS NULL 
            AND :searchKeywords IS NULL AND :categoryId IS NULL AND :isPublished IS NULL
        )
        """)
    Page<Post> findPostsWithAdvancedSearch(
            @Param("searchTitle") String searchTitle,
            @Param("searchContent") String searchContent,
            @Param("searchTags") String searchTags,
            @Param("searchKeywords") String searchKeywords,
            @Param("categoryId") Long categoryId,
            @Param("isPublished") Boolean isPublished,
            Pageable pageable
    );
}