package com.airtnt.airtntapp.booking;

import java.text.ParseException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.airtnt.airtntapp.booking.dto.BookingDTO;
import com.airtnt.airtntapp.booking.dto.BookingListDTO;
import com.airtnt.airtntapp.booking.response.BookingListsResponseEntity;
import com.airtnt.airtntapp.booking.response.CancelBookingResponseEntity;
import com.airtnt.airtntapp.cookie.CookieProcess;
import com.airtnt.airtntapp.room.RoomService;
import com.airtnt.airtntapp.user.UserService;
import com.airtnt.entity.Booking;
import com.airtnt.entity.Room;
import com.airtnt.entity.User;
import com.airtnt.error.NotAuthenticatedError;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/booking")
public class BookingRestController {

    @Autowired
    private RoomService roomService;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private UserService userService;

    @Autowired
    private CookieProcess cookiePorcess;

    @GetMapping(value = "/{roomId}/create")
    public BookingDTO createBooking(
            @CookieValue("user") String cookie,
            @PathVariable("roomId") Integer roomId,
            @RequestParam("checkin") String checkin,
            @RequestParam("checkout") String checkout,
            @RequestParam("numberOfDays") Integer numberOfDays,
            @RequestParam("clientMessage") String clientMessage) throws ParseException {
        String userEmail = cookiePorcess.readCookie(cookie);
        Room room = roomService.getRoomById(roomId);
        User customer = userService.getByEmail(userEmail);
        Booking booking = bookingService.createBooking(checkin, checkout, room,
                numberOfDays, clientMessage, customer);
        BookingDTO bDTO = new BookingDTO();
        if (booking != null)
            bDTO = new BookingDTO(booking.getId(), booking.getBookingDate(),
                    booking.getRoom().getCurrency().getSymbol(), booking.getTotalFee(), 0);
        return bDTO;
    }

    @GetMapping(value = "/listings/{pageNumber}")
    public ResponseEntity<BookingListsResponseEntity> listings(
            @CookieValue("user") String cookie,
            @PathVariable("pageNumber") Integer pageNumber,
            @RequestParam(name = "booking_date_month", required = false, defaultValue = "") String bookingDateMonth,
            @RequestParam(name = "booking_date_year", required = false, defaultValue = "") String bookingDateYear,
            @RequestParam(name = "totalFee", required = false, defaultValue = "0") String totalFee,
            @RequestParam(name = "query", required = false, defaultValue = "") String query,
            @RequestParam(name = "sort_dir", required = false, defaultValue = "asc") String sortDir,
            @RequestParam(name = "sort_field", required = false, defaultValue = "id") String sortField,
            @RequestParam(name = "bookingDate", required = false, defaultValue = "") String bookingDate,
            @RequestParam(name = "isComplete", required = false, defaultValue = "") String isComplete)
            throws ParseException {
        String userEmail = cookiePorcess.readCookie(cookie);
        User host = userService.getByEmail(userEmail);

        List<Room> rooms = roomService.getRoomsByHostId(host);
        Integer[] roomIds = new Integer[rooms.size()];
        for (int i = 0; i < rooms.size(); i++) {
            roomIds[i] = rooms.get(i).getId();
        }
        Map<String, String> filters = new HashMap<>();
        filters.put("sortField", sortField);
        filters.put("sortDir", sortDir);
        filters.put("query", query);
        filters.put("isComplete", isComplete);
        filters.put("bookingDate", bookingDate);
        filters.put("bookingDateMonth", bookingDateMonth);
        filters.put("bookingDateYear", bookingDateYear);
        filters.put("totalFee", totalFee);

        Page<BookingListDTO> bookings = bookingService.getBookingListByRooms(roomIds, pageNumber, filters);

        BookingListsResponseEntity bookingListsResponseEntity = new BookingListsResponseEntity();
        bookingListsResponseEntity.setBookings(bookings);

        return new ResponseEntity<BookingListsResponseEntity>(bookingListsResponseEntity, null, HttpStatus.OK);
    }

    @GetMapping(value = "/{bookingId}/canceled")
    public ResponseEntity<CancelBookingResponseEntity> cancelBooking(@PathVariable("bookingId") Integer bookingId,
            @CookieValue("user") String cookie) {
        CancelBookingResponseEntity cancelBookingResponseEntity = new CancelBookingResponseEntity();
        try {
            String userEmail = cookiePorcess.readCookie(cookie);
            User currentUser = userService.getByEmail(userEmail);
            Booking booking = bookingService.cancelBooking(bookingId, currentUser);

            cancelBookingResponseEntity.setStatus(booking != null ? "success" : "failure");
            return new ResponseEntity<CancelBookingResponseEntity>(cancelBookingResponseEntity, null, 201);

        } catch (NotAuthenticatedError e) {
            NotAuthenticatedError notAuthenticatedError = new NotAuthenticatedError();
            cancelBookingResponseEntity.setStatus(e.getMessage());
            return new ResponseEntity<CancelBookingResponseEntity>(cancelBookingResponseEntity, null,
                    notAuthenticatedError.getStatusCode());
        }
    }

    @GetMapping(value = "/{bookingId}/approved")
    public ResponseEntity<CancelBookingResponseEntity> approveBooking(@PathVariable("bookingId") Integer bookingId,
            @CookieValue("user") String cookie) {
        CancelBookingResponseEntity cancelBookingResponseEntity = new CancelBookingResponseEntity();
        try {
            String userEmail = cookiePorcess.readCookie(cookie);
            User currentUser = userService.getByEmail(userEmail);
            Booking booking = bookingService.approveBooking(bookingId, currentUser);

            cancelBookingResponseEntity.setStatus(booking != null ? "success" : "failure");
            return new ResponseEntity<CancelBookingResponseEntity>(cancelBookingResponseEntity, null, 201);
        } catch (Exception e) {
            NotAuthenticatedError notAuthenticatedError = new NotAuthenticatedError();
            cancelBookingResponseEntity.setStatus(e.getMessage());
            return new ResponseEntity<CancelBookingResponseEntity>(cancelBookingResponseEntity, null,
                    notAuthenticatedError.getStatusCode());
        }
    }
}
