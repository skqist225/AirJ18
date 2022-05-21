package com.airtnt.airtntapp.aadmin.state;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.airtnt.entity.State;

@Repository
public interface AdminStateRepository extends JpaRepository<State, Integer> {
	@Query(value="select new com.airtnt.airtntapp.aadmin.state.AdminStateDTO(s.id, s.name) from State as s")
	List<AdminStateDTO> getAllStateWithIdAndName();
	
	@Query(value="select new com.airtnt.airtntapp.aadmin.state.AdminStateDTO(s.id, s.name) from State as s where s.country.id=?1")
	List<AdminStateDTO> getStateByCountry(Integer id);
}
