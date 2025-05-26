package news.app.rss.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import news.app.rss.entity.HistoricWatched;

import java.util.List;

public interface HistoricWatchedRepository extends JpaRepository<HistoricWatched, Long> {
    List<HistoricWatched> findByUserId(Long userId);
    List<HistoricWatched> findByPostId(Long postId);
}
