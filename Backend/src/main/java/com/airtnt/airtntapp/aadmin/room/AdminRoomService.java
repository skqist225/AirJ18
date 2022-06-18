package com.airtnt.airtntapp.aadmin.room;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.airtnt.airtntapp.aadmin.exception.ForeignKeyConstraintException;
import com.airtnt.airtntapp.aadmin.exception.UserNotFoundException;
import com.airtnt.entity.Room;
import com.airtnt.entity.User;

@Service
public class AdminRoomService {
	@Autowired
	AdminRoomRepository adminRoomRepository;
	
	public Page<Room> getAll(String textSearch, Pageable pageable) {
		return (Page<Room>)adminRoomRepository.findAll(textSearch, pageable);
	}
	
	public void changeStatus(Integer id) {
    	Room room = adminRoomRepository.findById(id).get();
    	room.setStatus(!room.isStatus());
    	adminRoomRepository.save(room);
    }
	
	public Boolean deleteRoomById(Integer id) {
    	
    	Optional<Room> roomById = adminRoomRepository.findById(id);
    	if(roomById.isEmpty())
    		throw new UserNotFoundException("Khong tim thay room de xoa!");
    	
    	if(!roomById.get().getBookings().isEmpty())
    		throw new ForeignKeyConstraintException("Room da co booking. Khong the xoa!");
    	
    	adminRoomRepository.deleteById(id);
    	return true;
    }
}
