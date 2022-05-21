package com.airtnt.airtntapp.aadmin.room;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.airtnt.entity.Room;

@Service
public class AdminRoomService {
	@Autowired
	AdminRoomRepository adminRoomRepository;
	
	public Page<Room> getAll(Pageable pageable) {
		return (Page<Room>)adminRoomRepository.findAll(pageable);
	}
}
