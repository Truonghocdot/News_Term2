package news.app.rss.service;

import news.app.rss.entity.Role;
import news.app.rss.entity.User;
import news.app.rss.repository.RoleRepository;
import news.app.rss.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class MyUserDetailsService implements UserDetailsService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private RoleRepository roleRepository;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User user = userRepository.findByUsername(username)
				.orElseThrow(() -> new UsernameNotFoundException("User not found"));

		Role currentRole = roleRepository.findRoleByRoleId(user.getRoleId());

		// Tạo danh sách GrantedAuthority từ role
		List<GrantedAuthority> authorities = Collections.singletonList(
				new SimpleGrantedAuthority("ROLE_" + currentRole.getRoleName()) // Ví dụ: ROLE_ADMIN
		);

		return new org.springframework.security.core.userdetails.User(
				user.getUsername(),
				user.getPassword(),
				authorities
		);
	}

	public Optional<User> getUser(String username) {
		return userRepository.findByUsername(username);
	}

	public User insert(User user) {
		return userRepository.save(user);
	}
}
