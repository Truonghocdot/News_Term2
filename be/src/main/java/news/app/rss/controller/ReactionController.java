package news.app.rss.controller;

import news.app.rss.entity.Reaction;
import news.app.rss.service.ReacctionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reactions")
public class ReactionController {

    @Autowired
    ReacctionService reacctionService;

    @GetMapping
    public List<Reaction> getAllReactions(){
        return reacctionService.finAllReactions();
    }

    @PostMapping
    public ResponseEntity<Reaction> reactToComment(@RequestBody Reaction reaction) {
        Reaction saved = reacctionService.addOrUpdateReaction(reaction);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public void  deleteReaction(@PathVariable Long id) {
        reacctionService.deleteReaction(id);
    }

    @GetMapping("/comment/{commentId}")
    public ResponseEntity<List<Reaction>> getReactions(@PathVariable Long commentId) {
        return ResponseEntity.ok(reacctionService.getReactionsByCommentId(commentId));
    }

    @GetMapping("/comment/{commentId}/count/{type}")
    public ResponseEntity<Long> countReactions(
            @PathVariable Long commentId,
            @PathVariable String type) {
        return ResponseEntity.ok(reacctionService.countReactionType(commentId, type));
    }
}
