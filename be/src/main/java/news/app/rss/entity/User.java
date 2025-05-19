package news.app.rss.entity;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.Data;

import news.app.rss.model.UserModel;


@Data
@Entity
@Table(name = "users")

public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Long userId;
    @Column(name="name")
    private String username;
    private String image;
    private String gmail;
    private String password;
    private String googleid;
    private String fbid;
    private LocalDateTime birthday;
    private Boolean sex;
    private String numberphone;
    private String address;
    private String degree;
    private String job;
    private String levelatwork;
    private String industry;
    private String income;
    private Long roleId;
    public User() {

    }
    public User(UserModel model, Role role) {
        this.username = model.getUsername();
        this.password = model.getPassword();
        this.gmail = model.getGmail();
        this.roleId = role.getRoleId();
    }
}
