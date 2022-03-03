package com.airtnt.airtntapp.city.admin;

import java.util.List;

import com.airtnt.airtntapp.city.CityRepository;
import com.airtnt.entity.City;
import com.airtnt.entity.State;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
public class CityAdminRestController {

    @Autowired
    CityRepository repo;

    @GetMapping("/cities/list_by_state/{stateId}")
    public List<City> listAll(@PathVariable("stateId") Integer stateId) {
        State state = new State(stateId);
        return repo.findByStateOrderByNameAsc(state);
    };

    @PostMapping("/cities/save")
    public String save(@RequestBody City city) {
        City savedCity = repo.save(city);
        return String.valueOf(savedCity.getId());
    }

    @DeleteMapping("/cities/delete/{id}")
    public void delete(@PathVariable Integer id) {
        repo.deleteById(id);
    }

    @PostMapping("/cities/check_name")
    public String checkName(@Param("id") Integer id,
            @Param("name") String name) {
        City city = repo.findByName(name);

        if (city == null)
            return "OK";

        if (id != null && city.getId() == id)
            return "OK";

        return "Duplicated";
    }
}
