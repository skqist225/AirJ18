package com.airtnt.airtntapp.middleware;

import com.airtnt.airtntapp.cookie.CookieProcess;
import com.airtnt.airtntapp.user.UserService;
import com.airtnt.entity.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class Authenticate {
    @Autowired
    private UserService userService;

    @Autowired
    private CookieProcess cookieProcess;

    public User getLoggedInUser(String cookie) {
        String userEmail = cookieProcess.readCookie(cookie);
        User user = userService.getByEmail(userEmail);

        return user;
    }
}
