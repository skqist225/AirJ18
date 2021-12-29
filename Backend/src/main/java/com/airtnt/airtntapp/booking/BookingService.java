package com.airtnt.airtntapp.booking;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import javax.transaction.Transactional;

import com.airtnt.entity.Booking;
import com.airtnt.entity.Room;
import com.airtnt.entity.User;
import com.airtnt.entity.Exception.BookingNotFoundException;

import org.apache.commons.lang.math.NumberUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class BookingService {

    public final int MAX_BOOKING_PER_FETCH_BY_HOST = 10;
    public final int BOOKINGS_PER_PAGE = 10;

    @Autowired
    private BookingRepository bookingRepository;

    public Booking findById(Integer bookingId) {
        return bookingRepository.findById(bookingId).get();
    }

    public Booking getBookingById(Integer bookingId) {
        return bookingRepository.findById(bookingId).get();
    }

    public boolean isBooked(Date checkinDate, Date checkoutDate) throws ParseException {
        Booking isBooked = bookingRepository.findByCheckinDateAndCheckoutDate(checkinDate, checkoutDate);
        if (isBooked != null)
            return true;
        return false;
    }

    public Booking createBooking(String checkin, String checkout, Room room, int numberOfDays, float siteFee,
            User customer) throws ParseException {
        SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy");
        Date checkinDate = sdf.parse(checkin);
        Date checkoutDate = sdf.parse(checkout);

        if (isBooked(checkinDate, checkoutDate))
            return null;

        Booking booking = Booking.builder().checkinDate(checkinDate).checkoutDate(checkoutDate)
                .pricePerDay(room.getPrice()).numberOfDays(numberOfDays).siteFee(siteFee).room(room).customer(customer)
                .bookingDate(LocalDateTime.now()).totalFee(numberOfDays * room.getPrice()).isComplete(false).build();

        Booking savedBooking = bookingRepository.save(booking);

        return savedBooking;
    }

    public List<BookedDate> getBookedDate(Room room) throws ParseException {
        List<BookedDate> bookedDates = new ArrayList<>();
        List<Booking> bookingsList = new ArrayList<>();
        Iterator<Booking> bookings = bookingRepository.findByRoom(room).iterator();
        bookings.forEachRemaining(bookingsList::add);

        for (int i = 0; i < bookingsList.size(); i++) {
            Date checkinDate = bookingsList.get(i).getCheckinDate();
            Date checkoutDate = bookingsList.get(i).getCheckoutDate();
            LocalDateTime cancelDate = bookingsList.get(i).getCancelDate();

            if (checkinDate != null & checkoutDate != null && cancelDate == null) {
                String[] checkinDate2 = checkinDate.toString().split("T")[0].split(" ")[0].split("-");
                String[] checkoutDate2 = checkoutDate.toString().split("T")[0].split(" ")[0].split("-");

                bookedDates
                        .add(new BookedDate(checkinDate2[2] + "/" + checkinDate2[1] + "/" +
                                checkinDate2[0],
                                checkoutDate2[2] + "/" + checkoutDate2[1] + "/" + checkoutDate2[0]));
            }
        }
        return bookedDates;
    }

    public List<Booking> getBookingsByRoom(Room room) {
        List<Booking> bookings = bookingRepository.findByRoom(room);
        return bookings;
    }

    public List<Booking> getBookingsByRooms(Integer[] rooms, LocalDateTime startDate, LocalDateTime endDate) {
        List<Booking> bookings = bookingRepository.getBookingsByRooms(rooms, startDate, endDate);
        return bookings;
    }

    public List<Booking> getBookingsByRooms(Integer[] roomIds) {
        List<Booking> bookings = bookingRepository.getBookingsByRooms(roomIds);
        return bookings;
    }

    public List<Booking> getBookingsByUser(Integer customerId, String query) {
        return bookingRepository.getByCustomer(customerId, query);
    }

    public Page<Booking> getBookingsByRooms(Integer[] roomIds, int pageNumber, Map<String, String> filters)
            throws ParseException {
        String sortField = filters.get("sortField");
        String sortDir = filters.get("sortDir");
        String query = filters.get("query");

        LocalDateTime bookingDate = LocalDateTime.now();
        LocalDateTime bookingDate2 = LocalDateTime.of(1970, 1, 1, 0, 0, 0);
        String bookingDateStr = filters.get("bookingDate");
        if (!bookingDateStr.isEmpty()) {
            String[] bookingDateLst = bookingDateStr.split("-");
            int year = Integer.parseInt(bookingDateLst[0]);
            int month = Integer.parseInt(bookingDateLst[1]);
            int day = Integer.parseInt(bookingDateLst[2]);

            bookingDate = LocalDateTime.of(year, month, day, 23, 0, 0);
            bookingDate2 = LocalDateTime.of(year, month, day, 0, 0, 0);
        }

        Integer bookingId = -1;
        if (NumberUtils.isNumber(query)) {
            bookingId = Integer.parseInt(query);
        }
        // Default case: get all bookings with 3 stage
        List<Boolean> isCompleteLst = new ArrayList<>();
        isCompleteLst.add(true);
        isCompleteLst.add(false);
        List<Boolean> isCancelledLst = new ArrayList<>();
        isCancelledLst.add(true);
        isCancelledLst.add(false);
        // End of default case

        Sort sort = Sort.by(sortField);
        if (sortField.equals("room-name")) {
            sort = Sort.by("room.name");
        }
        if (sortField.equals("customer-fullName")) {
            Sort sortByCustomerFirstName = Sort.by("customer.firstName");
            Sort sortByCustomerLastName = Sort.by("customer.lastName");
            sort = sortByCustomerFirstName.and(sortByCustomerLastName);
        }

        sort = sortDir.equals("asc") ? sort.ascending() : sort.descending();
        Pageable pageable = PageRequest.of(pageNumber - 1, MAX_BOOKING_PER_FETCH_BY_HOST, sort); // pase base 0

        String isCompleteStr = filters.get("isComplete");
        if (!isCompleteStr.isEmpty()) {

            if (isCompleteStr.contains("1") && isCompleteStr.contains("0") && isCompleteStr.contains("2")) {

            } else if (isCompleteStr.contains("1") && isCompleteStr.contains("0")) {
                isCancelledLst.remove(true);
            } else if (isCompleteStr.contains("0") && isCompleteStr.contains("2")) {
                isCompleteLst.remove(true);
            } else if (isCompleteStr.contains("1") && isCompleteStr.contains("2")) {
                return bookingRepository.getBookingsByRooms(roomIds, query, true, true, pageable);
            } else {
                String[] isComplete = isCompleteStr.split(" ");

                for (int i = 0; i < isComplete.length; i++) {
                    if (isComplete[i].equals("1")) {
                        isCompleteLst.remove(false);
                        isCancelledLst.remove(true);
                    }
                    if (isComplete[i].equals("0")) {
                        isCompleteLst.remove(true);
                        isCancelledLst.remove(true);
                    }
                    if (isComplete[i].equals("2")) {
                        if (!isCancelledLst.contains(true))
                            isCancelledLst.add(true);
                        isCancelledLst.remove(false);
                    }
                }
            }
        }

        String bookingDateYear = filters.get("bookingDateYear");
        String bookingDateMonth = filters.get("bookingDateMonth");
        Float totalFee = Float.parseFloat(filters.get("totalFee"));

        if (!bookingDateMonth.isEmpty() && !bookingDateYear.isEmpty()) {
            return bookingRepository.getBookingsByRooms(roomIds, query, isCompleteLst, isCancelledLst,
                    Integer.parseInt(bookingDateYear), Integer.parseInt(bookingDateMonth), pageable);
        }

        if (bookingId != -1)
            return bookingRepository.getBookingsByRooms(roomIds, bookingId, pageable);
        else
            return bookingRepository.getBookingsByRooms(roomIds, query, isCompleteLst, isCancelledLst,
                    bookingDate, bookingDate2, totalFee, pageable);
    }

    @Transactional
    public Booking cancelBooking(Integer bookingId) {
        LocalDateTime cancelDate = LocalDateTime.now();
        Booking cancelledBooking = getBookingById(bookingId);

        cancelledBooking.setCancelDate(cancelDate);
        cancelledBooking.setRefund(true);
        cancelledBooking.setComplete(false);
        if (cancelledBooking.isComplete())
            cancelledBooking.setRefundPaid(cancelledBooking.getTotalFee() - cancelledBooking.getSiteFee());
        else
            cancelledBooking.setRefundPaid(cancelledBooking.getTotalFee());

        Booking updatedRecord = bookingRepository.save(cancelledBooking);

        return updatedRecord;
    }

    @Transactional
    public Booking approveBooking(Booking booking) {
        booking.setComplete(true);
        return bookingRepository.save(booking);
    }

    public Page<Booking> listByPage(int pageNum, String sortField, String sortDir, String keyword) {
        Sort sort = Sort.by(sortField);

        sort = sortDir.equals("asc") ? sort.ascending() : sort.descending();

        Pageable pageable = PageRequest.of(pageNum - 1, BOOKINGS_PER_PAGE, sort);

        if (keyword != null) {
            return bookingRepository.findAllAdmin(keyword, pageable);
        }

        return bookingRepository.findAll(pageable);
    }

    public Booking getById(int id) throws BookingNotFoundException {
        try {
            return bookingRepository.getById(id);
        } catch (NoSuchElementException ex) {
            throw new BookingNotFoundException("could not find booking with id: " + id);
        }
    }

    public Integer getNumberOfBooking() {
        return bookingRepository.getNumberOfBooking();
    }

    public Integer getTotalRevenue() {
        return bookingRepository.getTotalRevenue();
    }

    public Integer getNumberOfBookingInLastMonth() {
        return bookingRepository.getNumberOfBookingInLastMonth();
    }

    public Integer getTotalRevenueOfBookingInLastMonth() {
        return bookingRepository.getTotalRevenueOfBookingInLastMonth();
    }

    public Integer getRevenueInSpecificMonthYear(Integer month, Integer year) {
        return bookingRepository.getRevenueInSpecificMonthYear(month, year);
    }

    public Integer getRevenueInSpecificYear(Integer year) {
        return bookingRepository.getRevenueInSpecificYear(year);
    }

    public Integer getNumberOfBookingComplete() {
        return bookingRepository.getNumberOfBookingComplete();
    }

    public Integer getNumberOfBookingNotComplete() {
        return bookingRepository.getNumberOfBookingNotComplete();
    }

    public Integer getNumberOfBookingRefund() {
        return bookingRepository.getNumberOfBookingRefund();
    }

    public List<BookingStatsPerDayDTO> getBookingStatsPerDay(Integer month, Integer year) {
        return bookingRepository.getBookingStatsPerDay(month, year);
    }

    public List<BookingStatsPerDayDTO> getBookingStatsPerMonth(Integer year) {
        return bookingRepository.getBookingStatsPerMonth(year);
    }
}
