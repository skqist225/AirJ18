package com.airtnt.airtntapp.booking;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.LongStream;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Expression;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.transaction.Transactional;

import com.airtnt.airtntapp.booking.dto.BookingListDTO;
import com.airtnt.airtntapp.booking.dto.BookingListResponse;
import com.airtnt.airtntapp.exception.AlreadyCancelException;
import com.airtnt.airtntapp.exception.BookingNotFoundException;
import com.airtnt.airtntapp.exception.ForbiddenException;
import com.airtnt.airtntapp.exception.RoomHasBeenBookedException;
import com.airtnt.airtntapp.exception.UserHasBeenBookedThisRoomException;
import com.airtnt.airtntapp.user.dto.BookedRoomDTO;
import com.airtnt.entity.Booking;
import com.airtnt.entity.Room;
import com.airtnt.entity.User;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.math.NumberUtils;
import org.hibernate.query.criteria.internal.expression.ConcatExpression;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
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

    public Booking getBookingById(Integer bookingId) throws BookingNotFoundException {
        try {
            return bookingRepository.findById(bookingId).get();
        } catch (NoSuchElementException e) {
            throw new BookingNotFoundException("Booking not found");
        }
    }

    public boolean isBooked(Date checkinDate, Date checkoutDate, Integer roomId) throws ParseException {
        List<Booking> bookings = bookingRepository.getBookedDates(roomId);

        boolean isBooked = false;
        for (Booking booking : bookings) {
            Date cid = booking.getCheckinDate();
            Date cod = booking.getCheckoutDate();

            if ((checkinDate.compareTo(cid) >= 0 && checkinDate.compareTo(cod) <= 0) || (checkoutDate
                    .compareTo(cid) >= 0 && checkoutDate.compareTo(cod) <= 0)) {
                isBooked = true;
                break;
            }

            if ((cid.compareTo(checkinDate) >= 0 && cid.compareTo(checkoutDate) <= 0) || (cod
                    .compareTo(checkinDate) >= 0 && cod.compareTo(checkoutDate) <= 0)) {
                isBooked = true;
                break;
            }
        }

        return isBooked;
    }

    public boolean isBookedByUser(Date checkinDate, Date checkoutDate, Integer roomId, Integer customerId) {
        return bookingRepository.isBookedByUser(checkinDate, checkoutDate, roomId, customerId).size() > 0 ? true
                : false;
    }

    public Booking createBooking(String checkin, String checkout, Room room, int numberOfDays, String clientMessage,
            User customer, String userToken)
            throws ParseException, RoomHasBeenBookedException, UserHasBeenBookedThisRoomException {
        SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy");
        Date checkinDate = sdf.parse(checkin);
        Date checkoutDate = sdf.parse(checkout);

        if (isBooked(checkinDate, checkoutDate, room.getId()))
            throw new RoomHasBeenBookedException("This room has been booked");

        if (isBookedByUser(checkinDate, checkoutDate, room.getId(), customer.getId()))
            throw new UserHasBeenBookedThisRoomException("You have been booked this room");

        Float cleanFee = room.getPrice() * 5 / 100;
        Float siteFee = room.getPrice() * 10 / 100;

        Booking booking = Booking.builder().checkinDate(checkinDate).checkoutDate(checkoutDate)
                .pricePerDay(room.getPrice()).numberOfDays(numberOfDays).siteFee(siteFee).room(room).customer(customer)
                .bookingDate(LocalDateTime.now()).cleanFee(cleanFee)
                .totalFee(room.getPrice() * numberOfDays + siteFee + cleanFee)
                .clientMessage(
                        clientMessage)
                .userToken(userToken)
                .isComplete(false).build();

        Booking savedBooking = bookingRepository.save(booking);

        return savedBooking;
    }

    public List<BookedDateDTO> getBookedDates(Room room) throws ParseException {
        List<BookedDateDTO> bookedDates = new ArrayList<>();
        List<Booking> bookings = new ArrayList<>();
        Iterator<Booking> bookingsItr = bookingRepository.findByRoom(room).iterator();
        bookingsItr.forEachRemaining(bookings::add);

        for (int i = 0; i < bookings.size(); i++) {
            Date checkinDate = bookings.get(i).getCheckinDate();
            Date checkoutDate = bookings.get(i).getCheckoutDate();
            LocalDateTime cancelDate = bookings.get(i).getCancelDate();

            if (checkinDate != null & checkoutDate != null && cancelDate == null) {
                String[] checkinDate2 = checkinDate.toString().split("T")[0].split(" ")[0].split("-");
                String[] checkoutDate2 = checkoutDate.toString().split("T")[0].split(" ")[0].split("-");

                bookedDates
                        .add(new BookedDateDTO(checkinDate2[2] + "/" + checkinDate2[1] + "/" +
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

    public List<BookedRoomDTO> getBookedRoomsByUser(Integer customerId, String query) {
        List<Booking> bookings = bookingRepository.getBookedRoomsByUser(customerId, query);
        List<BookedRoomDTO> bookedRoomDTOs = new ArrayList<>();
        for (Booking booking : bookings)
            bookedRoomDTOs.add(BookedRoomDTO.buildBookedRoomDTO(booking));
        return bookedRoomDTOs;
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

    public BookingListResponse getBookingListByRooms(List<Integer> roomIds, Map<String, String> filters, int page) {
        String query = filters.get("query");
        String bookingDateStr = filters.get("bookingDate");
        String isCompleteStr = filters.get("isComplete");
        String bookingDateYear = filters.get("bookingDateYear");
        String bookingDateMonth = filters.get("bookingDateMonth");
        String sortField = filters.get("sortField");
        String sortDir = filters.get("sortDir");
        Float totalFee = Float.parseFloat(filters.get("totalFee"));

        Sort sort = Sort.by(sortField);
        if (sortField.equals("room-name")) {
            sort = Sort.by("room.name");
        }
        if (sortField.equals("customer-fullName")) {
            Sort sortByCustomerFirstName = Sort.by("customer.firstName");
            Sort sortByCustomerLastName = Sort.by("customer.lastName");
            sort = sortByCustomerFirstName.and(sortByCustomerLastName);
        }

        sort = sortDir.equals("ASC") ? sort.ascending() : sort.descending();
        Pageable pageable = PageRequest.of(page - 1, MAX_BOOKING_PER_FETCH_BY_HOST, sort);

        Page<Booking> bookingPage = bookingRepository.findAll(new Specification<Booking>() {
            @Override
            public Predicate toPredicate(Root<Booking> root, CriteriaQuery<?> criteriaQuery,
                    CriteriaBuilder criteriaBuilder) {
                List<Predicate> predicates = new ArrayList<>();

                Expression<String> bookingId = root.get("id");
                Expression<String> roomName = root.get("room").get("name");
                Expression<LocalDateTime> bookingdDate = root.get("bookingDate");
                Expression<Boolean> isComplete = root.get("isComplete");
                Expression<Boolean> isRefund = root.get("isRefund");
                Expression<User> roomId = root.get("room").get("id");

                predicates.add(criteriaBuilder.and(roomId.in(roomIds)));

                if (!StringUtils.isEmpty(query)) {
                    Expression<String> wantedQueryField = criteriaBuilder.concat(bookingId, roomName);
                    predicates.add(criteriaBuilder.and(criteriaBuilder.like(wantedQueryField, "%" + query + "%")));
                }

                if (!StringUtils.isEmpty(bookingDateStr)) {
                    try {
                        LocalDateTime bkDate = new SimpleDateFormat("yyyy-MM-dd").parse(bookingDateStr).toInstant()
                                .atZone(ZoneId.systemDefault()).toLocalDateTime();
                        LocalDateTime startOfBookingDate = bkDate.withHour(0).withMinute(0).withSecond(0);
                        LocalDateTime endOfBookingDate = bkDate.withHour(23).withMinute(0).withSecond(0);

                        predicates.add(criteriaBuilder.and(
                                criteriaBuilder.lessThanOrEqualTo(bookingdDate, endOfBookingDate)));
                        predicates.add(criteriaBuilder.and(criteriaBuilder.greaterThanOrEqualTo(
                                bookingdDate, startOfBookingDate)));
                    } catch (ParseException e) {
                        e.printStackTrace();
                    }
                }

                if (!StringUtils.isEmpty(isCompleteStr)) {
                    boolean isCompleteAndCancel = false;
                    List<Boolean> isCompleteLst = new ArrayList<Boolean>() {
                        {
                            add(true);
                            add(false);
                        }
                    };
                    List<Boolean> isRefundLst = new ArrayList<Boolean>() {
                        {
                            add(true);
                            add(false);
                        }
                    };
                    // 0 is complete
                    // 1 is pending
                    // 2 is cancel
                    // 0: complete: isComplete = true && isRefund = false
                    // 1: pending: isComplete = false && isRefund = false
                    // 2: cancel: isComplete = false && isRefund = true

                    if (isCompleteStr.contains("1") && isCompleteStr.contains("0") && isCompleteStr.contains("2")) {

                    } else if (isCompleteStr.contains("0") && isCompleteStr.contains("1")) {// pending and complete
                        isRefundLst.remove(true);
                    } else if (isCompleteStr.contains("0") && isCompleteStr.contains("2")) { // complete and cancel
                        predicates.add(
                                criteriaBuilder.and(
                                        criteriaBuilder.or(
                                                criteriaBuilder.and(criteriaBuilder.equal(isComplete, true),
                                                        criteriaBuilder.equal(isRefund, false)),
                                                criteriaBuilder.and(criteriaBuilder.equal(isComplete, false),
                                                        criteriaBuilder.equal(isRefund, true)))));
                        isCompleteAndCancel = true;
                    } else if (isCompleteStr.contains("1") && isCompleteStr.contains("2")) { // pending and cancel
                        isCompleteLst.remove(true);
                    } else {
                        if (isCompleteStr.equals("1")) {
                            isCompleteLst.remove(true);
                            isRefundLst.remove(true);
                        } else if (isCompleteStr.equals("0")) {
                            isCompleteLst.remove(false);
                            isRefundLst.remove(true);
                        } else {
                            isCompleteLst.remove(true);
                            isRefundLst.remove(false);
                        }
                    }

                    if (!isCompleteAndCancel) {
                        predicates.add(criteriaBuilder.and(isComplete.in(isCompleteLst), isRefund.in(isRefundLst)));
                    }
                }

                if (!StringUtils.isEmpty(bookingDateMonth) && !StringUtils.isEmpty(bookingDateYear)) {
                    predicates.add(criteriaBuilder.and(criteriaBuilder.equal(
                            criteriaBuilder.function("MONTH", Integer.class, root.get("bookingDate")),
                            bookingDateMonth)));
                    predicates.add(criteriaBuilder.and(criteriaBuilder.equal(
                            criteriaBuilder.function("YEAR", Integer.class, root.get("bookingDate")),
                            bookingDateYear)));
                } else if (!StringUtils.isEmpty(bookingDateMonth)) {
                    predicates.add(criteriaBuilder.and(criteriaBuilder.equal(
                            criteriaBuilder.function("MONTH", Integer.class, root.get("bookingDate")),
                            bookingDateMonth)));
                } else if (!StringUtils.isEmpty(bookingDateYear)) {
                    predicates.add(criteriaBuilder.and(criteriaBuilder.equal(
                            criteriaBuilder.function("YEAR", Integer.class, root.get("bookingDate")),
                            bookingDateYear)));
                }

                predicates
                        .add(criteriaBuilder.and(criteriaBuilder.greaterThanOrEqualTo(root.get("totalFee"), totalFee)));

                // criteriaQuery.orderBy(criteriaBuilder.desc(bookingdDate),
                // criteriaBuilder.desc(bookingId));

                return criteriaBuilder.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        }, pageable);

        List<BookingListDTO> bookingListDTOs = new ArrayList<>();
        for (Booking b : bookingPage.toList()) {
            bookingListDTOs.add(BookingListDTO.buildDTO(b));
        }

        return new BookingListResponse(bookingListDTOs, bookingPage.getTotalElements(), bookingPage.getTotalPages());
    }

    @Transactional
    public Booking hostCancelBooking(Integer bookingId, User user) throws ForbiddenException, BookingNotFoundException {
        Booking canceledBooking = getBookingById(bookingId);

        LocalDateTime cancelDate = LocalDateTime.now();

        // if user sent request is not host of the room
        if (!user.getId().equals(canceledBooking.getRoom().getHost().getId()))
            throw new ForbiddenException("You are not the host of the room");

        canceledBooking.setCancelDate(cancelDate);
        canceledBooking.setRefund(true);
        canceledBooking.setComplete(false);
        canceledBooking.setRefundPaid(canceledBooking.getTotalFee());

        return bookingRepository.save(canceledBooking);
    }

    @Transactional
    public Booking userCancelBooking(Integer bookingId, User user)
            throws ForbiddenException, BookingNotFoundException, AlreadyCancelException {
        Booking canceledBooking = getBookingById(bookingId);

        // if user sent request is not customer of the room
        if (!user.getId().equals(canceledBooking.getCustomer().getId()))
            throw new ForbiddenException("You are not the owner of this booking");

        if (canceledBooking.isRefund() == true && canceledBooking.isComplete() == false)
            throw new AlreadyCancelException("You have been canceled this room");

        LocalDateTime checkinDate = canceledBooking.getCheckinDate().toInstant().atZone(ZoneId.systemDefault())
                .toLocalDateTime();
        LocalDateTime bookingDate = canceledBooking.getBookingDate();
        LocalDateTime cancelDate = LocalDateTime.now();

        if (!bookingDate.toLocalDate().toString().equals(LocalDate.now().toString())) {
            long numOfDays = ChronoUnit.DAYS.between(bookingDate.toLocalDate(), checkinDate.toLocalDate());
            List<LocalDate> listOfDates = LongStream.range(0, numOfDays)
                    .mapToObj(bookingDate.toLocalDate()::plusDays)
                    .collect(Collectors.toList());

            System.out.println(listOfDates);
            LocalDateTime dateBetweenBookingDateAndCheckinDate = listOfDates.get((int) Math.floor(
                    listOfDates.size() / 2)).atStartOfDay();

            if (cancelDate.isBefore(dateBetweenBookingDateAndCheckinDate)) {
                canceledBooking.setRefundPaid(canceledBooking.getTotalFee());
            } else {
                canceledBooking.setRefundPaid(canceledBooking.getTotalFee() / 2);
            }
        } else {
            canceledBooking.setRefundPaid(canceledBooking.getTotalFee());
        }

        // If canceled date is after the date between booking date and checkin date
        // User will only get half of the refund paid.

        canceledBooking.setCancelDate(cancelDate);
        canceledBooking.setRefund(true);
        canceledBooking.setComplete(false);

        return bookingRepository.save(canceledBooking);
    }

    @Transactional
    public Booking approveBooking(Integer bookingId, User user) throws ForbiddenException {
        Booking approvedBooking;
        try {
            approvedBooking = getBookingById(bookingId);

            if (!user.getId().equals(approvedBooking.getRoom().getHost().getId())) {
                throw new ForbiddenException(); // if user sent request is not host of the room
            }

            approvedBooking.setComplete(true);
            approvedBooking.setUserToken(null);

            return bookingRepository.save(approvedBooking);
        } catch (BookingNotFoundException e) {
            return null;
        }
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
