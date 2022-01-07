package com.airtnt.airtntapp.user;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

import com.airtnt.airtntapp.user.dto.PostAddUserDTO;
import com.airtnt.airtntapp.user.dto.PostLoginUserDTO;
import com.airtnt.airtntapp.user.response.UserResponseEntity;
import com.airtnt.entity.Sex;
import com.airtnt.entity.User;

import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class UserORestController {

        public final String ADD_USER_SUCCESS = "ADD_USER_SUCCESSFULLY";
        public final String ADD_USER_FAILURE = "ADD_USER_FAILURE";
        public final String LOGIN_SUCCESS = "LOGIN_SUCCESSFULLY";

        @Autowired
        private UserService userService;

        @PostMapping("/user/add")
        public ResponseEntity<UserResponseEntity> addUser(@RequestBody PostAddUserDTO postUser,
                        HttpServletResponse res) {
                UserResponseEntity userResponseEntity = new UserResponseEntity();
                // check email exist
                boolean isDuplicatedEmail = userService.isEmailUnique(null, postUser.getEmail());
                if (!isDuplicatedEmail) {
                        userResponseEntity.setErrorMessage("Duplicate entry email");

                        return new ResponseEntity<UserResponseEntity>(
                                        userResponseEntity,
                                        null, HttpStatus.SC_BAD_REQUEST);
                }

                // create new user
                User user = User.builder().firstName(postUser.getFirstName()).lastName(postUser.getLastName())
                                .email(postUser.getEmail())
                                .password(postUser.getPassword())
                                .sex(postUser.getSex().equals("MALE") ? Sex.MALE
                                                : (postUser.getSex()
                                                                .equals("FEMALE") ? Sex.FEMALE : Sex.OTHER))
                                .birthday(postUser.getBirthday())
                                .phoneNumber(postUser.getPhoneNumber())
                                .build();
                User savedUser = userService.save(user);

                // response object
                userResponseEntity.setSuccessMessage(ADD_USER_SUCCESS);
                userResponseEntity.setUser(savedUser);

                return new ResponseEntity<UserResponseEntity>(
                                userResponseEntity,
                                null, HttpStatus.SC_CREATED);
        }

        @PostMapping("/user/login")
        public ResponseEntity<UserResponseEntity> login(@RequestBody PostLoginUserDTO postUser,
                        HttpServletResponse res) {
                UserResponseEntity userResponseEntity = new UserResponseEntity();

                User user = userService.getByEmail(postUser.getEmail());

                if (user == null) {
                        userResponseEntity.setErrorMessage("Email does not exist");

                        return new ResponseEntity<UserResponseEntity>(
                                        userResponseEntity,
                                        null, HttpStatus.SC_BAD_REQUEST);
                }
                if (!userService.isPasswordMatch(postUser.getPassword(), user.getPassword())) {
                        userResponseEntity.setErrorMessage("Password does not match");

                        return new ResponseEntity<UserResponseEntity>(
                                        userResponseEntity,
                                        null, HttpStatus.SC_BAD_REQUEST);
                }
                Cookie cookie = new Cookie("user", user.getEmail());
                cookie.setMaxAge(1000 * 60 * 60 * 24 * 14);
                cookie.setHttpOnly(true);
                cookie.setSecure(false);
                res.addCookie(cookie);

                userResponseEntity.setSuccessMessage(LOGIN_SUCCESS);
                userResponseEntity.setUser(user);

                return new ResponseEntity<UserResponseEntity>(
                                userResponseEntity,
                                headers, HttpStatus.SC_OK);
        }
}
