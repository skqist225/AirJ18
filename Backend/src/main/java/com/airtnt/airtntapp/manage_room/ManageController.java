package com.airtnt.airtntapp.manage_room;

import java.util.ArrayList;
import java.util.List;

import com.airtnt.airtntapp.amentity.AmentityService;
import com.airtnt.airtntapp.category.CategoryService;
import com.airtnt.airtntapp.country.CountryService;
import com.airtnt.airtntapp.privacy.PrivacyTypeService;
import com.airtnt.airtntapp.room.RoomService;
import com.airtnt.airtntapp.room.group.RoomGroupService;
import com.airtnt.entity.Amentity;
import com.airtnt.entity.Category;
import com.airtnt.entity.Image;
import com.airtnt.entity.Room;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class ManageController {

    @Autowired
    private RoomService roomService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private CountryService countryService;

    @Autowired
    private RoomGroupService roomGroupService;

    @Autowired
    private PrivacyTypeService privacyTypeService;

    @Autowired
    private AmentityService amentityService;

    @GetMapping(value = "/manage-your-space/{roomId}/details")
    public String getMethodName(@PathVariable("roomId") Integer roomId,
            @AuthenticationPrincipal UserDetails userDetails, Model model) {
        if (userDetails == null) {
            return "redirect:/login";
        }

        Room room = roomService.getRoomById(roomId);
        model.addAttribute("room", room);
        model.addAttribute("firstDescription", room.getDescription().split(",")[0].toLowerCase());
        model.addAttribute("secondDescription", room.getDescription().split(",")[1].toLowerCase());
        model.addAttribute("userName", room.getHost().getEmail());
        model.addAttribute("countries", countryService.getCountries());

        model.addAttribute("roomGroup", roomGroupService.getRoomGroups());
        model.addAttribute("privacyType", privacyTypeService.getPrivacyType());

        List<Amentity> prominentAmentities = amentityService.getAmentities("prominent");
        List<Amentity> favoriteAmentities = amentityService.getAmentities("favorite");
        List<Amentity> safeAmentities = amentityService.getAmentities("safe");

        model.addAttribute("prominentAmentities", prominentAmentities);
        model.addAttribute("favoriteAmentities", favoriteAmentities);
        model.addAttribute("safeAmentities", safeAmentities);

        List<Integer> prominentAmentitiesID = new ArrayList<>();
        List<Integer> favoriteAmentitiesID = new ArrayList<>();
        List<Integer> safeAmentitiesID = new ArrayList<>();

        for (Amentity a : room.getAmentities()) {
            if (a.isProminent())
                prominentAmentitiesID.add(a.getId());
            else if (a.isFavorite())
                favoriteAmentitiesID.add(a.getId());
            else
                safeAmentitiesID.add(a.getId());
        }

        model.addAttribute("prominentAmentitiesID", prominentAmentitiesID);
        model.addAttribute("favoriteAmentitiesID", favoriteAmentitiesID);
        model.addAttribute("safeAmentitiesID", safeAmentitiesID);

        List<Category> categories = categoryService.listAll();
        model.addAttribute("categories", categories);

        return new String("manage_space/manage_your_space");
    }

    @GetMapping(value = "/manage-your-space/{roomId}/details/photos")
    public String managePhotos(@PathVariable("roomId") Integer roomId, @AuthenticationPrincipal UserDetails userDetails,
            Model model) {
        if (userDetails == null) {
            return "redirect:/login";
        }
        Room room = roomService.getRoomById(roomId);
        model.addAttribute("room", room);
        model.addAttribute("thumbnail", room.getThumbnail());
        model.addAttribute("userName", userDetails.getUsername());

        List<String> roomImages = new ArrayList<>();
        for (Image i : room.getImages()) {
            roomImages.add(i.getImage());
        }

        model.addAttribute("roomImages", roomImages);

        return "manage_space/manage_photos";
    }

}
