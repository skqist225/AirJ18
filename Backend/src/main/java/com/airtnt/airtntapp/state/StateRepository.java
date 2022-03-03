package com.airtnt.airtntapp.state;

import java.util.List;

import com.airtnt.entity.Country;
import com.airtnt.entity.State;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StateRepository extends CrudRepository<State, Integer> {
    public List<State> findAllByOrderByNameAsc();

    public List<State> findByCountryOrderByNameAsc(Country country);

    public State findByName(String stateName);

}
