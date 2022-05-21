package com.airtnt.airtntapp.aadmin.room;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.airtnt.entity.Room;

@Repository
public interface AdminRoomRepository extends JpaRepository<Room, Integer>{
	
}
