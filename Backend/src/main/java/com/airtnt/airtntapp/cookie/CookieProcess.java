package com.airtnt.airtntapp.cookie;

import java.util.Base64;

import org.springframework.http.HttpCookie;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Component
public class CookieProcess {
	public String writeCookie(String cookieName, String cookieValue) {
		Base64.Encoder encoder = Base64.getMimeEncoder();

		String hashedCookie = cookieValue != null ? encoder.encodeToString(cookieValue.getBytes()) : null;
		int maxAge = cookieValue != null ? 1000 * 60 * 60 * 24 * 14 : 0;
		HttpCookie cookie = ResponseCookie.from(cookieName, hashedCookie).path("/").maxAge(maxAge).httpOnly(true)
				.secure(false).build();
		return cookie.toString();
	}

	public String readCookie(String hashedCookie) {
		Base64.Decoder decoder = Base64.getMimeDecoder();
		return new String(decoder.decode(hashedCookie));
	}
}
