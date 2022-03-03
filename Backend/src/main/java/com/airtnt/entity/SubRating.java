package com.airtnt.entity;

import javax.persistence.Column;
import javax.persistence.Embeddable;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Embeddable
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SubRating {

	@Column(name = "cleanliness_rating", columnDefinition = "TINYINT default 0, check(cleanliness_rating >= 0 and cleanliness_rating <= 5)")
	private int cleanliness;

	@Column(name = "contact_rating", columnDefinition = "TINYINT default 0, check(contact_rating >= 0 and contact_rating <= 5)")
	private int contact;

	@Column(name = "checkin_rating", columnDefinition = "TINYINT default 0, check(checkin_rating >= 0 and checkin_rating <= 5)")
	private int checkin;

	@Column(name = "accuracy_rating", columnDefinition = "TINYINT default 0, check(accuracy_rating >= 0 and accuracy_rating <= 5)")
	private int accuracy;

	@Column(name = "location_rating", columnDefinition = "TINYINT default 0, check(location_rating >= 0 and location_rating <= 5)")
	private int location;

	@Column(name = "value_rating", columnDefinition = "TINYINT default 0, check(value_rating >= 0 and value_rating <= 5)")
	private int value;

}
