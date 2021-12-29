package com.airtnt.airtntapp.country;

import java.util.List;

import com.airtnt.entity.Country;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CountryRepository extends CrudRepository<Country, Integer> {
    public List<Country> findALLByOrderByNameAsc();

    public Country findByName(String name);
}
