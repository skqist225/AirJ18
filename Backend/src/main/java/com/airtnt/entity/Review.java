package com.airtnt.entity;

import javax.persistence.Column;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = { "booking" })
@Entity
@Table(name = "reviews")
public class Review extends BaseEntity {
	@JsonIgnore
	@OneToOne
	@JoinColumn(name = "booking_id", unique = true, referencedColumnName = "id")
	private Booking booking;

	@Column(nullable = false, length = 1024)
	private String comment;

	@Embedded
	private SubRating subRating;

	@Column(columnDefinition = "TINYINT default 0, check(final_rating >= 0 and final_rating <= 5)")
	private float finalRating;
}
