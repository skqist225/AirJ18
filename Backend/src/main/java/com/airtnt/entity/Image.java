package com.airtnt.entity;

import java.util.Objects;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "images")
public class Image {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	private String image;

	public Image(int id) {
		this.id = id;
	}

	public Image(String imgString) {
		this.image = imgString;
	}

	@Transient
	public String imageName() {
		return this.image;
	}

	@Transient
	public String getImagePath(String userName, Integer roomId) {
		if(userName.equals("test@gmail.com")) {
			return "/room_images/" + userName + "/" + this.image;
		}

		return "/room_images/" + userName + "/" + roomId + "/" + this.image;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Image other = (Image) obj;
		return id == other.id && Objects.equals(image, other.image);
	}

	@Override
	public int hashCode() {
		return Objects.hash(id, image);
	}
}
