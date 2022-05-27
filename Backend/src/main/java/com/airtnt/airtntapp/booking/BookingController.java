package com.airtnt.airtntapp.booking;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.airtnt.airtntapp.exception.BookingNotFoundException;
import com.airtnt.airtntapp.exception.ForbiddenException;
import com.airtnt.airtntapp.exception.UserNotFoundException;
import com.airtnt.airtntapp.room.RoomService;
import com.airtnt.airtntapp.user.UserService;
import com.airtnt.airtntapp.user.dto.RatingDTO;
import com.airtnt.entity.Booking;
import com.airtnt.entity.Room;
import com.airtnt.entity.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/booking/")
public class BookingController {

    @Autowired
    private RoomService roomService;

    @Autowired
    private UserService userService;

    @Autowired
    private BookingService bookingService;

    @Value("${stripe.pubkey}")
    private String stripePublicKey;

    @GetMapping("{roomId}")
    public String roomBookings(@PathVariable("roomId") Integer roomId, @AuthenticationPrincipal UserDetails userDetails,
            @Param("checkin") String checkin,
            @Param("checkout") String checkout, @Param("numberOfNights") Integer numberOfNights,
            RedirectAttributes redirectAttributes, Model model) throws ParseException {
        SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy");
        Date checkinDate = sdf.parse(checkin);
        Date checkoutDate = sdf.parse(checkout);

        if (bookingService.isBooked(checkinDate, checkoutDate, roomId))
            return "redirect:/room/" + roomId;

        Room room = roomService.getRoomById(roomId);
        String[] checkinArr = checkin.split("-");
        String[] checkoutArr = checkout.split("-");

        model.addAttribute("checkin", checkinArr[0] + " thg " + checkinArr[1] + ", " + checkinArr[2]);
        model.addAttribute("checkout", checkoutArr[0] + " thg " + checkoutArr[1] + ", " + checkoutArr[2]);
        model.addAttribute("checkinPlain", checkin);
        model.addAttribute("checkoutPlain", checkout);
        model.addAttribute("room", room);
        model.addAttribute("numberOfNights", numberOfNights);
        model.addAttribute("stripePublicKey", stripePublicKey);

        return "booking/booking";
    }

    @GetMapping(value = "success-booking")
    public String booking(@AuthenticationPrincipal UserDetails userDetails, Model model) throws ParseException {
        try {
            User user = userService.findByEmail(userDetails.getUsername());
            model.addAttribute("username", user.getFullName());
        } catch (UserNotFoundException ex) {
            model.addAttribute("username", "");
        }
        return new String("booking/success");
    }

    @GetMapping(value = "listings/{pageNumber}")
    public String listings(@AuthenticationPrincipal UserDetails userDetails,
            @PathVariable("pageNumber") Integer pageNumber,
            @RequestParam(name = "booking_date_month", required = false, defaultValue = "") String bookingDateMonth,
            @RequestParam(name = "booking_date_year", required = false, defaultValue = "") String bookingDateYear,
            @RequestParam(name = "totalFee", required = false, defaultValue = "0") String totalFee,
            @RequestParam(name = "query", required = false, defaultValue = "") String query,
            @RequestParam(name = "sort_dir", required = false, defaultValue = "asc") String sortDir,
            @RequestParam(name = "sort_field", required = false, defaultValue = "id") String sortField,
            @RequestParam(name = "bookingDate", required = false, defaultValue = "") String bookingDate,
            @RequestParam(name = "isComplete", required = false, defaultValue = "") String isComplete,
            Model model) throws ParseException, UserNotFoundException {
        User host = userService.findByEmail(userDetails.getUsername());
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

        Page<Booking> bookings = bookingService.getBookingsByRooms(roomIds, pageNumber, filters);
        model.addAttribute("bookings", bookings);
        model.addAttribute("includeMiddle", true);
        model.addAttribute("excludeBecomeHostAndNavigationHeader", true);
        model.addAttribute("totalBookings", bookings.getTotalElements());

        return new String("booking/listings");
    }

    @GetMapping(value = "{bookingId}/view")
    public String viewBooking(@PathVariable("bookingId") Integer bookingId,
            @AuthenticationPrincipal UserDetails userDetails, Model model) throws UserNotFoundException {
        Booking booking = bookingService.findById(bookingId);
        List<Booking> bookings = new ArrayList<>();
        bookings.add(booking);
        User user = null;
        if (userDetails != null) {
            user = userService.findByEmail(userDetails.getUsername());
            Integer[] roomIds = new Integer[user.getFavRooms().size()];
            int i = 0;
            for (Room r : user.getFavRooms())
                roomIds[i++] = r.getId();
            model.addAttribute("wishlists", roomIds);
        }
        if (user == null)
            model.addAttribute("user", null);
        else
            model.addAttribute("user", user.getFullName());

        model.addAttribute("bookings", bookings);
        model.addAttribute("includeMiddle", true);
        model.addAttribute("excludeBecomeHostAndNavigationHeader", true);
        Integer[] starLoop = new Integer[] { 1, 2, 3, 4, 5 };
        String[] ratingLabel = new String[] { "Mức độ sạch sẽ", "Độ chính xác", "Liên lạc", "Vị trí", "Nhận phòng",
                "Giá trị" };

        List<RatingDTO> ratings = new ArrayList<>();
        for (int i = 0; i < ratingLabel.length; i++) {
            ratings.add(new RatingDTO(ratingLabel[i], starLoop));
        }

        model.addAttribute("ratings", ratings);
        model.addAttribute("removeReview", true);
        return new String("user/bookings");
    }

    @GetMapping(value = "/{bookingId}/cancel")
    public String cancelBooking(@PathVariable("bookingId") Integer bookingId,
            @AuthenticationPrincipal UserDetails userDetails, RedirectAttributes redirectAttributes)
            throws ForbiddenException, UserNotFoundException, BookingNotFoundException {
        User currentUser = userService.findByEmail(userDetails.getUsername());
        Booking booking = bookingService.hostCancelBooking(bookingId, currentUser);
        if (booking != null)
            redirectAttributes.addFlashAttribute("cancelMessage", "Hủy đặt phòng thành công");
        else
            redirectAttributes.addAttribute("cancelMessage", "Hủy đặt phòng thất bại");

        return "redirect:/user/bookings";
    }

    @GetMapping(value = "/{bookingId}/approved")
    public String approveBooking(@PathVariable("bookingId") Integer bookingId,
            @AuthenticationPrincipal UserDetails userDetails, RedirectAttributes redirectAttributes)
            throws ForbiddenException, UserNotFoundException {
        User requestedUser = userService.findByEmail(userDetails.getUsername());

        if (bookingService.approveBooking(bookingId, requestedUser) != null)
            redirectAttributes.addFlashAttribute("approveMessage", "Duyệt lịch đặt phòng thành công");
        else
            redirectAttributes.addAttribute("approveMessage", "Duyệt lịch đặt phòng thất bại");

        return "redirect:/booking/listings/1";
    }

}
