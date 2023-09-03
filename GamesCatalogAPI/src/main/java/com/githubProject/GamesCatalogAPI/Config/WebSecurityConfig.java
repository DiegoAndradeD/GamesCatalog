package com.githubProject.GamesCatalogAPI.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Spring Configuration for allowing mapping to the API and permitting access to external URLs.
 */
@Configuration
public class WebSecurityConfig {

    /**
     * Configuration class for Spring to enable Web MVC and set up CORS (Cross-Origin Resource Sharing) rules.
     */
    @Configuration
    @EnableWebMvc
    public class WebConfig implements WebMvcConfigurer {
        @Override
        public void addCorsMappings(CorsRegistry registry) {
            registry.addMapping("/api/**")
                    .allowedOrigins("http://127.0.0.1:5173")
                    .allowedMethods("GET", "POST", "PUT", "DELETE");
        }
    }

    /**
     * Bean for password encryption.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}


