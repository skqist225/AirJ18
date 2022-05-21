package com.airtnt.airtntapp.aadmin.city;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.airtnt.entity.City;

@Repository
public interface AdminCityRepository extends JpaRepository<City, Integer> {
	@Query(value="select new com.airtnt.airtntapp.aadmin.city.AdminCityDTO(c.id, c.name) from City as c")
	List<AdminCityDTO> getAllCityWithIdAndName();
	
	@Query(value="select new com.airtnt.airtntapp.aadmin.city.AdminCityDTO(c.id, c.name) from City as c where c.state.id=?1")
	List<AdminCityDTO> getCityByState(Integer id);
}
