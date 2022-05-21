package com.airtnt.airtntapp.aadmin.user;

import java.time.LocalDate;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.format.annotation.DateTimeFormat;

import com.airtnt.entity.Address;
import com.airtnt.entity.City;
import com.airtnt.entity.Country;
import com.airtnt.entity.Role;
import com.airtnt.entity.Room;
import com.airtnt.entity.Sex;
import com.airtnt.entity.State;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateDeserializer;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AdminUserDTO {
	private String avatar;
	private String firstName;
	private String lastName;
	private Sex sex;
	
	@JsonDeserialize(using = LocalDateDeserializer.class)
	@JsonFormat(shape=JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private LocalDate birthDay;
	
	private String email;
	private String password;
	
	@JsonProperty
	private Role role;
	
	private String phoneNumber;
	private List<Room> ownedRooms;
	
	@JsonProperty("address")
	private AddressDTO address;
	
	private Boolean supremeHost = false;
	private boolean phoneVerified = false;
	private String about;
	private Set<Room> favRooms = new HashSet<>();
	private String cookie;
	public AdminUserDTO(String avatar, String firstName, String lastName, Sex sex, LocalDate birthDay, String email,
			String password, Role role, String phoneNumber, String about) {
		super();
		this.avatar = avatar;
		this.firstName = firstName;
		this.lastName = lastName;
		this.sex = sex;
		this.birthDay = birthDay;
		this.email = email;
		this.password = password;
		this.role = role;
		this.phoneNumber = phoneNumber;
		this.about = about;
	}
}
