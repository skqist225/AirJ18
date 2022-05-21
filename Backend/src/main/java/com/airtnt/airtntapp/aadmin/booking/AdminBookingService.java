package com.airtnt.airtntapp.aadmin.booking;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.airtnt.entity.Booking;

@Service
public class AdminBookingService {
	@Autowired
	AdminBookingRepository adminBookingRepository;
	
	public Page<Booking> getAll(Pageable pageable) {
		return (Page<Booking>) adminBookingRepository.findAll(pageable);
	}
}
