package com.airtnt.airtntapp.stats;

import java.util.List;

import com.airtnt.airtntapp.booking.BookingService;
import com.airtnt.airtntapp.booking.BookingStatsPerDayDTO;
import com.airtnt.airtntapp.room.RoomService;
import com.airtnt.airtntapp.user.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/admin")
public class StatsAdminController {
    @Autowired
    UserService userService;
    @Autowired
    RoomService roomService;
    @Autowired
    BookingService bookingService;

    @GetMapping("/stats")
    public String stats(Model model) {
        Integer numberOfUsers = userService.getNumberOfUser();
        Integer numberOfRooms = roomService.getNumberOfRoom();
        Integer numberOfBookings = bookingService.getNumberOfBooking();
        Integer numberOfBookingsComplete = bookingService.getNumberOfBookingComplete();
        Integer numberOfBookingsNotComplete = bookingService.getNumberOfBookingNotComplete();
        Integer numberOfBookingsRefund = bookingService.getNumberOfBookingRefund();
        Integer totalRevenue = bookingService.getTotalRevenue();
        Integer numberOfBookingsInLastMonths = bookingService.getNumberOfBookingInLastMonth();
        Integer totalRevenueInLastMonths = bookingService.getTotalRevenueOfBookingInLastMonth();

        model.addAttribute("numberOfUsers", numberOfUsers);
        model.addAttribute("numberOfRooms", numberOfRooms);
        model.addAttribute("numberOfBookings", numberOfBookings);
        model.addAttribute("numberOfBookingsComplete", numberOfBookingsComplete);
        model.addAttribute("numberOfBookingsNotComplete", numberOfBookingsNotComplete);
        model.addAttribute("numberOfBookingsRefund", numberOfBookingsRefund);
        model.addAttribute("totalRevenue", totalRevenue);
        model.addAttribute("numberOfBookingsInLastMonths", numberOfBookingsInLastMonths);
        model.addAttribute("totalRevenueInLastMonths", totalRevenueInLastMonths);
        return "stats/stats";
    }

    @PostMapping("/stats/checkRevenue")
    public String checkRevenue(Model model,
            @Param("month") Integer month,
            @Param("year") Integer year) {
        Integer revenueInSpecificMonth = bookingService.getRevenueInSpecificMonthYear(month, year);
        List<BookingStatsPerDayDTO> bookingStatsPerDayDTO = bookingService.getBookingStatsPerDay(month, year);
        model.addAttribute("revenueInSpecificMonth", revenueInSpecificMonth);
        model.addAttribute("bookingStatsPerDayDTO", bookingStatsPerDayDTO);
        model.addAttribute("month", month);
        model.addAttribute("year", year);
        return "stats/checkRevenue";
    }

    @PostMapping("/stats/checkRevenueYear")
    public String checkRevenueYear(Model model,
            @Param("year") Integer year) {
        Integer revenueInSpecificYear = bookingService.getRevenueInSpecificYear(year);
        List<BookingStatsPerDayDTO> bookingStatsPerMonthDTOs = bookingService.getBookingStatsPerMonth(year);
        model.addAttribute("revenueInSpecificYear", revenueInSpecificYear);
        model.addAttribute("bookingStatsPerMonthDTOs", bookingStatsPerMonthDTOs);
        model.addAttribute("year", year);
        return "stats/checkRevenueYear";
    }
}
