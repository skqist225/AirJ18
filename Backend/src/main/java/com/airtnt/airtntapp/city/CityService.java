package com.airtnt.airtntapp.city;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import com.airtnt.entity.City;
import com.airtnt.entity.State;

@Service
public class CityService {
    @Autowired
    CityRepository cityRepository;

    public City getCityByName(String cityName) {
        return cityRepository.findByName(cityName);
    }

    public City getCityById(Integer cityId) {
        return cityRepository.findById(cityId).get();
    }

    public City addCity(String cityName, State state) {
        City c = new City();
        c.setName(cityName);
        c.setState(state);
        City savedState = cityRepository.save(c);

        return savedState;
    }

    public List<City> listAll() {
        return (List<City>) cityRepository.findAll();
    }

    public List<City> fetchCitiesByState(Integer stateId) {
        State state = new State(stateId);
        return cityRepository.findByStateOrderByNameAsc(state);
    }
}
