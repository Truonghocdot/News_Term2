package news.app.rss.repository;

import java.util.Optional;


import org.springframework.data.jpa.repository.JpaRepository;

import news.app.rss.entity.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByRoleName(String name);
}
