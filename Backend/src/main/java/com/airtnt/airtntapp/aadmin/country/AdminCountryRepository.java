package com.airtnt.airtntapp.aadmin.country;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.airtnt.entity.Country;

@Repository
public interface AdminCountryRepository extends JpaRepository<Country, Integer>{
	@Query(value="select new com.airtnt.airtntapp.aadmin.country.AdminCountryDTO(c.id, c.name) from Country as c")
	public List<AdminCountryDTO> getAllCountryWithIdAndName();
}
