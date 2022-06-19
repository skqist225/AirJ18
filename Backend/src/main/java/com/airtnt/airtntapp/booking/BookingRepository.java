package com.airtnt.airtntapp.booking;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

import com.airtnt.entity.Booking;
import com.airtnt.entity.Room;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer>, JpaSpecificationExecutor<Booking> {

        @Query("SELECT b FROM Booking b WHERE b.room.id = :roomId AND b.isComplete = true")
        public List<Booking> getBookedDates(Integer roomId);

        @Query("SELECT b FROM Booking b WHERE b.checkinDate = :checkinDate AND b.checkoutDate = :checkoutDate" +
                        " AND b.room.id = :roomId AND b.customer.id = :customerId")
        public List<Booking> isBookedByUser(Date checkinDate, Date checkoutDate, Integer roomId, Integer customerId);

        public List<Booking> findByRoom(Room room);

        @Query("SELECT b FROM Booking b WHERE b.customer.id = :customerId AND CONCAT(b.room.name, ' ', b.customer.firstName, ' ', b.customer.lastName) LIKE %:query% ORDER BY b.bookingDate DESC")
        public List<Booking> getByCustomer(Integer customerId, String query);

        @Query("SELECT b FROM Booking b WHERE b.customer.id = :customerId"
                        + " AND CONCAT(b.id, ' ', b.room.name, ' ', b.customer.firstName, ' ', b.customer.lastName) LIKE %:query% ORDER BY b.bookingDate DESC")
        public List<Booking> getBookedRoomsByUser(Integer customerId, String query);

        @Query("SELECT b FROM Booking b WHERE b.room.id IN (:roomIds) AND b.bookingDate >= :startDate AND b.bookingDate <= :endDate")
        public List<Booking> getBookingsByRooms(Integer[] roomIds, LocalDateTime startDate, LocalDateTime endDate);

        @Query("SELECT b FROM Booking b WHERE b.room.id IN (:roomIds)")
        public List<Booking> getBookingsByRooms(Integer[] roomIds);

        @Query("SELECT b FROM Booking b WHERE b.room.id IN (:roomIds) AND b.room.name LIKE %:query% AND b.bookingDate <= :bookingDate AND b.bookingDate >= :bookingDate2 AND b.totalFee >= :totalFee AND b.isComplete IN (:isCompleteLst) AND b.isRefund IN (:isCancelledLst)")
        public Page<Booking> getBookingsByRooms(Integer[] roomIds, String query, List<Boolean> isCompleteLst,
                        List<Boolean> isCancelledLst, LocalDateTime bookingDate, LocalDateTime bookingDate2,
                        Float totalFee,
                        Pageable pageable);

        @Query("SELECT b FROM Booking b"
                        + " WHERE b.room.id IN (:roomIds) AND b.room.name LIKE %:query% AND b.bookingDate <= :bookingDate"
                        + " AND b.bookingDate >= :bookingDate2 AND b.totalFee >= :totalFee"
                        + " AND b.isRefund = true AND b.isComplete = false OR b.isRefund = false AND b.isComplete = true"
                        + " ORDER BY b.bookingDate DESC")
        public Page<Booking> getBookingListByRooms(List<Integer> roomIds, String query,
                        LocalDateTime bookingDate, LocalDateTime bookingDate2,
                        Float totalFee,
                        Pageable pageable);

        @Query("SELECT b FROM Booking b WHERE b.room.id IN (:roomIds) AND b.room.name LIKE %:query% AND year(b.bookingDate)=:year AND month(b.bookingDate)=:month AND b.isComplete IN (:isCompleteLst) AND b.isRefund IN (:isCancelledLst) ORDER BY b.bookingDate ASC")
        public Page<Booking> getBookingsByRooms(Integer[] roomIds, String query, List<Boolean> isCompleteLst,
                        List<Boolean> isCancelledLst, Integer year, Integer month,
                        Pageable pageable);

        @Query("SELECT b FROM Booking b WHERE b.room.id IN (:roomIds) AND b.room.name LIKE %:query% AND (b.isComplete = :isComplete OR b.isRefund = :isCancelled)")
        public Page<Booking> getBookingsByRooms(Integer[] roomIds, String query, Boolean isComplete,
                        Boolean isCancelled,
                        Pageable pageable);

        @Query("SELECT b"
                        + " FROM Booking b WHERE b.room.id IN (:roomIds) AND b.room.name LIKE %:query% AND (b.isComplete = :isComplete OR b.isRefund = :isCancelled) ORDER BY b.bookingDate DESC")
        public Page<Booking> getBookingListByRooms(List<Integer> roomIds, String query, Boolean isComplete,
                        Boolean isCancelled,
                        Pageable pageable);

        @Query("SELECT b FROM Booking b WHERE b.room.id IN (:roomIds) AND b.id = :bookingId")
        public Page<Booking> getBookingsByRooms(Integer[] roomIds, Integer bookingId, Pageable pageable);

        @Query("SELECT b FROM Booking b WHERE b.room.id IN (:roomIds) AND b.id = :bookingId ORDER BY b.bookingDate DESC")
        public Page<Booking> getBookingListByRooms(List<Integer> roomIds, Integer bookingId, Pageable pageable);

        // admin -----------------------------

        @Query("SELECT b FROM Booking b WHERE CONCAT(b.customer.firstName, '',b.customer.lastName, '' , b.room.name) LIKE %?1%")
        public Page<Booking> findAllAdmin(String keyword, Pageable pageable);

        @Query("SELECT count(*) FROM Booking b")
        public Integer getNumberOfBooking();

        @Query("SELECT count(*) FROM Booking b WHERE b.isComplete=true AND b.isRefund=false")
        public Integer getNumberOfBookingComplete();

        @Query("SELECT count(*) FROM Booking b WHERE b.isComplete=false AND b.isRefund=false")
        public Integer getNumberOfBookingNotComplete();

        @Query("SELECT count(*) FROM Booking b WHERE b.isComplete=false AND b.isRefund=true")
        public Integer getNumberOfBookingRefund();

        @Query("SELECT sum(totalFee) FROM Booking b WHERE b.isComplete=true AND b.isRefund=false")
        public Integer getTotalRevenue();

        @Query(value = "SELECT count(*) FROM bookings b WHERE YEAR(b.booking_date) = YEAR(CURRENT_DATE - INTERVAL 1 MONTH) AND MONTH(b.booking_date) = MONTH(CURRENT_DATE - INTERVAL 1 MONTH)", nativeQuery = true)
        public Integer getNumberOfBookingInLastMonth();

        @Query(value = "SELECT sum(total_fee) FROM bookings b WHERE YEAR(b.booking_date) = YEAR(CURRENT_DATE - INTERVAL 1 MONTH) AND MONTH(b.booking_date) = MONTH(CURRENT_DATE - INTERVAL 1 MONTH) AND b.is_complete=true AND b.is_refund=false", nativeQuery = true)
        public Integer getTotalRevenueOfBookingInLastMonth();

        @Query("SELECT sum(totalFee) FROM Booking b WHERE YEAR(b.bookingDate) = :year and MONTH(b.bookingDate) = :month AND b.isComplete=true AND b.isRefund=false")
        public Integer getRevenueInSpecificMonthYear(Integer month, Integer year);

        @Query("SELECT sum(totalFee) FROM Booking b WHERE YEAR(b.bookingDate) = :year AND b.isComplete=true AND b.isRefund=false")
        public Integer getRevenueInSpecificYear(Integer year);

        @Query(value = "SELECT b.booking_date as date, SUM(b.total_fee) as revenue FROM bookings b WHERE YEAR(b.booking_date) = :year AND MONTH(b.booking_date) = :month AND b.is_complete=true AND b.is_refund=false group by YEAR(b.booking_date), Month(b.booking_date), Day(b.booking_date) order by b.booking_date", nativeQuery = true)
        public List<BookingStatsPerDayDTO> getBookingStatsPerDay(Integer month, Integer year);

        @Query(value = "SELECT b.booking_date as date, SUM(b.total_fee) as revenue FROM bookings b WHERE YEAR(b.booking_date) = :year AND b.is_complete=true AND b.is_refund=false group by YEAR(b.booking_date), Month(b.booking_date) order by b.booking_date", nativeQuery = true)
        public List<BookingStatsPerDayDTO> getBookingStatsPerMonth(Integer year);
}
