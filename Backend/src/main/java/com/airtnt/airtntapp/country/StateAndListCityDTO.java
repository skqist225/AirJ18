package com.airtnt.airtntapp.country;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StateAndListCityDTO {
    private String name;
    private List<CityDTO> districts;
}
