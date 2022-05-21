package com.airtnt.airtntapp.aadmin.state;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminStateService {
	@Autowired
	AdminStateRepository adminStateRepository;
	
	public List<AdminStateDTO> getAllStateWithIdAndName() {
		return adminStateRepository.getAllStateWithIdAndName();
	}
	
	public List<AdminStateDTO> getStateByCountry(Integer countryId){
		return adminStateRepository.getStateByCountry(countryId);
	}
}
