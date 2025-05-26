package news.app.rss.service;

import jakarta.transaction.Transactional;
import news.app.rss.entity.Comment;
import news.app.rss.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    public List<Comment> getAllComments() {
        return commentRepository.findAll();
    }

    public Optional<Comment> getCommentById(Long id) {
        return commentRepository.findById(id);
    }

    @Transactional
    public Comment createComment(Comment comment) {
        comment.setCreatedAt(LocalDateTime.now());
        comment.setUpdatedAt(LocalDateTime.now());

        return commentRepository.save(comment);
    }

    public Comment updateComment(Long id, Comment newComment) {
        return commentRepository.findById(id).map(comment -> {
            comment.setContents(newComment.getContents());
            comment.setTypes(newComment.getTypes());
            comment.setUpdatedAt(LocalDateTime.now());
            return commentRepository.save(comment);
        }).orElse(null);
    }

    public void deleteComment(Long id) {
        commentRepository.deleteById(id);
    }

    public List<Comment> getCommentsByParentId(int parentId) {
        return commentRepository.findByParentId(parentId);
    }

    public List<Comment> getCommentsByUserId(int userId) {
        return commentRepository.findByUserId(userId);
    }
}
