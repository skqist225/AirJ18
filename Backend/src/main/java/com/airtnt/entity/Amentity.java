package com.airtnt.entity;

import javax.persistence.*;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "amentities")
public class Amentity extends BaseEntity {

	@Column(nullable = false, unique = true)
	private String name;

	@Column(name = "icon_image", columnDefinition = "TEXT NOT NULL")
	private String iconImage;

	private String description;

	private boolean prominent;
	private boolean favorite;
	private boolean safe;

	@ManyToOne
	@JoinColumn(name = "amtcategory_id")
	private AmentityCategory amentityCategory;

	public Amentity(int id) {
		super(id);
	}

	public Amentity(int id, String name, String description, AmentityCategory amentityCategory) {
		super(id);
		this.name = name; 
		this.description = description;
		this.amentityCategory = amentityCategory;
	}

	public Amentity(String name, String description, AmentityCategory amentityCategory) {
		this.name = name;
		this.description = description;
		this.amentityCategory = amentityCategory;
	}

	@Transient
	public String getIconImagePath() {
		return "/amentity_images/" + this.iconImage;
	}

	@Transient
	public String getIconImagePath1() {
		return "/amentity_images/" + this.iconImage; 
	}
}
