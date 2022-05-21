package com.airtnt.airtntapp.aadmin.city;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminCityService {
	@Autowired
	AdminCityRepository adminCityRepository;
	
	List<AdminCityDTO> getAllCityWithIdAndName(){
		return adminCityRepository.getAllCityWithIdAndName();
	}
	
	List<AdminCityDTO> getCityByState(Integer id){
		return adminCityRepository.getCityByState(id);
	}
}
