package com.airtnt.airtntapp.user;

import java.util.Map;
import java.util.Properties;
import java.util.Random;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import javax.servlet.http.HttpServletResponse;

import com.airtnt.airtntapp.cookie.CookieProcess;
import com.airtnt.airtntapp.exception.NotAuthenticatedException;
import com.airtnt.airtntapp.exception.NullCookieException;
import com.airtnt.airtntapp.exception.UserNotFoundException;
import com.airtnt.airtntapp.middleware.Authenticate;
import com.airtnt.airtntapp.response.StandardJSONResponse;
import com.airtnt.airtntapp.response.error.BadResponse;
import com.airtnt.airtntapp.response.error.NotAuthenticatedResponse;
import com.airtnt.airtntapp.user.dto.PostLoginUserDTO;
import com.airtnt.entity.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthRestController {
    @Autowired
    private UserService userService;

    @Autowired
    private Authenticate authenticate;

    @Autowired
    private CookieProcess cookiePorcess;

    @PostMapping("login")
    public ResponseEntity<StandardJSONResponse<User>> login(@RequestBody PostLoginUserDTO postUser,
            HttpServletResponse res) {
        try {
            User user = userService.findByEmail(postUser.getEmail());
            if (!userService.isPasswordMatch(postUser.getPassword(), user.getPassword()))
                return new BadResponse<User>("Password does not match").response();

            return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE,
                    cookiePorcess.writeCookie("user", user.getEmail()))
                    .body(new StandardJSONResponse<User>(true, user, null));

        } catch (UserNotFoundException e) {
            return new BadResponse<User>(e.getMessage()).response();
        }
    }

    @GetMapping("logout")
    public ResponseEntity<StandardJSONResponse<String>> logout(
            @CookieValue(value = "user", required = false) String cookie) {
        try {
            authenticate.getLoggedInUser(cookie);

            return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE,
                    cookiePorcess.writeCookie("user", null).toString()).body(
                            new StandardJSONResponse<String>(true, "log out successfully", null));
        } catch (NullCookieException ex) {
            return new BadResponse<String>(ex.getMessage()).response();
        } catch (NotAuthenticatedException ex) {
            return new NotAuthenticatedResponse<String>().response();
        }
    }

    @PostMapping("forgot-password")
    public ResponseEntity<StandardJSONResponse<String>> forgotPassword(@RequestBody Map<String, String> payLoad)
            throws AddressException, MessagingException {
        String email = payLoad.get("email");
        try {
            User user = userService.findByEmail(email);

            Properties properties = new Properties();
            properties.put("mail.smtp.auth", true);
            properties.put("mail.smtp.host", "smtp.gmail.com");
            properties.put("mail.smtp.port", "465");
            properties.put("mail.smtp.ssl.enable", "true");

            Session session = Session.getInstance(properties, new javax.mail.Authenticator() {
                protected PasswordAuthentication getPasswordAuthentication() {
                    return new PasswordAuthentication("thuan.leminhthuan.10.2@gmail.com", "khicalcsugfzfowu");
                }
            });
            session.setDebug(true);
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress("airj18-support"));
            message.setRecipients(
                    Message.RecipientType.TO, InternetAddress.parse(email));
            message.setSubject("Reset your password - AirJ18");
            int code = new Random().nextInt(900000) + 100000;
            String msg = "Hi " + user.getFullName()
                    + "<div>Need to reset your password?</div>"
                    + "<div>Use your secret code!</div>"
                    + "<div style='font-weight: bold; font-size:20px;'>" + code + "</div>"
                    + "<div>Click on the link below and enter the secret code above.</div>"
                    + "<a href='http://localhost:3000/reset-password'>Reset your password</a>"
                    + "<div>If you did not forget your password, you can ignore this email.</div>";

            MimeBodyPart mimeBodyPart = new MimeBodyPart();
            mimeBodyPart.setContent(msg, "text/html; charset=utf-8");

            Multipart multipart = new MimeMultipart();
            multipart.addBodyPart(mimeBodyPart);

            message.setContent(multipart);

            Transport.send(message);

            return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE,
                    cookiePorcess.writeCookie("user", null).toString()).body(
                            new StandardJSONResponse<String>(true, "reset email has been sent to" + user.getEmail(),
                                    null));
        } catch (UserNotFoundException e) {
            return new BadResponse<String>(e.getMessage()).response();
        }
    }
}
