package com.airtnt.airtntapp.room;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;

import com.airtnt.entity.Image;
import com.airtnt.entity.User;
import com.airtnt.airtntapp.booking.BookedDateDTO;
import com.airtnt.airtntapp.booking.BookingService;
import com.airtnt.airtntapp.exception.RoomNotFoundException;
import com.airtnt.airtntapp.exception.UserNotFoundException;
import com.airtnt.airtntapp.review.ReviewService;
import com.airtnt.airtntapp.user.UserService;
import com.airtnt.entity.Booking;
import com.airtnt.entity.Review;
import com.airtnt.entity.Room;

@Controller
public class RoomController {

	@Autowired
	private RoomService roomService;

	@Autowired
	private BookingService bookingService;

	@Autowired
	private UserService userService;

	@Autowired
	private ReviewService reviewService;

	@GetMapping("/room/{roomId}")
	public String getRoomById(@PathVariable("roomId") Integer roomId, @AuthenticationPrincipal UserDetails userDetails,
			Model model) throws ParseException, UserNotFoundException {
		Room room = roomService.getRoomById(roomId);

		User user = null;
		if (userDetails != null) {
			user = userService.findByEmail(userDetails.getUsername());
			List<Room> favRooms = new ArrayList<>(user.getFavRooms());

			if (favRooms.contains(room)) {
				model.addAttribute("wishlists", favRooms.get(favRooms.indexOf(room)).getId());
			}
		}

		List<BookedDateDTO> bookedDates = bookingService.getBookedDates(room);
		List<Image> images = new ArrayList<>(room.getImages());
		List<Image> secondToFive = new ArrayList<>();
		for (int i = 0; i < images.size(); i++) {
			if (secondToFive.size() == 4)
				break;
			if (images.get(i).getImage().equals(room.getThumbnail()))
				continue;
			else
				secondToFive.add(images.get(i));
		}

		List<Booking> bookings = bookingService.getBookingsByRoom(room);
		Integer[] bookingIds = new Integer[bookings.size()];
		for (int i = 0; i < bookings.size(); i++)
			bookingIds[i] = bookings.get(i).getId();

		List<Review> reviews = reviewService.getReviewsByBookings(bookingIds);

		List<Integer> bedCount = new ArrayList<>();
		for (int i = 0; i < room.getBedCount(); i++) {
			bedCount.add(1);
		}

		float avgRatings = 0;

		for (Review r : reviews) {
			avgRatings += r.getFinalRating();
		}

		if (reviews.size() > 0)
			avgRatings /= reviews.size();

		// checking thumbnail here
		model.addAttribute("thumbnail", room.renderThumbnailImage());
		model.addAttribute("numberOfBed", bedCount);
		model.addAttribute("roomImages", secondToFive);
		model.addAttribute("room", room);
		model.addAttribute("bookedDates", bookedDates);
		model.addAttribute("avgRatings", avgRatings);
		model.addAttribute("reviews", reviews);
		model.addAttribute("numberOfReviews", reviews.size());
		if (user == null)
			model.addAttribute("user", null);
		else
			model.addAttribute("user", user.getFullName());
		return "room/room_details";
	}

	@GetMapping("/room/{roomId}/images")
	public String getRoomImages(@PathVariable("roomId") Integer roomId, Model model) throws RoomNotFoundException {
		Room room = roomService.getById(roomId);
		model.addAttribute("room", room);
		model.addAttribute("excludeBecomeHostAndNavigationHeader", true);
		return "room/images";
	}

	@GetMapping(value = "room/{roomId}/publish-celebration")
	public String publishCelebration(@AuthenticationPrincipal UserDetails userDetails,
			@PathVariable("roomId") Integer roomId, Model model) throws UserNotFoundException {
		User user = userService.findByEmail(userDetails.getUsername());
		model.addAttribute("userName", user.getFullName());
		model.addAttribute("roomId", roomId);

		return "become_host/publish_celebration";
	}

	@GetMapping(value = "room/{roomId}/delete")
	public String deleteRoom(@PathVariable("roomId") Integer roomId, Model model) {
		roomService.deleteRoom(roomId);
		model.addAttribute("deleteMessage", "Xóa thành công");

		return "redirect:/hosting/listings/1";
	}

	@GetMapping(value = "wishlists")
	public String wishlists(@AuthenticationPrincipal UserDetails userDetails, Model model)
			throws UserNotFoundException {
		User user = userService.findByEmail(userDetails.getUsername());
		model.addAttribute("wishlists", user.getFavRooms());
		return new String("room/wishlists");
	}

}
