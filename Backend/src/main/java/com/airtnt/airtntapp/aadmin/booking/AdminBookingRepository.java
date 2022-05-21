package com.airtnt.airtntapp.aadmin.booking;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.airtnt.entity.Booking;

@Repository
public interface AdminBookingRepository extends JpaRepository<Booking, Integer>{
	
}
