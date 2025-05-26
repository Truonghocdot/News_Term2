package news.app.rss.service;

import news.app.rss.entity.Reaction;
import news.app.rss.repository.ReactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReacctionService {
    @Autowired
    private ReactionRepository reactionRepository;

    public List<Reaction> finAllReactions(){
        return reactionRepository.findAll();
    }

    public Reaction addOrUpdateReaction(Reaction reaction) {
        Optional<Reaction> existing = reactionRepository.findByUserIdAndCommentId(reaction.getUserId(), reaction.getCommentId());

        if (existing.isPresent()) {
            Reaction existingReaction = existing.get();
            existingReaction.setType(reaction.getType());
            return reactionRepository.save(existingReaction);
        } else {
            return reactionRepository.save(reaction);
        }
    }

    public void deleteReaction(Long id) {
        reactionRepository.deleteById(id);
    }

    public List<Reaction> getReactionsByCommentId(Long commentId) {
        return reactionRepository.findByCommentId(commentId);
    }

    public Long countReactionType(Long commentId, String type) {
        return reactionRepository.countByCommentIdAndType(commentId, type);
    }
}
