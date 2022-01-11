package com.airtnt.airtntapp.cookie;

import java.util.Base64;

import org.springframework.http.HttpCookie;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Component
public class CookiePorcess {
    public String writeCookie(String cookieName, String rawCookieValue) {
        String hashedCookie = rawCookieValue != null ? Base64.getEncoder().encodeToString(rawCookieValue.getBytes())
                : null;
        int maxAge = rawCookieValue != null ? 1000 * 60 * 60 * 24 * 14 : 0;
        HttpCookie cookie = ResponseCookie.from(cookieName,
                hashedCookie)
                .path("/")
                .maxAge(maxAge)
                .httpOnly(true)
                .secure(false)
                .build();
        return cookie.toString();
    }

    public String readCookie(String rawCookieValue) {
        return new String(Base64.getDecoder().decode(rawCookieValue));
    }
}
