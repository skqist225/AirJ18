package com.airtnt.airtntapp.hosting;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.airtnt.airtntapp.amentity.AmentityService;
import com.airtnt.airtntapp.exception.UserNotFoundException;
import com.airtnt.airtntapp.room.RoomService;
import com.airtnt.airtntapp.user.UserService;
import com.airtnt.entity.Amentity;
import com.airtnt.entity.Room;
import com.airtnt.entity.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
@RequestMapping("/hosting")
public class HostingController {

    @Autowired
    private UserService userService;

    @Autowired
    private AmentityService amentityService;

    @Autowired
    private RoomService roomService;

    @GetMapping(value = "")
    public String index(Model model) {
        model.addAttribute("excludeBecomeHostAndNavigationHeader", true);
        return new String("hosting/index");
    }

    @GetMapping(value = "listings/{pageNumber}")
    public String listings(@AuthenticationPrincipal UserDetails userDetails,
            @PathVariable("pageNumber") Integer pageNumber,
            @RequestParam(name = "BATHROOMS", required = false, defaultValue = "0") String bathRoomsCount,
            @RequestParam(name = "BEDROOMS", required = false, defaultValue = "0") String bedRoomsCount,
            @RequestParam(name = "BEDS", required = false, defaultValue = "0") String bedsCount,
            @RequestParam(name = "query", required = false, defaultValue = "") String query,
            @RequestParam(name = "sort_dir", required = false, defaultValue = "asc") String sortDir,
            @RequestParam(name = "sort_field", required = false, defaultValue = "id") String sortField,
            @RequestParam(name = "AMENITY_IDS", required = false, defaultValue = "") String amentitiesFilter,
            @RequestParam(name = "STATUSES", required = false, defaultValue = "ACTIVE UNLISTED") String status,
            @AuthenticationPrincipal Model model) throws UserNotFoundException {

        /*-------------------HOST------------------ */
        String userName = userDetails.getUsername();
        User user = userService.findByEmail(userName);

        model.addAttribute("userName", user.getFullName());
        model.addAttribute("userEmail", user.getEmail());
        model.addAttribute("userAvatar", user.getAvatarPath());
        /*-------------------HOST------------------ */

        /*--------------------------------------------------------FILTER---------------------------------------------------------- */
        Map<String, String> filters = new HashMap<>();
        filters.put("bedroomCount", bedRoomsCount);
        filters.put("bathroomCount", bathRoomsCount);
        filters.put("bedCount", bedsCount);
        filters.put("query", query);
        filters.put("sortDir", sortDir);
        filters.put("sortField", sortField);
        filters.put("amentities", amentitiesFilter);
        filters.put("status", status);

        Page<Room> rooms = roomService.getRoomsByHost(user, pageNumber, filters);
        model.addAttribute("roomsLength", rooms.getTotalElements());
        model.addAttribute("rooms", rooms);

        if (!user.isPhoneVerified())
            return "redirect:/verify-listing/" + rooms.getContent().get(0).getId();
        /*--------------------------------------------------------FILTER---------------------------------------------------------- */

        /*-----------------------------AMENTITIES------------------------------- */
        List<Amentity> amentities = amentityService.getAllAmentities();
        model.addAttribute("amentities", amentities);

        model.addAttribute("includeMiddle", true);
        model.addAttribute("excludeBecomeHostAndNavigationHeader", true);
        return new String("hosting/listings");
        /*-----------------------------AMENTITIES------------------------------- */
    }

}
