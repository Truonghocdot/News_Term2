package news.app.rss.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import news.app.rss.entity.Token;


public interface TokenRepository extends JpaRepository<Token, Long> {

    Optional<Token> findByToken(String token);

    void deleteByToken(String token); 
    boolean existsByToken(String token); 
}