package com.airtnt.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "states")
public class State {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	@Column(nullable = false, unique = true)
	private String name;

	@Column(columnDefinition = "VARCHAR(10)")
	private String code;

	@JsonBackReference
	@ManyToOne
	@JoinColumn(name = "country_id")
	private Country country;

	@JsonIgnore
	@Builder.Default
	@OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.REMOVE, mappedBy = "state")
	private Set<City> cities = new HashSet<>();

	public State(int id) {
		this.id = id;
	}

	public State(String name, String code, Country country) {
		this.name = name;
		this.code = code;
		this.country = country;
	}

	public State(String name, Country country) {
		this.name = name;
		this.country = country;
	}

	public State(String name) {
		this.name = name;
	}
}
