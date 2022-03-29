package com.airtnt.airtntapp.user;

import javax.servlet.http.HttpServletResponse;

import com.airtnt.airtntapp.cookie.CookieProcess;
import com.airtnt.airtntapp.response.StandardJSONResponse;
import com.airtnt.airtntapp.response.error.BadResponse;
import com.airtnt.airtntapp.user.dto.PostLoginUserDTO;
import com.airtnt.entity.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/")
public class AuthRestController {
    @Autowired
    private UserService userService;

    @Autowired
    private CookieProcess cookiePorcess;

    @PostMapping("login")
    public ResponseEntity<StandardJSONResponse<User>> login(@RequestBody PostLoginUserDTO postUser,
            HttpServletResponse res) {
        User user = userService.getByEmail(postUser.getEmail());

        if (user == null)
            return new BadResponse<User>("Email does not exist").response();

        if (!userService.isPasswordMatch(postUser.getPassword(), user.getPassword()))
            return new BadResponse<User>("Password does not match").response();

        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE,
                cookiePorcess.writeCookie("user", user.getEmail()))
                .body(new StandardJSONResponse<User>(true, user, null));
    }

    @GetMapping("logout")
    public ResponseEntity<StandardJSONResponse<String>> logout() {
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE,
                cookiePorcess.writeCookie("user", null).toString()).body(
                        new StandardJSONResponse<String>(true, "log out successfully", null));
    }
}
