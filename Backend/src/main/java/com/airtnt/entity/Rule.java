package com.airtnt.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "rules")
public class Rule extends BaseEntity {

	@Column(nullable = false, unique = true)
	private String title;

	@Column(columnDefinition = "TEXT NOT NULL")
	private String icon;

	public Rule(String title) {
		this.title = title;
	}

	public Rule(int id, String title) {
		super(id);
		this.title = title;
	}

	@Transient
	public String getIconPath() {
		return "/rule_images/" + this.icon;
	}
}
