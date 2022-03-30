package com.airtnt.airtntapp.booking;

import java.text.ParseException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.airtnt.airtntapp.booking.dto.BookingDTO;
import com.airtnt.airtntapp.booking.dto.BookingListDTO;
import com.airtnt.airtntapp.exception.ForbiddenException;
import com.airtnt.airtntapp.exception.NotAuthenticatedException;
import com.airtnt.airtntapp.exception.NullCookieException;
import com.airtnt.airtntapp.middleware.Authenticate;
import com.airtnt.airtntapp.response.StandardJSONResponse;
import com.airtnt.airtntapp.response.error.BadResponse;
import com.airtnt.airtntapp.response.error.ForbiddenResponse;
import com.airtnt.airtntapp.response.error.NotAuthenticatedResponse;
import com.airtnt.airtntapp.response.success.OkResponse;
import com.airtnt.airtntapp.room.RoomService;
import com.airtnt.entity.Booking;
import com.airtnt.entity.Room;
import com.airtnt.entity.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
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
    private Authenticate authenticate;

    @GetMapping(value = "/{roomid}/create")
    public ResponseEntity<StandardJSONResponse<BookingDTO>> createBooking(
            @CookieValue(value = "user", required = false) String cookie,
            @PathVariable("roomid") Integer roomId,
            @RequestParam("checkin") String checkin,
            @RequestParam("checkout") String checkout,
            @RequestParam("numberOfDays") Integer numberOfDays,
            @RequestParam("clientMessage") String clientMessage) throws ParseException {
        try {
            User customer = authenticate.getLoggedInUser(cookie);

            Booking booking = bookingService.createBooking(checkin, checkout, roomService.getRoomById(roomId),
                    numberOfDays, clientMessage, customer);

            return booking != null ? new OkResponse<BookingDTO>(BookingDTO.buildBookingDTO(
                    booking)).response() : new BadResponse<BookingDTO>("can not create booking").response();
        } catch (NullCookieException ex) {
            return new BadResponse<BookingDTO>(ex.getMessage()).response();
        } catch (NotAuthenticatedException ex) {
            return new NotAuthenticatedResponse<BookingDTO>().response();
        }
    }

    @GetMapping(value = "/listings/{pageNumber}")
    public ResponseEntity<StandardJSONResponse<Page<BookingListDTO>>> listings(
            @CookieValue(value = "user", required = false) String cookie,
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
        try {
            User host = authenticate.getLoggedInUser(cookie);

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
            return new OkResponse<Page<BookingListDTO>>(bookings).response();

        } catch (NullCookieException ex) {
            return new BadResponse<Page<BookingListDTO>>(ex.getMessage()).response();
        } catch (NotAuthenticatedException ex) {
            return new NotAuthenticatedResponse<Page<BookingListDTO>>().response();
        }
    }

    @GetMapping(value = "/{bookingid}/canceled")
    public ResponseEntity<StandardJSONResponse<String>> cancelBooking(
            @PathVariable("bookingid") Integer bookingid,
            @CookieValue(value = "user", required = false) String cookie) {
        try {
            User customer = authenticate.getLoggedInUser(cookie);
            Booking booking = bookingService.cancelBooking(bookingid, customer);

            return booking != null ? new OkResponse<String>("cancel booking successfully").response()
                    : new BadResponse<String>("can not cancel booking").response();

        } catch (NullCookieException ex) {
            return new BadResponse<String>(ex.getMessage()).response();
        } catch (NotAuthenticatedException ex) {
            return new NotAuthenticatedResponse<String>().response();
        } catch (ForbiddenException e) {
            return new ForbiddenResponse<String>().response();
        }
    }

    @GetMapping(value = "/{bookingid}/approved")
    public ResponseEntity<StandardJSONResponse<String>> approveBooking(@PathVariable("bookingid") Integer bookingId,
            @CookieValue(value = "user", required = false) String cookie) {
        try {
            User customer = authenticate.getLoggedInUser(cookie);
            Booking booking = bookingService.approveBooking(bookingId, customer);

            return booking != null ? new OkResponse<String>("approve booking successfully").response()
                    : new BadResponse<String>("can not approve booking").response();

        } catch (ForbiddenException e) {
            return new ForbiddenResponse<String>().response();
        } catch (NullCookieException ex) {
            return new BadResponse<String>(ex.getMessage()).response();
        } catch (NotAuthenticatedException ex) {
            return new NotAuthenticatedResponse<String>().response();
        }
    }
}
