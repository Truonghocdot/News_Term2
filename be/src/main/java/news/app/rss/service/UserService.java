package news.app.rss.service;

import news.app.rss.entity.User;
import news.app.rss.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {



    @Autowired
    private UserRepository userRepository;

    public String getEmailByUserId(Long userId) {
        return userRepository.findById(userId)
                .map(User::getGmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

}
