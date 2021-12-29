package com.airtnt.entity;

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
		return "/room_images/" + userName + "/" + roomId + "/" + this.image;
	}
}
