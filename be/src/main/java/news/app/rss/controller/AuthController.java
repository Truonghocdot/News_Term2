package news.app.rss.controller;


import java.util.Map;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;


import jakarta.servlet.http.HttpServletRequest;
import news.app.rss.component.JwtUtil;
import news.app.rss.entity.Role;
import news.app.rss.entity.User;
import news.app.rss.model.AuthRequest;
import news.app.rss.model.AuthResponse;
import news.app.rss.model.UserModel;
import news.app.rss.repository.RoleRepository;
import news.app.rss.service.MyUserDetailsService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

	@Autowired
	private AuthenticationManager authManager;

	@Autowired
	private JwtUtil jwtUtil;

	@Autowired
	private MyUserDetailsService userDetailsService;

	@Autowired
	RoleRepository repositoryRoleRepository;

	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody AuthRequest request) {

		try {
			Authentication authentication = authManager.authenticate(
					new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

			UserDetails userDetails = (UserDetails) authentication.getPrincipal();

			User user = userDetailsService.getUser(userDetails.getUsername())
					.orElseThrow(() -> new RuntimeException("User not found"));

			String token = jwtUtil.generateToken(userDetails, user.getUsername() ,user.getGmail());

			return ResponseEntity.ok(new AuthResponse(token));

		} catch (AuthenticationException e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
		}
	}

	@PostMapping("/register")
	public ResponseEntity<?> register(@RequestBody UserModel userModel) {
		Role role = repositoryRoleRepository.findByRoleName(userModel.getRoleName()).get();
		var passencrypt=new BCryptPasswordEncoder().encode(userModel.getPassword());
		userModel.setPassword(passencrypt);
		User user = new User(userModel, role);
		User u = userDetailsService.insert(user);
		return ResponseEntity.ok(u);
	}

	@GetMapping("/admin")
	@PreAuthorize("hasAnyRole('ADMIN')")
	public String admin() {
		return "Chào Admin";
	}


	@GetMapping("/getprofile")
	@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
	public ResponseEntity<?> getMyProfile(@RequestHeader("Authorization") String authHeader) {
		String token = authHeader.replace("Bearer ", "");
		String username = jwtUtil.extractUsername(token);
		String gmail = jwtUtil.extractEmail(token);

		return ResponseEntity.ok(Map.of("username", username, "gmail", gmail));
	}


	@GetMapping("/refresh")
	@PreAuthorize("hasAnyRole('ADMIN')")
	public ResponseEntity<AuthResponse> refreshToken(HttpServletRequest request) {
		final String authHeader = request.getHeader("Authorization");
		if (authHeader == null || !authHeader.startsWith("Bearer ")) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}

		String oldToken = authHeader.substring(7);
		String username = jwtUtil.extractUsername(oldToken);

		UserDetails userDetails = userDetailsService.loadUserByUsername(username);

		if (!jwtUtil.validateToken(oldToken, userDetails)) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
		}

		User user = userDetailsService.getUser(userDetails.getUsername())
				.orElseThrow(() -> new RuntimeException("User not found"));

		String newToken = jwtUtil.generateToken(userDetails, user.getUsername(), user.getGmail());
		return ResponseEntity.ok(new AuthResponse(newToken));
	}
}