package com.airtnt.airtntapp.progress;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.airtnt.airtntapp.booking.BookingService;
import com.airtnt.airtntapp.booking.dto.BookingDTO;
import com.airtnt.airtntapp.middleware.Authenticate;
import com.airtnt.airtntapp.progress.dto.ProgressEarningsDTO;
import com.airtnt.airtntapp.progress.dto.ProgressReviewsDTO;
import com.airtnt.airtntapp.review.ReviewService;
import com.airtnt.airtntapp.review.dto.ReviewDTO;
import com.airtnt.airtntapp.room.RoomService;
import com.airtnt.entity.Booking;
import com.airtnt.entity.Review;
import com.airtnt.entity.Room;
import com.airtnt.entity.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/progress/")
public class ProgressRestController {

    @Autowired
    private RoomService roomService;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private Authenticate authenticate;

    @GetMapping(value = "earnings")
    public ProgressEarningsDTO earnings(@CookieValue("user") String cookie, @Param("year") Integer year) {

        if (year == null)
            return null;

        User host = authenticate.getLoggedInUser(cookie);
        List<Room> rooms = roomService.getRoomsByHostId(host);
        Integer[] roomIds = new Integer[rooms.size()];

        for (int i = 0; i < rooms.size(); i++) {
            roomIds[i] = rooms.get(i).getId();
        }

        LocalDateTime startDate = LocalDateTime.of(year, 1, 1, 0, 0, 0);
        LocalDateTime endDate = LocalDateTime.of(year, 12, 31, 0, 0, 0);

        List<Booking> bookings = bookingService.getBookingsByRooms(roomIds, startDate, endDate);

        float totalFee = 0;
        Map<Integer, Float> feesInMonth = new HashMap<>();
        Map<Integer, Integer> numberOfBookingsInMonth = new HashMap<>();
        List<BookingDTO> bookingsDTO = new ArrayList<>();
        for (Booking b : bookings) {
            BookingDTO bookingDTO = BookingDTO.builder()
                    .id(b.getId())
                    .bookingDate(b.getBookingDate())
                    .currencySymbol(b.getRoom().getCurrency().getSymbol())
                    .totalFee(b.getRoom().getPrice() * b.getNumberOfDays() + b.getSiteFee() + b.getCleanFee())
                    .lastUpdated(b.getLastUpdated())
                    .build();
            bookingsDTO.add(bookingDTO);
            if (b.getRoom().getCurrency().getSymbol().equals("$"))
                totalFee += b.getTotalFee() * 22705;
            else
                totalFee += b.getTotalFee();

            Integer monthValue = b.getBookingDate().getMonthValue();

            if (feesInMonth.containsKey(monthValue))
                feesInMonth.put(
                        monthValue,
                        b.getTotalFee() + feesInMonth.get(monthValue));
            else
                feesInMonth.put(monthValue, b.getTotalFee());

            if (numberOfBookingsInMonth.containsKey(monthValue))
                numberOfBookingsInMonth.put(
                        monthValue,
                        1 + numberOfBookingsInMonth.get(monthValue));
            else
                numberOfBookingsInMonth.put(monthValue, 1);
        }

        feesInMonth.entrySet().stream().sorted(Map.Entry.comparingByKey());
        numberOfBookingsInMonth.entrySet().stream().sorted(Map.Entry.comparingByKey());

        ProgressEarningsDTO pro = new ProgressEarningsDTO(bookingsDTO, feesInMonth, numberOfBookingsInMonth, totalFee);

        return pro;
    }

    @GetMapping(value = "reviews")
    public ProgressReviewsDTO reviews(@CookieValue("user") String cookie,
            @RequestParam(name = "numberOfStars", required = false, defaultValue = "0") String numberOfStars) {

        User host = authenticate.getLoggedInUser(cookie);
        List<Room> rooms = roomService.getRoomsByHostId(host);
        Integer[] roomIds = new Integer[rooms.size()];

        for (int i = 0; i < rooms.size(); i++) {
            roomIds[i] = rooms.get(i).getId();
        }

        List<Booking> bookings = bookingService.getBookingsByRooms(roomIds);
        Integer[] bookingIds = new Integer[bookings.size()];
        for (int i = 0; i < bookings.size(); i++)
            bookingIds[i] = bookings.get(i).getId();

        float finalRatings = 0;
        List<Review> reviews = reviewService.getReviewsByBookings(bookingIds, Float.parseFloat(numberOfStars));

        if (reviews.size() == 0)
            finalRatings = 0;
        else {
            for (Review r : reviews)
                finalRatings += r.getFinalRating();

            finalRatings = finalRatings / reviews.size();
        }
        List<ReviewDTO> reviewsDTO = new ArrayList<>();
        for (Review review : reviews) {
            ReviewDTO reviewDTO = ReviewDTO.builder()
                    .id(review.getId())
                    .comment(review.getComment())
                    .createdAt(review.getCreatedDate())
                    .customerAvatar(review.getBooking().getCustomer().getAvatarPath())
                    .customerName(review.getBooking().getCustomer().getFullName())
                    .rating(review.getSubRating())
                    .build();

            reviewsDTO.add(reviewDTO);
        }

        ProgressReviewsDTO ProgressReviewsDTO = new ProgressReviewsDTO(reviewsDTO, finalRatings);

        return ProgressReviewsDTO;
    }

}
