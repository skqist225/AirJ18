package com.airtnt.airtntapp.state;

import java.util.List;

import com.airtnt.airtntapp.response.StandardJSONResponse;
import com.airtnt.airtntapp.response.success.OkResponse;
import com.airtnt.entity.State;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/")
public class StateRestController {

    @Autowired
    private StateService stateService;

    @GetMapping("states/country/{countryId}")
    public ResponseEntity<StandardJSONResponse<List<State>>> fetchStatesByCountry(
            @PathVariable("countryId") Integer countryId) {
        return new OkResponse<List<State>>(stateService.fetchStatesByCountry(countryId)).response();
    }
}
