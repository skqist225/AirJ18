package com.airtnt.airtntapp.hosting;

import com.airtnt.airtntapp.exception.UserNotFoundException;
import com.airtnt.airtntapp.room.RoomService;
import com.airtnt.airtntapp.user.UserService;
import com.airtnt.entity.Room;
import com.airtnt.entity.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class VerifyController {

    @Autowired
    UserService userService;

    @Autowired
    RoomService roomService;

    @GetMapping(value = "verify-listing/{roomId}")
    public String verifyListing(@AuthenticationPrincipal UserDetails userDetails,
            @PathVariable("roomId") Integer roomId, Model model) throws UserNotFoundException {
        Room room = roomService.getRoomById(roomId);
        String userName = userDetails.getUsername();
        User user = userService.findByEmail(userDetails.getUsername());

        if (user.isPhoneVerified())
            return "redirect:/hosting/listings/1";

        model.addAttribute("userName", userName);
        model.addAttribute("excludeBecomeHostAndNavigationHeader", true);
        model.addAttribute("thumbnail", room.getThumbnail());
        model.addAttribute("roomId", roomId);
        model.addAttribute("phoneNumberVerified", room.getHost().isPhoneVerified());
        model.addAttribute("room", room);

        return new String("hosting/verify_listing");
    }

    @GetMapping(value = "add-phone-number/{roomId}")
    public String addPhoneNumber(@PathVariable("roomId") Integer roomId, Model model) {
        model.addAttribute("roomId", roomId);
        return new String("hosting/add_phone_number");
    }

}
