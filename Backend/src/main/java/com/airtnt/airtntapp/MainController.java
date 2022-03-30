package com.airtnt.airtntapp;

import java.text.ParseException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.airtnt.airtntapp.amentity.AmentityService;
import com.airtnt.airtntapp.category.CategoryService;
import com.airtnt.airtntapp.exception.UserNotFoundException;
import com.airtnt.airtntapp.room.RoomService;
import com.airtnt.airtntapp.room.privacy.RoomPrivacyService;
import com.airtnt.airtntapp.user.UserService;
import com.airtnt.entity.Amentity;
import com.airtnt.entity.Category;
import com.airtnt.entity.Room;
import com.airtnt.entity.RoomPrivacy;
import com.airtnt.entity.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

@Controller
public class MainController {
    @Autowired
    private CategoryService categoryService;

    @Autowired
    private RoomService roomService;

    @Autowired
    private UserService userService;

    @Autowired
    private RoomPrivacyService roomPrivacyService;

    @Autowired
    private AmentityService amentityService;

    @GetMapping("/")
    public String index(@Param("categoryId") Integer categoryId,
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(value = "privacies", required = false, defaultValue = "") String privacies,
            @RequestParam(value = "minPrice", required = false, defaultValue = "0") String minPrice,
            @RequestParam(value = "maxPrice", required = false, defaultValue = "1000000000") String maxPrice,
            @RequestParam(value = "bedRoom", required = false, defaultValue = "0") String bedRoom,
            @RequestParam(value = "bed", required = false, defaultValue = "0") String bed,
            @RequestParam(value = "bathRoom", required = false, defaultValue = "0") String bathRoom,
            @RequestParam(value = "amenities", required = false, defaultValue = "") String amenities,
            @RequestParam(value = "bookingDates", required = false, defaultValue = "") String bookingDates,
            Model model) throws ParseException, UserNotFoundException {
        if (categoryId == null) {
            return "redirect:/?categoryId=1";
        }
        Map<String, String> filters = new HashMap<>();
        filters.put("privacies", privacies);
        filters.put("minPrice", minPrice);
        filters.put("maxPrice", maxPrice);
        filters.put("bedRoom", bedRoom);
        filters.put("bed", bed);
        filters.put("bathRoom", bathRoom);
        filters.put("amenities", amenities);
        filters.put("bookingDates", bookingDates);

        // Category
        List<Category> categories = categoryService.getAllCategory();
        model.addAttribute("categories", categories);

        // User's favorite room ids
        User user = null;
        if (userDetails != null) {
            user = userService.findByEmail(userDetails.getUsername());
            if (user.hasRole("Admin"))
                return "redirect:/admin/";
            Integer[] roomIds = new Integer[user.getFavRooms().size()];
            int i = 0;
            for (Room r : user.getFavRooms())
                roomIds[i++] = r.getId();
            model.addAttribute("wishlists", roomIds);
        }

        Page<Room> rooms = roomService.getRoomsByCategoryId(categoryId, true, 1, filters);
        model.addAttribute("rooms", rooms);
        if (user == null)
            model.addAttribute("user", null);
        else
            model.addAttribute("user", user.getFullName());

        float averageRoomPrice = 0;
        if (rooms.getSize() > 0) {
            for (Room room : rooms) {
                averageRoomPrice += room.getPrice();
            }
            averageRoomPrice /= rooms.getSize();
            model.addAttribute("averageRoomPrice", averageRoomPrice);
        } else
            model.addAttribute("averageRoomPrice", 0);

        List<Amentity> amentities = amentityService.getAllAmentities();
        model.addAttribute("amentities", amentities);

        List<RoomPrivacy> roomPrivacies = roomPrivacyService.listAll();
        model.addAttribute("roomPrivacies", roomPrivacies);

        return "index";
    }

    @GetMapping("/login")
    public String viewLoginPage() throws UserNotFoundException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication instanceof AnonymousAuthenticationToken) {
            return "login";
        }

        return "redirect:/";
    }
}
