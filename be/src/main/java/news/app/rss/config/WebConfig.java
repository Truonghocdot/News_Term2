package news.app.rss.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Cho tất cả endpoint
                .allowedOrigins("http://localhost:3000") // Địa chỉ frontend
                .allowedMethods("*")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}