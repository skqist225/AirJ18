package com.airtnt.airtntapp.aadmin.stats;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import javax.persistence.Tuple;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.airtnt.airtntapp.aadmin.booking.AdminBookingRepository;
import com.airtnt.airtntapp.aadmin.room.AdminRoomRepository;
import com.airtnt.airtntapp.aadmin.user.AdminUserRepository;

@Service
public class AdminStatsService {
	
	@Autowired
	AdminBookingRepository adminBookingRepository;
	
	@Autowired
	AdminUserRepository adminUserRepository;
	
	@Autowired
	AdminRoomRepository adminRoomRepository;
	
	public List<AdminStatsIncomeDTO> getIncomeStats () {
		List<Tuple> incomeStatsTuples = adminBookingRepository.getIncomeStats();
	    
	    List<AdminStatsIncomeDTO> incomeStatsDTO = incomeStatsTuples.stream()
	            .map(t -> new AdminStatsIncomeDTO(
	                    t.get(0, Integer.class), 
	                    t.get(1, Integer.class), 
	                    t.get(2, BigDecimal.class),
	                    t.get(3, BigInteger.class)
	                    ))
	            .collect(Collectors.toList());
		return incomeStatsDTO;
	}
	
	
	public List<AdminStatsRegisterDTO> getRegisterStats () {
		List<Tuple> registerStatsTuples = adminUserRepository.getRegisterStats();
	    
	    List<AdminStatsRegisterDTO> registerStatsDTO = registerStatsTuples.stream()
	            .map(t -> new AdminStatsRegisterDTO(
	                    t.get(0, Integer.class), 
	                    t.get(1, Integer.class), 
	                    t.get(2, BigInteger.class)
	                    ))
	            .collect(Collectors.toList());
		return registerStatsDTO;
	}
	
	public List<AdminStatsRoomRegisterDTO> getRoomRegisterStats () {
		List<Tuple> roomRegisterStatsTuples = adminRoomRepository.getRoomRegisterStats();
	    
	    List<AdminStatsRoomRegisterDTO> roomRegisterStatsDTO = roomRegisterStatsTuples.stream()
	            .map(t -> new AdminStatsRoomRegisterDTO(
	                    t.get(0, Integer.class), 
	                    t.get(1, Integer.class), 
	                    t.get(2, BigInteger.class)
	                    ))
	            .collect(Collectors.toList());
		return roomRegisterStatsDTO;
	}
}
