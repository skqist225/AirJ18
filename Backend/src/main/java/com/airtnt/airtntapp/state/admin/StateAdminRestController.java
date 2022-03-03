package com.airtnt.airtntapp.state.admin;

import java.util.List;

import com.airtnt.airtntapp.state.StateRepository;
import com.airtnt.entity.Country;
import com.airtnt.entity.State;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
public class StateAdminRestController {

    @Autowired
    StateRepository repo;

    @GetMapping("/states/list_state_by_country/{id}")
    public List<State> listAll(@PathVariable("id") Integer id) {
        Country country = new Country(id);
        return repo.findByCountryOrderByNameAsc(country);
    }

    @GetMapping("/states/{id}")
    public State getById(
            @PathVariable("id") Integer id) {
        return repo.findById(id).get();
    }

    @PostMapping("/states/save")
    public String save(@RequestBody State state) {
        State savedState = repo.save(state);
        return String.valueOf(savedState.getId());
    }

    @DeleteMapping("/states/delete/{id}")
    public void delete(@PathVariable("id") Integer id) {
        repo.deleteById(id);
    }
}
