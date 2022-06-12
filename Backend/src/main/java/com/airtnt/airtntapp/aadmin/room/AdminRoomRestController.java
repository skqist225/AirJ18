package com.airtnt.airtntapp.aadmin.room;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.airtnt.entity.Room;

@RestController
@RequestMapping(value = "/admin/api")
public class AdminRoomRestController {
	public static final Integer ROOM_PER_PAGE = 10;
	
	@Autowired
	AdminRoomService adminRoomService;
	
	@GetMapping(value="/room")
	public ResponseEntity<Object> getAll(@RequestParam("page") Integer page, 
			@RequestParam("sortField") String sortField, 
			@RequestParam("sortDir") String sortDir,
			@RequestParam("searchText") String textSearch){
		Pageable pageable = PageRequest.of(page-1, ROOM_PER_PAGE, Sort.by(sortField).ascending());
		Page<Room> roomList = adminRoomService.getAll(textSearch, pageable);
		return ResponseEntity.ok().body(roomList);
	}
}
