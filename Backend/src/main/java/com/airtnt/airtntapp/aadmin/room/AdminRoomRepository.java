package com.airtnt.airtntapp.aadmin.room;

import java.util.List;

import javax.persistence.Tuple;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.airtnt.entity.Room;
import com.airtnt.entity.User;

@Repository
public interface AdminRoomRepository extends JpaRepository<Room, Integer>{
	
	@Query(value = "select MONTH(r.created_at) as month, YEAR(r.created_at) as year, count(*) as registerCount from rooms as r\r\n"
			+ "where YEAR(r.created_at) >= 2021\r\n"
			+ "GROUP BY YEAR(r.created_at), MONTH(r.created_at)\r\n"
			+ "ORDER BY r.created_at asc", nativeQuery = true)
	public List<Tuple> getRoomRegisterStats();
	
	@Query(value = "select r from Room as r "
    		+ "where r.name like %?1% "
    		+ "or r.description like %?1% ")
    public Page<Room> findAll(String searchText, Pageable pageable);
}
