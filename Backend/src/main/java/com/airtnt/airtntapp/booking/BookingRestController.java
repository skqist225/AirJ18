package com.airtnt.airtntapp.booking;

import java.text.ParseException;

import com.airtnt.airtntapp.room.RoomService;
import com.airtnt.airtntapp.user.UserService;
import com.airtnt.entity.Booking;
import com.airtnt.entity.Room;
import com.airtnt.entity.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class BookingRestController {

    @Autowired
    private RoomService roomService;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private UserService userService;

    @GetMapping(value = "/booking/{roomId}/create")
    public BookingDTO createBooking(@AuthenticationPrincipal UserDetails userDetails,
            @PathVariable("roomId") Integer roomId,
            @Param("checkin") String checkin,
            @Param("checkout") String checkout,
            @Param("numberOfDays") Integer numberOfDays,
            @Param("siteFee") Float siteFee) throws ParseException {
        Room room = roomService.getRoomById(roomId);
        User customer = userService.getByEmail(userDetails.getUsername());
        Booking booking = bookingService.createBooking(checkin, checkout, room,
                numberOfDays, siteFee, customer);
        BookingDTO bDTO = new BookingDTO();
        if (booking != null)
            bDTO = new BookingDTO(booking.getId(), booking.getBookingDate(),
                    booking.getRoom().getCurrency().getSymbol(), booking.getTotalFee(), 0);
        return bDTO;
    }
}
