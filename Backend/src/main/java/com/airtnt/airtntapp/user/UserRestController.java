package com.airtnt.airtntapp.user;

import java.util.HashMap;
import java.util.Map;

import com.airtnt.airtntapp.exception.UserNotFoundException;
import com.airtnt.airtntapp.room.RoomService;
import com.airtnt.airtntapp.security.UserDetailsImpl;
import com.airtnt.entity.Room;
import com.airtnt.entity.User;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user/")
public class UserRestController {

    @Autowired
    private RoomService roomService;

    @Autowired
    private UserService userService;

    private Map<String, String> checkConstraint = new HashMap<>();

    @PostMapping("check-password-constraint")
    public String checkPasswordConstaint(@RequestBody Map<String, String> payLoad,
            @AuthenticationPrincipal UserDetailsImpl userDetails) throws UserNotFoundException {
        Integer userId = Integer.parseInt(payLoad.get("userId").toString());
        User currentUser = userService.findById(userId);
        String oldPassword = payLoad.get("oldPassword").toString();
        String newPassword = payLoad.get("newPassword").toString();

        checkConstraint.put("oldPasswordError", "Vui lòng nhập mật khẩu cũ.");
        checkConstraint.put("newPasswordError", "Vui lòng nhập mật khẩu mới.");

        JSONObject jsonObject = new JSONObject();

        if (oldPassword.isEmpty() && newPassword.isEmpty()) {
            jsonObject.put("oldPasswordError", checkConstraint.get("oldPasswordError")).put("newPasswordError",
                    checkConstraint.get("newPasswordError"));

            return jsonObject.toString();
        }
        if (oldPassword.isEmpty()) {
            jsonObject.put("oldPasswordError", checkConstraint.get("oldPasswordError"));
            return jsonObject.toString();
        }
        if (newPassword.isEmpty()) {
            jsonObject.put("newPasswordError", checkConstraint.get("newPasswordError"));
            return jsonObject.toString();
        }

        if (!userService.isPasswordMatch(oldPassword, currentUser.getPassword())) {
            jsonObject.put("oldPasswordError", "Mật khẩu cũ không hợp lệ!!!");
            return jsonObject.toString();
        }

        if (newPassword.length() < 8) {
            jsonObject.put("newPasswordError", "Mật khẩu mới phải ít nhất 8 kí tự.");
            return jsonObject.toString();
        }

        return jsonObject.put("status", "OK").toString();
    }

    @PostMapping("check-first-name-and-last-name-constraint")
    public String checkFirstNameAndLastNameConstraint(@RequestBody Map<String, String> payLoad) {

        String firstName = payLoad.get("firstName").toString();
        String lastName = payLoad.get("lastName").toString();

        JSONObject jsonObject = new JSONObject();

        checkConstraint.put("firstNameError", "Vui lòng nhập tên.");
        checkConstraint.put("lastNameError", "Vui lòng nhập họ.");

        if (firstName.isEmpty() && lastName.isEmpty()) {
            jsonObject.put("firstNameError", checkConstraint.get("firstNameError")).put("lastNameError",
                    checkConstraint.get("lastNameError"));

            return jsonObject.toString();
        }
        if (firstName.isEmpty()) {
            jsonObject.put("firstNameError", checkConstraint.get("firstNameError"));
            return jsonObject.toString();
        }
        if (lastName.isEmpty()) {
            jsonObject.put("lastNameError", checkConstraint.get("lastNameError"));
            return jsonObject.toString();
        }

        return jsonObject.put("status", "OK").toString();
    }

    @PostMapping("check-email-constraint")
    public String checkEmailConstraint(@RequestBody Map<String, String> payLoad,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        String email = payLoad.get("email").toString();
        Integer userId = Integer.parseInt(payLoad.get("userId").toString());

        return userService.isEmailUnique(userId, email) ? "OK" : "Duplicated";
    }

    @GetMapping("add-to-wishlists/{roomId}")
    public String addToWishLists(@AuthenticationPrincipal UserDetails userDetails,
            @PathVariable("roomId") Integer roomId) throws UserNotFoundException {
        Room room = roomService.getRoomById(roomId);
        User user = userService.findByEmail(userDetails.getUsername());

        user.addToWishLists(room);
        User savedUser = userService.saveUser(user);

        if (savedUser != null)
            return "success";
        return "failure";
    }

    @GetMapping("remove-from-wishlists/{roomId}")
    public String removeFromWishLists(@AuthenticationPrincipal UserDetails userDetails,
            @PathVariable("roomId") Integer roomId) throws UserNotFoundException {
        Room room = roomService.getRoomById(roomId);
        User user = userService.findByEmail(userDetails.getUsername());

        user.removeFromWishLists(room);
        User savedUser = userService.saveUser(user);

        if (savedUser != null)
            return "success";
        return "failure";
    }

}
