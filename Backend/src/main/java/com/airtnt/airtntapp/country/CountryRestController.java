package com.airtnt.airtntapp.country;

import java.util.List;

import com.airtnt.airtntapp.country.dto.CountryDTO;
import com.airtnt.airtntapp.response.StandardJSONResponse;
import com.airtnt.airtntapp.response.success.OkResponse;
import com.airtnt.entity.Country;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/")
public class CountryRestController {

    @Autowired
    CountryRepository countryRepository;

    @Autowired
    CountryService countryService;

    @GetMapping("/countries")
    public ResponseEntity<StandardJSONResponse<List<Country>>> fetchCategories() {
        return new OkResponse<List<Country>>(countryRepository.getCountriesWithoutStates()).response();
    }

    @PostMapping(value = "/add-dial-code-to-db")
    public String addDialCodeToDB(@RequestBody List<CountryDTO> countries) {
        for (CountryDTO c : countries) {
            Country country = countryRepository.findByName(c.getName());
            if (country != null) {
                country.setDialCode(c.getDial_code());
                countryRepository.save(country);
            }
        }
        return "OK";
    }
}
