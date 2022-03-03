package com.airtnt.airtntapp.country;

import java.util.ArrayList;
import java.util.List;

import com.airtnt.entity.Country;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CountryService {
    @Autowired
    CountryRepository countryRepository;

    public List<Country> getCountries() {
        List<Country> countries = new ArrayList<>();
        Iterable<Country> itr = countryRepository.findAll();
        itr.forEach(countries::add);
        return countries;
    }

    public List<Country> getCountriesWithoutStates() {
        return countryRepository.getCountriesWithoutStates();
    }

    public Country getCountryById(Integer id) {
        return countryRepository.findById(id).get();
    }

    public List<Country> listAll() {
        return countryRepository.findALLByOrderByNameAsc();
    }

    public Country getById(Integer id) {
        return countryRepository.findById(id).get();
    }

    public Country save(Country country) {
        return countryRepository.save(country);
    }

    public void delete(Integer id) {
        countryRepository.deleteById(id);
    }

    public String checkName(Integer id, String name) {
        Country country = countryRepository.findByName(name);

        if (country == null)
            return "OK";

        if (id != null && country.getId() == id)
            return "OK";

        return "Duplicated";
    }
}
