package com.airtnt.airtntapp.state;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import com.airtnt.entity.Country;
import com.airtnt.entity.State;

@Service
public class StateService {
    @Autowired
    StateRepository stateRepository;

    public State getStateByName(String stateName) {
        return stateRepository.findByName(stateName);
    }

    public State addState(String stateName, String stateCode, Country country) {
        State s = new State(stateName, stateCode, country);
        return stateRepository.save(s);
    }

    public List<State> listAll() {
        return (List<State>) stateRepository.findAll();
    }

    public State getStateById(Integer stateId) {
        return stateRepository.findById(stateId).get();
    }

    public List<State> fetchStatesByCountry(Integer countryId) {
        Country country = new Country(countryId);

        return stateRepository.findByCountryOrderByNameAsc(country);
    }
}
