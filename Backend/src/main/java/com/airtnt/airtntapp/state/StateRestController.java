package com.airtnt.airtntapp.state;

import java.util.List;

import com.airtnt.entity.State;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class StateRestController {

    @Autowired
    private StateService stateService;

    @GetMapping("/states/country/{countryId}")
    public List<State> fetchStatesByCountry(@PathVariable("countryId") Integer countryId) {
        return stateService.fetchStatesByCountry(countryId);
    }
}
