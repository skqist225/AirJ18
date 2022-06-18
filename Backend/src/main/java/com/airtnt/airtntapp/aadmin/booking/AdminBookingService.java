package com.airtnt.airtntapp.aadmin.booking;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.airtnt.airtntapp.aadmin.exception.ForeignKeyConstraintException;
import com.airtnt.airtntapp.aadmin.exception.UserNotFoundException;
import com.airtnt.entity.Booking;
import com.airtnt.entity.Room;
import com.airtnt.entity.User;

@Service
public class AdminBookingService {
	@Autowired
	AdminBookingRepository adminBookingRepository;
	
	public Page<Booking> getAll(String searchText, Pageable pageable) {
		return (Page<Booking>) adminBookingRepository.findAll(searchText, pageable);
	}
	
	public void changeStatus(Integer id) {
    	Booking booking = adminBookingRepository.findById(id).get();
    	booking.setStatus(!booking.isStatus());
    	adminBookingRepository.save(booking);
    }
	
	public Boolean deleteRoomById(Integer id) {
    	
    	Optional<Booking> bookingById = adminBookingRepository.findById(id);
    	if(bookingById.isEmpty())
    		throw new UserNotFoundException("Khong tim thay booking de xoa!");
    	
    	if(bookingById.get().getReview() != null)
    		throw new ForeignKeyConstraintException("Booking da co review. Khong the xoa!");
    	
    	adminBookingRepository.deleteById(id);
    	return true;
    }
}
