package com.airtnt.airtntapp.country;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.airtnt.airtntapp.city.CityRepository;
import com.airtnt.airtntapp.country.dto.CityDTO;
import com.airtnt.airtntapp.country.dto.CountryDTO;
import com.airtnt.airtntapp.country.dto.StateAndListCityDTO;
import com.airtnt.airtntapp.country.dto.StateDTO;
import com.airtnt.airtntapp.state.StateRepository;
import com.airtnt.entity.City;
import com.airtnt.entity.Country;
import com.airtnt.entity.State;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/admin")
public class CountryAdminRestController {

    @Autowired
    CountryRepository countryRepository;

    @Autowired
    StateRepository stateRepository;

    @Autowired
    CityRepository cityRepository;

    @Autowired
    CountryService service;

    @GetMapping(value = "/countries")
    public String getCountries() {
        String url = "https://countriesnow.space/api/v0.1/countries/iso";
        RestTemplate restTemplate = new RestTemplate();
        String countries = restTemplate.getForObject(url, String.class);

        return countries;
    }

    @PostMapping(value = "/countries")
    public String addCountriesToDB(@RequestBody Map<String, List<CountryDTO>> payload) {
        List<CountryDTO> countries = payload.get("countries");
        List<Country> lst_country = new ArrayList<>();

        for (CountryDTO c : countries) {
            Country country = new Country(c.getName(), c.getCode());
            lst_country.add(country);
        }

        countryRepository.saveAll(lst_country);
        return "OK";
    }

    @PostMapping(value = "/states")
    public String addStatesToDB(@RequestBody List<StateDTO> payload) {
        List<StateDTO> states = payload;
        List<State> lst_state = new ArrayList<>();

        for (StateDTO s : states) {
            State country = new State(s.getName(), s.getCode(), new Country(216));
            lst_state.add(country);
        }

        stateRepository.saveAll(lst_state);
        return "OK";
    }

    @PostMapping(value = "/cities")
    public String addCitiesToDB(@RequestBody List<StateAndListCityDTO> payload) {
        List<StateAndListCityDTO> states = payload;

        List<City> lst_state = new ArrayList<>();

        for (StateAndListCityDTO s : states) {
            for (CityDTO cityDTO : s.getDistricts()) {
                City city = new City(cityDTO.getName(), stateRepository.findByName(s.getName()));
                lst_state.add(city);
            }
        }

        cityRepository.saveAll(lst_state);
        return "OK";
    }

    @GetMapping(value = "/states/{countryName}")
    public String getStatesByCountry(@PathVariable("countryName") String countryName) {
        if (countryName.equals("vietnam")) {
            String url2 = "https://provinces.open-api.vn/api/?depth=2";
            RestTemplate restTemplate2 = new RestTemplate();
            String countries2 = restTemplate2.getForObject(url2, String.class);

            return countries2;
        }

        String url = "https://countriesnow.space/api/v0.1/countries/cities";
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String requestJson = "{\"country\":\"" + countryName + "\"}";
        HttpEntity<String> request = new HttpEntity<>(requestJson, headers);

        String countries = restTemplate.postForObject(url, request, String.class);

        return countries;
    }

    @GetMapping("/countries/list")
    public List<Country> listAll() {
        return service.listAll();
    }

    @GetMapping("/countries/{id}")
    public Country getById(
            @PathVariable("id") Integer id) {
        return service.getById(id);
    }

    @PostMapping("/countries/save")
    public String save(
            @RequestParam(name = "id", required = false) Integer id,
            @RequestParam("name") String name,
            @RequestParam("code") String code) {
        Country country;
        if (id != null)
            country = new Country(id, name, code);
        else
            country = new Country(name, code);
        Country saved = service.save(country);
        return String.valueOf(saved.getId());
    }

    @DeleteMapping("/countries/delete/{id}")
    public void delete(@PathVariable("id") Integer id) {
        service.delete(id);
    }

    @PostMapping("/countries/check_name")
    public String checkName(@Param("id") Integer id,
            @Param("name") String name) {
        return service.checkName(id, name);
    }
}
