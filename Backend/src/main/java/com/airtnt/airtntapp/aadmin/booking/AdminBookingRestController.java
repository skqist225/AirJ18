package com.airtnt.airtntapp.aadmin.booking;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.airtnt.entity.Booking;

@RestController
@RequestMapping(value = "/admin/api")
public class AdminBookingRestController {
	public static final Integer ROOM_PER_PAGE = 10;
	
	@Autowired
	AdminBookingService adminBookingService;
	
	@GetMapping(value="/booking")
	public ResponseEntity<Object> getAll(@RequestParam("page") Integer page, 
			@RequestParam("sortField") String sortField, 
			@RequestParam("sortDir") String sortDir,
			@RequestParam("searchText") String searchText){
		Pageable pageable = PageRequest.of(page-1, ROOM_PER_PAGE, Sort.by(sortField).ascending());
		Page<Booking> bookingList = adminBookingService.getAll(searchText, pageable);
		return ResponseEntity.ok().body(bookingList);
	}
	
	@PostMapping("booking/{id}/change_status")
    public ResponseEntity<Object> changeStatus(@PathVariable Integer id){
		adminBookingService.changeStatus(id);
    	return ResponseEntity.ok().body("Success");
    }
	
	@CrossOrigin(origins="http://localhost:3000")
    @DeleteMapping("/booking/{id}")
    public ResponseEntity<Object> Delete(@PathVariable Integer id){
    	if(id<1)return ResponseEntity.badRequest().body("Id must greater than 0!");
    	
    	if(adminBookingService.deleteRoomById(id))
    		return ResponseEntity.ok().body("Xoa Thanh Cong");
    	return ResponseEntity.badRequest().body("Xoa That Bai");
    }
} 
