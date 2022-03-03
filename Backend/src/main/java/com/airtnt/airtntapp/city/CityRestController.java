package com.airtnt.airtntapp.city;

import java.util.List;

import com.airtnt.entity.City;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class CityRestController {
    @Autowired
    private CityService cityService;

    @GetMapping("/cities/state/{stateId}")
    public List<City> fetchCitiesByState(@PathVariable Integer stateId) {
        return cityService.fetchCitiesByState(stateId);
    }
}
