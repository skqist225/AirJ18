package com.airtnt.airtntapp.amentity;

import java.util.List;

import com.airtnt.airtntapp.response.StandardJSONResponse;
import com.airtnt.entity.Amentity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class AmentityRestController {

    @Autowired
    private AmentityService amentityService;

    @GetMapping("/amenities")
    public ResponseEntity<StandardJSONResponse<List<Amentity>>> getRoomPrivacies() {
        StandardJSONResponse<List<Amentity>> response = new StandardJSONResponse<>(true,
                amentityService.getAllAmentities(), null);
        return new ResponseEntity<StandardJSONResponse<List<Amentity>>>(response, null, HttpStatus.OK);
    }
}
