package com.airtnt.airtntapp.aadmin.country;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminCountryService {
	@Autowired
	AdminCountryRepository adminCountryRepository;
	
	public List<AdminCountryDTO> getAllCountryWithIdAndName() {
		return adminCountryRepository.getAllCountryWithIdAndName();
	}
}
