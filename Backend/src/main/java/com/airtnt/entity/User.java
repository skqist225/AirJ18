package com.airtnt.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.HashSet;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Past;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import com.airtnt.airtntapp.aadmin.stats.AdminStatsIncomeDTO;
import com.airtnt.airtntapp.user.dto.PostRegisterUserDTO;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import org.springframework.format.annotation.DateTimeFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Builder
@Entity
@Table(name = "users")
public class User extends BaseEntity {

	@JsonIgnore
	private String avatar;

	@NotEmpty(message = "Tên không được để trống.")
	@Column(nullable = false, length = 48)
	private String firstName;

	@NotEmpty(message = "Họ không được để trống.")
	@Column(nullable = false, length = 48)
	private String lastName;

	@Enumerated(EnumType.STRING)
	@Column(length = 10, nullable = false)
	private Sex sex;

	@Past(message = "Không chọn ngày lớn hơn hiện tại.")
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	@JsonFormat(pattern = "yyyy-MM-dd")
	private LocalDate birthday;

	@Email(message = "Không đúng định dạng email.")
	@NotEmpty(message = "Email không được để trống.")
	@Column(nullable = false, unique = true)
	private String email;

	@JsonIgnore
	@NotEmpty(message = "Mật khẩu không được để trống.")
	@Size(min = 8, max = 512, message = "Mật khẩu phải ít nhất 8 kí tự.")
	@Column(nullable = false, length = 255)
	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	private String password;

	@ManyToOne
	@OneToOne
	@JoinColumn(name = "role_id")
	private Role role;

	@Pattern(regexp = "^[0-9]{10}$", message = "Số điện thoại phải là 10 chữ số")
	@Column(length = 10, nullable = false, unique = true)
	private String phoneNumber;

	@Builder.Default
	@JsonIgnore
	@OneToMany(mappedBy = "host", fetch = FetchType.LAZY, cascade = CascadeType.MERGE)
	private List<Room> ownedRooms = new ArrayList<>();

	@JsonIgnore
	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "address_id")
	private Address address;

	@Builder.Default
	@Column(columnDefinition = "boolean default false")
	private boolean SupremeHost = false;

	@Builder.Default
	@Column(name = "phone_verified", columnDefinition = "boolean default false")
	private boolean phoneVerified = false;

	@Column(length = 1024)
	private String about;

	@Builder.Default
	@JsonIgnore
	@ManyToMany
	@JoinTable(name = "users_favorite_rooms", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "room_id"))
	private Set<Room> favRooms = new HashSet<>();

	@JsonIgnore
	private Integer resetPasswordCode;

	@JsonIgnore
	private LocalDateTime resetPasswordExpirationTime;
	
	@Transient
	private String cookie;

	public User(int id) {
		super(id);
	}

	@Override
	public String toString() {
		return "User [firstName=" + firstName + ", lastName=" + lastName + "]";
	}

	@Transient
	public String getAvatarPath() {
		if (this.getId() == null || this.avatar == null)
			return "/images/default_user_avatar.png";
		return "/user_images/" + this.getId() + "/" + this.avatar;
	}

	@Transient
	public String getFullName() {
		return this.firstName + " " + this.lastName;
	}

	@Transient
	public String token;

	@Transient
	public String getFullPathAddress() {
		return this.address != null
				? this.address.getAprtNoAndStreet() + ", " + this.address.getCity().getName() + ", "
						+ this.address.getState().getName() + ", " + this.address.getCountry().getName()
				: "";
	}

	@Transient
	public ObjectNode getAddressDetails() throws JsonProcessingException {
		ObjectMapper mapper = new ObjectMapper();
		ObjectNode objectNode = mapper.createObjectNode();
		ObjectNode countryNode = mapper.createObjectNode();
		ObjectNode stateNode = mapper.createObjectNode();
		ObjectNode cityNode = mapper.createObjectNode();

		if (this.address != null) {
			Country c = this.address.getCountry();
			State s = this.address.getState();
			City city = this.address.getCity();

			objectNode.set("country", countryNode.put("id", c.getId()).put("name", c.getName()));
			objectNode.set("state", stateNode.put("id", s.getId()).put("name", s.getName()));
			objectNode.set("city", cityNode.put("id", city.getId()).put("name", city.getName()));
			objectNode.put("aprtNoAndStreet", this.address.getAprtNoAndStreet());
		}

		return objectNode;
	}

	@Transient
	@JsonIgnore
	public static User buildUser(PostRegisterUserDTO postUser) {
		return User.builder().firstName(postUser.getFirstName()).lastName(postUser.getLastName())
				.email(postUser.getEmail()).password(postUser.getPassword())
				.sex(postUser.getSex().equals("MALE") ? Sex.MALE
						: (postUser.getSex().equals("FEMALE") ? Sex.FEMALE : Sex.OTHER))
				.birthday(postUser.getBirthday()).phoneNumber(postUser.getPhoneNumber()).build();
	}

	@Transient
	public void addToWishLists(Room room) {
		this.favRooms.add(room);
	}

	@Transient
	public void removeFromWishLists(Room room) {
		this.favRooms.remove(room);
	}

	public boolean hasRole(String role) {
		if (role.equals(this.getRole().getName())) {
			return true;
		}

		return false;
	}
}
