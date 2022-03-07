package com.airtnt.entity;

import lombok.*;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = { "room" })
@Builder
@Entity
@Table(name = "categories")
public class Category extends BaseEntity {
	@Column(nullable = false)
	private String name;

	@JsonIgnore
	@Column(columnDefinition = "TEXT NOT NULL")
	private String icon;

	@Builder.Default
	@OneToMany(mappedBy = "category")
	@JsonIgnore
	private Set<Room> room = new HashSet<>();

	public Category(int id) {
		super(id);
	}

	@Transient
	public String getIconPath() {
		return "/category_images/" + this.icon;
	}

	public Category(String name) {
		this.name = name;
	}

	public Category(int id, String name, String icon) {
		super(id);
		this.name = name;
		this.icon = icon;
	}

	public Category(int id, String name) {
		super(id);
		this.name = name;
	}
}
