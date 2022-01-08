package com.airtnt.airtntapp.user;

import javax.servlet.http.HttpServletResponse;

import com.airtnt.airtntapp.user.dto.PostAddUserDTO;
import com.airtnt.airtntapp.user.dto.PostLoginUserDTO;
import com.airtnt.airtntapp.user.response.UserResponseEntity;
import com.airtnt.entity.Sex;
import com.airtnt.entity.User;

import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpCookie;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
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
        public final String LOGOUT_SUCCESS = "LOGOUT_SUCCESSFULLY";

        @Autowired
        private UserService userService;

        @Autowired
        private BCryptPasswordEncoder encoder;

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

                HttpCookie cookie = ResponseCookie.from("user", encoder.encode(user
                                .getEmail()))
                                .path("/")
                                .maxAge(1000 * 60 * 60 * 24 * 14)
                                .httpOnly(true)
                                .secure(false)
                                .build();

                userResponseEntity.setErrorMessage(null);
                userResponseEntity.setSuccessMessage(LOGIN_SUCCESS);
                userResponseEntity.setUser(user);

                return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()).body(userResponseEntity);
        }

        @GetMapping("/user/logout")
        public ResponseEntity<UserResponseEntity> logout() {
                UserResponseEntity userResponseEntity = new UserResponseEntity();
                HttpCookie cookie = ResponseCookie.from("user", null)
                                .path("/")
                                .maxAge(0)
                                .httpOnly(true)
                                .secure(false)
                                .build();

                userResponseEntity.setErrorMessage(null);
                userResponseEntity.setSuccessMessage(LOGOUT_SUCCESS);
                userResponseEntity.setUser(null);

                return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()).body(userResponseEntity);
        }
}
