package news.app.rss.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import news.app.rss.entity.HistoricWatched;

public interface HistoricWatchedRepository extends JpaRepository<HistoricWatched, Long> {
}
