package com.airtnt.airtntapp.aadmin.city;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value="/admin/api/city")
public class AdminCityRestController {
	@Autowired
	AdminCityService adminCityService;
	
	@GetMapping(value="/select_data")
	public ResponseEntity<Object> getCityForSelectTag(){
		return ResponseEntity.ok().body(adminCityService.getAllCityWithIdAndName());
	}
	
	@GetMapping(value="/select_data_by_state/{id}")
	public ResponseEntity<Object> getCityByState(@PathVariable Integer id){
		return ResponseEntity.ok().body(adminCityService.getCityByState(id));
	}
}
