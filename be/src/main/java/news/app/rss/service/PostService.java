package news.app.rss.service;

import news.app.rss.dto.*;
import news.app.rss.dto.post.request.PostCreateRequestDto;
import news.app.rss.dto.post.request.PostSearchRequestDto;
import news.app.rss.dto.post.request.PostUpdateRequestDto;
import news.app.rss.dto.post.response.PostResponseDto;
import news.app.rss.entity.Post;
import news.app.rss.repository.PostRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;


@Service
@Transactional
public class PostService {

    @Autowired
    private PostRepository postRepository;

    public Page<PostResponseDto> searchPosts(PostSearchRequestDto searchDto) {
        Sort sort = Sort.by(
                "desc".equalsIgnoreCase(searchDto.getSortDirection())
                        ? Sort.Direction.DESC
                        : Sort.Direction.ASC,
                searchDto.getSortBy()
        );

        Pageable pageable = PageRequest.of(
                searchDto.getPage(),
                searchDto.getSize(),
                sort
        );

        Page<Post> posts;

        // Nếu có keyword, ưu tiên tìm kiếm bằng keyword
        if (searchDto.getKeyword() != null && !searchDto.getKeyword().trim().isEmpty()) {
            posts = postRepository.findPostsByKeyword(searchDto.getKeyword().trim(), pageable);
        }
        // Nếu có các tham số tìm kiếm nâng cao
        else if (hasAdvancedSearchParams(searchDto)) {
            posts = postRepository.findPostsWithAdvancedSearch(
                    searchDto.getTitle(),
                    searchDto.getSearchContent(),
                    searchDto.getTags(),
                    searchDto.getSearchKeywords(),
                    searchDto.getCategoryId(),
                    searchDto.getIsPublished(),
                    pageable
            );
        }
        // Nếu có các filter cơ bản
        else if (hasBasicFilters(searchDto)) {
            posts = postRepository.findPostsWithFilters(
                    searchDto.getTitle(),
                    searchDto.getTags(),
                    searchDto.getTimePublish(),
                    searchDto.getCategoryId(),
                    searchDto.getCreatedAt(),
                    searchDto.getUpdatedAt(),
                    pageable
            );
        } else {
            // Lấy tất cả posts khi không có filter
            posts = postRepository.findAll(pageable);
        }

        return posts.map(this::convertToResponseDto);
    }

    private boolean hasAdvancedSearchParams(PostSearchRequestDto searchDto) {
        return searchDto.getTitle() != null ||
                searchDto.getSearchContent() != null ||
                searchDto.getTags() != null ||
                searchDto.getSearchKeywords() != null ||
                searchDto.getCategoryId() != null ||
                searchDto.getIsPublished() != null;
    }

    private boolean hasBasicFilters(PostSearchRequestDto searchDto) {
        return searchDto.getTitle() != null ||
                searchDto.getTags() != null ||
                searchDto.getTimePublish() != null ||
                searchDto.getCategoryId() != null ||
                searchDto.getCreatedAt() != null ||
                searchDto.getUpdatedAt() != null;
    }

    public PostResponseDto createPost(PostCreateRequestDto createDto) {
        Post post = new Post();
        BeanUtils.copyProperties(createDto, post);

        if (post.getTimePublish() == null) {
            post.setTimePublish(LocalDateTime.now());
        }

        Post savedPost = postRepository.save(post);
        return convertToResponseDto(savedPost);
    }

    public PostResponseDto updatePost(Long id, PostUpdateRequestDto updateDto) {
        Optional<Post> optionalPost = postRepository.findById(id);
        if (optionalPost.isEmpty()) {
            throw new RuntimeException("Post not found with id: " + id);
        }

        Post existingPost = optionalPost.get();

        // Only update non-null fields
        if (updateDto.getTitle() != null) {
            existingPost.setTitle(updateDto.getTitle());
        }
        if (updateDto.getMetaKeywords() != null) {
            existingPost.setMetaKeywords(updateDto.getMetaKeywords());
        }
        if (updateDto.getMetaDescription() != null) {
            existingPost.setMetaDescription(updateDto.getMetaDescription());
        }
        if (updateDto.getContent() != null) {
            existingPost.setContent(updateDto.getContent());
        }
        if (updateDto.getThumbnail() != null) {
            existingPost.setThumbnail(updateDto.getThumbnail());
        }
        if (updateDto.getGallery() != null) {
            existingPost.setGallery(updateDto.getGallery());
        }
        if (updateDto.getTypes() != null) {
            existingPost.setTypes(updateDto.getTypes());
        }
        if (updateDto.getTags() != null) {
            existingPost.setTags(updateDto.getTags());
        }
        if (updateDto.getIsPublish() != null) {
            existingPost.setIsPublish(updateDto.getIsPublish());
        }
        if (updateDto.getVideo() != null) {
            existingPost.setVideo(updateDto.getVideo());
        }
        if (updateDto.getTimePublish() != null) {
            existingPost.setTimePublish(updateDto.getTimePublish());
        }
        if (updateDto.getCategoryId() != null) {
            existingPost.setCategoryId(updateDto.getCategoryId());
        }

        Post updatedPost = postRepository.save(existingPost);
        return convertToResponseDto(updatedPost);
    }

    public void deletePost(Long id) {
        if (!postRepository.existsById(id)) {
            throw new RuntimeException("Post not found with id: " + id);
        }
        postRepository.deleteById(id);
    }

    public PostResponseDto getPostById(Long id) {
        Optional<Post> optionalPost = postRepository.findById(id);
        if (optionalPost.isEmpty()) {
            throw new RuntimeException("Post not found with id: " + id);
        }
        return convertToResponseDto(optionalPost.get());
    }

    private PostResponseDto convertToResponseDto(Post post) {
        PostResponseDto responseDto = new PostResponseDto();
        BeanUtils.copyProperties(post, responseDto);
        return responseDto;
    }
}