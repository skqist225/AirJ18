package com.airtnt.entity;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.HashSet;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Past;
import javax.validation.constraints.Size;

import org.springframework.format.annotation.DateTimeFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "users")
public class User extends BaseEntity {

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

	@Past(message = "Không chọn ngày lớn hơn hiện tại")
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private LocalDate birthday;

	@NotEmpty(message = "Email không được để trống.")
	@Column(nullable = false, unique = true)
	private String email;

	@NotEmpty(message = "Mật khẩu không được để trống.")
	@Size(min = 8, max = 512, message = "Mật khẩu phải ít nhất 8 kí tự.")
	@Column(nullable = false, length = 255)
	private String password;

	@ManyToOne
	@OneToOne
	@JoinColumn(name = "role_id")
	private Role role;

	@NotEmpty(message = "Số điện thoại không được để trống.")
	@Size(min = 10, max = 11, message = "SDT phải ít nhất 10 chữ số và lớn nhất 11 chữ số.")
	@Column(length = 10, nullable = false)
	private String phoneNumber;

	@Builder.Default
	@OneToMany(mappedBy = "host")
	private List<Room> room = new ArrayList<>();

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
	@ManyToMany
	@JoinTable(name = "users_favorite_rooms", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "room_id"))
	private Set<Room> rooms = new HashSet<>();

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
	public void addToWishLists(Room room) {
		this.rooms.add(room);
	}

	@Transient
	public void removeFromWishLists(Room room) {
		this.rooms.remove(room);
	}

	public boolean hasRole(String role) {
		if (role.equals(this.getRole().getName())) {
			return true;
		}

		return false;
	}

}
