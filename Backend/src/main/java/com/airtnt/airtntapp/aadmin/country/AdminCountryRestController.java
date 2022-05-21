package com.airtnt.airtntapp.aadmin.country;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController()
@RequestMapping("admin/api/country")
public class AdminCountryRestController {
	@Autowired
	AdminCountryService adminCountryService;
	
	@GetMapping("/select_data")
	public ResponseEntity<Object> getAllCountryWithIdAndName(){
		return ResponseEntity.ok().body(adminCountryService.getAllCountryWithIdAndName());
	}
}
