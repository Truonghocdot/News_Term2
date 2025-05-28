package news.app.rss.component;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {
	private final String SECRET = "welcome_to_project_sem2_java_spring_boot";

	public String generateToken(UserDetails userDetails, String username, String gmail) {
		Map<String, Object> claims = new HashMap<>();
		claims.put("username", username);
		claims.put("gmail", gmail);
//		System.out.println("Generating token for: " + username + " - " + gmail);
		return Jwts.builder()
				.setClaims(claims)
				.setSubject(userDetails.getUsername())
				.setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // 1 giờ
				.signWith(Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8)))
				.compact();

	}


	private Claims extractAllClaims(String token) {
		return Jwts.parserBuilder()
				.setSigningKey(Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8)))
				.build()
				.parseClaimsJws(token)
				.getBody();
	}

	public String extractEmail(String token) {
		return extractAllClaims(token).get("gmail", String.class);
	}
	public String extractUsername(String token) {
		return extractAllClaims(token).getSubject();
	}
	public boolean isTokenExpired(String token) {
		Date expiration = extractAllClaims(token).getExpiration();
		return expiration.before(new Date());
	}
	public boolean validateToken(String token, UserDetails userDetails) {
		try {
			final String username = extractUsername(token);
			return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
		} catch (Exception e) {
			System.out.println("Token validation error: " + e.getMessage());
			return false;
		}
	}
}
