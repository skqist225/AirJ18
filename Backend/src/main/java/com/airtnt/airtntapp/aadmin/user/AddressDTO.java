package com.airtnt.airtntapp.aadmin.user;

import com.airtnt.entity.City;
import com.airtnt.entity.Country;
import com.airtnt.entity.State;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AddressDTO{
	@JsonProperty("country")
	private Country country;
	@JsonProperty("state")
	private State state;
	@JsonProperty("city")
	private City city;
	private String aprtNoAndStreet;
}