package com.airtnt.airtntapp.aadmin.booking;

import java.util.List;

import javax.persistence.Tuple;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.airtnt.airtntapp.aadmin.stats.AdminStatsIncomeDTO;
import com.airtnt.entity.Booking;
import com.airtnt.entity.Room;
import com.airtnt.entity.User;

@Repository
public interface AdminBookingRepository extends JpaRepository<Booking, Integer>{
	
	@Query(value = "select MONTH(b.booking_date) as month, YEAR(b.booking_date) as year, sum(b.price_per_day * b.number_of_days) as income, count(*) as bookingCount from bookings as b\r\n"
			+ "where YEAR(b.booking_date) >= 2021\r\n"
			+ "GROUP BY YEAR(b.booking_date), MONTH(b.booking_date)\r\n"
			+ "ORDER BY b.booking_date asc", nativeQuery = true)
	List<Tuple> getIncomeStats ();
	
	@Query(value = "select b from Booking as b "
    		+ "where b.room.name like %?1% "
    		+ "or concat(b.customer.firstName, ' ', b.customer.lastName) like %?1% ")
    public Page<Booking> findAll(String searchText, Pageable pageable);
	
	public List<Booking> findByCustomer(User user);
}
