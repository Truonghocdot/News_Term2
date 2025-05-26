package news.app.rss.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import news.app.rss.entity.User;


public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}