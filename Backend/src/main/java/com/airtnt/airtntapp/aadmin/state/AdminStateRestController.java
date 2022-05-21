package com.airtnt.airtntapp.aadmin.state;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value="/admin/api/state")
public class AdminStateRestController {
	@Autowired
	AdminStateService adminStateService;
	
	@GetMapping(value="/select_data")
	public ResponseEntity<Object> getStateForSelectTag(){
		return ResponseEntity.ok().body(adminStateService.getAllStateWithIdAndName());
	}
	
	@GetMapping(value="/select_data_by_country/{id}")
	public ResponseEntity<Object> getStateByCountry(@PathVariable Integer id){
		return ResponseEntity.ok().body(adminStateService.getStateByCountry(id));
	}
}
