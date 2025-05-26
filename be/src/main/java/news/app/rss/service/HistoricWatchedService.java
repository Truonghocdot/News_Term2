package news.app.rss.service;

import news.app.rss.entity.HistoricWatched;
import news.app.rss.repository.HistoricWatchedRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class HistoricWatchedService {

    @Autowired
    private HistoricWatchedRepository repository;

    public HistoricWatchedService(HistoricWatchedRepository repository) {
        this.repository = repository;
    }

    public List<HistoricWatched> getAll() {
        return repository.findAll();
    }

    public Optional<HistoricWatched> getById(Long id) {
        return repository.findById(id);
    }

    public HistoricWatched create(HistoricWatched hw) {
        hw.setCreatedAt(LocalDateTime.now());
        return repository.save(hw);
    }

    public HistoricWatched update(Long id, HistoricWatched hw) {
        return repository.findById(id).map(existing -> {
            existing.setUserId(hw.getUserId());
            existing.setPostId(hw.getPostId());
            existing.setCreatedAt(hw.getCreatedAt());
            return repository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Not found"));
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public List<HistoricWatched> getByUserId(Long userId) {
        return repository.findByUserId(userId);
    }

    public List<HistoricWatched> getByPostId(Long postId) {
        return repository.findByPostId(postId);
    }
}
