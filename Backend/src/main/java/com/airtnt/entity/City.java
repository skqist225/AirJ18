package com.airtnt.entity;

import lombok.*;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "cities")
public class City {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	@Column(nullable = false)
	private String name;

	@JsonBackReference
	@ManyToOne
	@JoinColumn(name = "state_id")
	private State state;

	public City(int id) {
		this.id = id;
	}

	public City(String name, State state) {
		this.name = name;
		this.state = state;
	}
}
