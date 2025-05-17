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
import news.app.rss.model.UserModel;


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
    
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_roles", 
        joinColumns = @JoinColumn(name = "user_id"),       
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    @JsonIgnoreProperties("users")
    private Set<Role> roles = new HashSet<>();

    public User() {
		// TODO Auto-generated constructor stub
	}

    public User(UserModel model, Role role) {
        this.username = model.getUsername();
        this.password = model.getPassword();
        this.gmail = model.getEmail();
    	this.roles.add(role);
    }

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}


	public String getGmail() {
		return gmail;
	}

	public void setGmail(String gmail) {
		this.gmail = gmail;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getGoogleid() {
		return googleid;
	}

	public void setGoogleid(String googleid) {
		this.googleid = googleid;
	}

	public String getFbid() {
		return fbid;
	}

	public void setFbid(String fbid) {
		this.fbid = fbid;
	}

	public LocalDateTime getBirthday() {
		return birthday;
	}

	public void setBirthday(LocalDateTime birthday) {
		this.birthday = birthday;
	}

	public Boolean getSex() {
		return sex;
	}

	public void setSex(Boolean sex) {
		this.sex = sex;
	}

	public String getNumberphone() {
		return numberphone;
	}

	public void setNumberphone(String numberphone) {
		this.numberphone = numberphone;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getDegree() {
		return degree;
	}

	public void setDegree(String degree) {
		this.degree = degree;
	}

	public String getJob() {
		return job;
	}

	public void setJob(String job) {
		this.job = job;
	}

	public String getLevelatwork() {
		return levelatwork;
	}

	public void setLevelatwork(String levelatwork) {
		this.levelatwork = levelatwork;
	}

	public String getIndustry() {
		return industry;
	}

	public void setIndustry(String industry) {
		this.industry = industry;
	}

	public String getIncome() {
		return income;
	}

	public void setIncome(String income) {
		this.income = income;
	}

	public Long getRoleId() {
		return roleId;
	}

	public void setRoleId(Long roleId) {
		this.roleId = roleId;
	}

	public Set<Role> getRoles() {
		return roles;
	}

	public void setRoles(Set<Role> roles) {
		this.roles = roles;
	}

	
    
    
}
