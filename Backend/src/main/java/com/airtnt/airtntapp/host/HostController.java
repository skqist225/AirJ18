package com.airtnt.airtntapp.host;

import java.util.List;

import com.airtnt.airtntapp.amentity.AmentityService;
import com.airtnt.airtntapp.category.CategoryService;
import com.airtnt.airtntapp.country.CountryService;
import com.airtnt.airtntapp.exception.UserNotFoundException;
import com.airtnt.airtntapp.privacy.PrivacyTypeService;
import com.airtnt.airtntapp.room.group.RoomGroupService;
import com.airtnt.airtntapp.user.UserService;
import com.airtnt.entity.Amentity;
import com.airtnt.entity.Category;
import com.airtnt.entity.RoomGroup;
import com.airtnt.entity.RoomPrivacy;
import com.airtnt.entity.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/become-a-host/")
public class HostController {

    @Autowired
    RoomGroupService roomGroupService;

    @Autowired
    CategoryService categoryService;

    @Autowired
    UserService userService;

    @Autowired
    AmentityService amentityService;

    @Autowired
    CountryService countryService;

    @Autowired
    PrivacyTypeService privacyTypeService;

    @GetMapping("")
    public String index() {
        return "become_host/index";
    }

    @GetMapping("property-type-group")
    public String roomGroupSelect(Model model) {
        List<RoomGroup> roomGroups = roomGroupService.getRoomGroups();
        model.addAttribute("roomGroups", roomGroups);
        return "become_host/property_type_group";
    }

    @GetMapping("property-type")
    public String roomTypeSelect(Model model) {
        List<Category> categories = categoryService.listAll();
        model.addAttribute("categories", categories);
        return "become_host/categories";
    }

    @GetMapping("privacy-type")
    public String privaceTypeSelect(Model model) {
        List<RoomPrivacy> privacyTypes = privacyTypeService.getPrivacyType();
        model.addAttribute("privacyTypes", privacyTypes);
        return "become_host/privacy_type";
    }

    @GetMapping("location")
    public String locationSelect(Model model, @AuthenticationPrincipal UserDetails userDetails)
            throws UserNotFoundException {
        String userName = userDetails.getUsername();
        User user = userService.findByEmail(userName);
        model.addAttribute("userAvatar", user.getAvatarPath());
        model.addAttribute("userName", user.getFullName());
        model.addAttribute("countries", countryService.getCountries());
        return "become_host/location";
    }

    @GetMapping("room-info")
    public String roomInfoSelect(Model model, @AuthenticationPrincipal UserDetails userDetails) {
        // String userName = userDetails.getUsername();
        // User user = userService.findByEmail(userName);
        // model.addAttribute("userAvatar", user.getAvatarPath());
        // model.addAttribute("userName", user.getFullName());
        return "become_host/room_info";
    }

    @GetMapping("amenities")
    public String amenitiesSelect(Model model) {
        List<Amentity> prominentAmentities = amentityService.getAmentities("prominent");
        List<Amentity> favoriteAmentities = amentityService.getAmentities("favorite");
        List<Amentity> safeAmentities = amentityService.getAmentities("safe");

        model.addAttribute("prominentAmentities", prominentAmentities);
        model.addAttribute("favoriteAmentities", favoriteAmentities);
        model.addAttribute("safeAmentities", safeAmentities);
        return "become_host/amenities";
    }

    @GetMapping("photos")
    public String roomImagesSelect(Model model, @AuthenticationPrincipal UserDetails userDetails) {
        model.addAttribute("userName", userDetails.getUsername());
        return "become_host/photos";
    }

    @GetMapping("title")
    public String titleSelect(Model model) {
        return "become_host/title";
    }

    @GetMapping("description")
    public String descriptionSelect(Model model) {
        return "become_host/description";
    }

    @GetMapping("price")
    public String priceSelect(Model model) {
        return "become_host/price";
    }

    @GetMapping(value = "preview")
    public String previewRoom(@AuthenticationPrincipal UserDetails userDetails, Model model)
            throws UserNotFoundException {
        String userName = userDetails.getUsername();
        User user = userService.findByEmail(userName);
        model.addAttribute("userAvatar", user.getAvatarPath());
        model.addAttribute("userName", user.getFullName());
        model.addAttribute("host", user.getId());
        return "become_host/preview";
    }

}
