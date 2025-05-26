package news.app.rss.controller;

import java.util.List;
import java.util.Optional;

import news.app.rss.entity.Comment;
import news.app.rss.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @GetMapping
    public List<Comment> getAllComments() {
        return commentService.getAllComments();
    }

    @GetMapping("/{id}")
    public Optional<Comment> getCommentById(@PathVariable Long id) {
        return commentService.getCommentById(id);
    }

    @PostMapping
    public Comment createComment(@RequestBody Comment comment) {
        return  commentService.createComment(comment);
    }

    @PutMapping("/{id}")
    public Comment updateComment(@PathVariable Long id, @RequestBody Comment comment) {
        return commentService.updateComment(id, comment);
    }

    @DeleteMapping("/{id}")
    public void deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
    }

    @GetMapping("/parent/{parentId}")
    public List<Comment> getByParentId(@PathVariable int parentId) {
        return commentService.getCommentsByParentId(parentId);
    }

    @GetMapping("/user/{userId}")
    public List<Comment> getByUserId(@PathVariable int userId) {
        return commentService.getCommentsByUserId(userId);
    }
}
