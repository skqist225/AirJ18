package com.airtnt.airtntapp.aadmin.stats;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/admin/api/stats/")
public class AdminStatsController {
	@Autowired
	AdminStatsService adminStatsService;
	
	@GetMapping(value = "income-stats")
	public ResponseEntity<Object> getIncomeStats(){
		List<AdminStatsIncomeDTO> adminStatsIncomeDTO = adminStatsService.getIncomeStats();
		
		return ResponseEntity.ok().body(adminStatsIncomeDTO);
	}
	
	@GetMapping(value = "register-stats")
	public ResponseEntity<Object> getRegisterStats(){
		List<AdminStatsRegisterDTO> adminStatsRegisterDTO = adminStatsService.getRegisterStats();
		
		return ResponseEntity.ok().body(adminStatsRegisterDTO);
	}
	
	@GetMapping(value = "room-register-stats")
	public ResponseEntity<Object> getRoomRegisterStats(){
		List<AdminStatsRoomRegisterDTO> adminStatsRoomRegisterDTO = adminStatsService.getRoomRegisterStats();
		
		return ResponseEntity.ok().body(adminStatsRoomRegisterDTO);
	}
}
