package com.airtnt.airtntapp.middleware;

import com.airtnt.airtntapp.cookie.CookieProcess;
import com.airtnt.airtntapp.exception.NotAuthenticatedException;
import com.airtnt.airtntapp.exception.NullCookieException;
import com.airtnt.airtntapp.exception.UserNotFoundException;
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

    public User getLoggedInUser(String cookie) throws NullCookieException, NotAuthenticatedException {
        if (cookie == null || cookie.isEmpty())
            throw new NullCookieException("Your request requires cookie for validation");

        String userEmail = cookieProcess.readCookie(cookie);
        try {
            return userService.findByEmail(userEmail);
        } catch (UserNotFoundException e) {
            throw new NotAuthenticatedException();
        }
    }
}
