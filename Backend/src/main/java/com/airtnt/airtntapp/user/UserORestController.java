package com.airtnt.airtntapp.user;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import com.airtnt.airtntapp.FileUploadUtil;
import com.airtnt.airtntapp.booking.BookingService;
import com.airtnt.airtntapp.city.CityService;
import com.airtnt.airtntapp.cookie.CookieProcess;
import com.airtnt.airtntapp.country.CountryService;
import com.airtnt.airtntapp.state.StateService;
import com.airtnt.airtntapp.user.dto.BookedRoomDTO;
import com.airtnt.airtntapp.user.dto.PostAddUserDTO;
import com.airtnt.airtntapp.user.dto.PostLoginUserDTO;
import com.airtnt.airtntapp.user.dto.PostUpdateUserDTO;
import com.airtnt.airtntapp.user.dto.WishlistsDTO;
import com.airtnt.airtntapp.user.response.UserBookedRoomsResponseEntity;
import com.airtnt.airtntapp.user.response.UserResponseEntity;
import com.airtnt.entity.Address;
import com.airtnt.entity.Booking;
import com.airtnt.entity.City;
import com.airtnt.entity.Country;
import com.airtnt.entity.Image;
import com.airtnt.entity.Room;
import com.airtnt.entity.Sex;
import com.airtnt.entity.State;
import com.airtnt.entity.User;

import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;

@RestController
@RequestMapping("/api/user")
public class UserORestController {

        public final String ADD_USER_SUCCESS = "ADD_USER_SUCCESSFULLY";
        public final String ADD_USER_FAILURE = "ADD_USER_FAILURE";

        public final String LOGIN_SUCCESS = "LOGIN_SUCCESSFULLY";
        public final String LOGOUT_SUCCESS = "LOGOUT_SUCCESSFULLY";

        public final String UPDATE_USER_SUCCESS = "UPDATE_USER_SUCCESSFULLY";
        public final String UPDATE_USER_FAILURE = "UPDATE_USER_FAILURE";

        @Autowired
        private UserService userService;

        @Autowired
        private BookingService bookingService;

        @Autowired
        private CookieProcess cookiePorcess;

        @Autowired
        private CountryService countryService;

        @Autowired
        private StateService stateService;

        @Autowired
        private CityService cityService;

        @PostMapping("/add")
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

        @PostMapping("/login")
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

                userResponseEntity.setErrorMessage(null);
                userResponseEntity.setSuccessMessage(LOGIN_SUCCESS);
                userResponseEntity.setUser(user);

                return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE,
                                cookiePorcess.writeCookie("user", user.getEmail())).body(userResponseEntity);
        }

        @GetMapping("/logout")
        public ResponseEntity<UserResponseEntity> logout() {
                UserResponseEntity userResponseEntity = new UserResponseEntity();

                userResponseEntity.setErrorMessage(null);
                userResponseEntity.setSuccessMessage(LOGOUT_SUCCESS);
                userResponseEntity.setUser(null);

                return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE,
                                cookiePorcess.writeCookie("user", null).toString()).body(userResponseEntity);
        }

        @GetMapping("/wishlists/ids")
        public Integer[] fetchWishlistsIds(@CookieValue("user") String cookie) {
                String userEmail = cookiePorcess.readCookie(cookie);

                User user = userService.getByEmail(userEmail);
                Integer[] wishlists = new Integer[user.getFavRooms().size()];
                int i = 0;
                for (Room r : user.getFavRooms())
                        wishlists[i++] = r.getId();

                return wishlists;
        }

        @GetMapping("/wishlists")
        public WishlistsDTO[] fetchWishlists(@CookieValue("user") String cookie) {
                String userEmail = cookiePorcess.readCookie(cookie);

                User user = userService.getByEmail(userEmail);
                WishlistsDTO[] wishlists = new WishlistsDTO[user.getFavRooms().size()];
                int i = 0;

                for (Room r : user.getFavRooms()) {
                        WishlistsDTO wlDTO = new WishlistsDTO();
                        wlDTO.setId(r.getId());
                        String[] images = new String[3];
                        int j = 0;
                        for (Image image : r.getImages()) {
                                if (j == 3)
                                        break;
                                images[j++] = image.getImagePath(userEmail, r.getId());
                        }
                        wlDTO.setImages(images);
                        wishlists[i++] = wlDTO;
                }
                return wishlists;
        }

        @PostMapping("update-personal-info")
        public ResponseEntity<UserResponseEntity> updatePersonalInfo(@CookieValue("user") String cookie,
                        @RequestBody PostUpdateUserDTO postUpdateUserDTO, MultipartFile userAvatar)
                        throws IOException {
                String userEmail = cookiePorcess.readCookie(cookie);
                User currentUser = userService.getByEmail(userEmail);
                User savedUser = null;
                String updatedField = postUpdateUserDTO.getUpdatedField();
                Map<String, String> updateData = postUpdateUserDTO.getUpdateData();
                UserResponseEntity userResponseEntity = new UserResponseEntity();

                switch (updatedField) {
                        case "firstNameAndLastName": {
                                String newFirstName = updateData.get("firstName");
                                String newLastName = updateData.get("lastName");

                                currentUser.setFirstName(newFirstName);
                                currentUser.setLastName(newLastName);
                                savedUser = userService.saveUser(currentUser);
                                break;
                        }
                        case "sex": {
                                String newSex = updateData.get("sex");
                                Sex sex = newSex.equals("MALE") ? Sex.MALE
                                                : newSex.equals("FEMALE") ? Sex.FEMALE : Sex.OTHER;
                                currentUser.setSex(sex);
                                savedUser = userService.saveUser(currentUser);
                                break;
                        }
                        case "birthday": {
                                Integer yearOfBirth = Integer.parseInt(updateData.get("yearOfBirth"));
                                Integer monthOfBirth = Integer.parseInt(updateData.get("monthOfBirth"));
                                Integer dayOfBirth = Integer.parseInt(updateData.get("dayOfBirth"));

                                currentUser.setBirthday(LocalDate.of(
                                                yearOfBirth,
                                                monthOfBirth,
                                                dayOfBirth));
                                savedUser = userService.saveUser(currentUser);
                                break;
                        }
                        case "address": {
                                Integer countryId = Integer.parseInt(updateData.get("country"));
                                Integer stateId = Integer.parseInt(updateData.get("country"));
                                Integer cityId = Integer.parseInt(updateData.get("country"));
                                String aprtNoAndStreet = updateData.get("aprtNoAndStreet");

                                Country country = countryService.getCountryById(countryId);
                                State state = stateService.getStateById(stateId);
                                City city = cityService.getCityById(cityId);

                                Address newAddress = new Address(country, state, city, aprtNoAndStreet);
                                currentUser.setAddress(newAddress);
                                savedUser = userService.saveUser(currentUser);
                                break;
                        }
                        case "email": {
                                String newEmail = updateData.get("email");
                                currentUser.setEmail(newEmail);
                                savedUser = userService.saveUser(currentUser);

                                userResponseEntity.setErrorMessage(null);
                                userResponseEntity.setSuccessMessage(UPDATE_USER_SUCCESS);
                                userResponseEntity.setUser(savedUser);

                                return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE,
                                                cookiePorcess.writeCookie("user", savedUser.getEmail()).toString())
                                                .body(userResponseEntity);
                        }
                        case "password": {
                                String newPassword = updateData.get("newPassword");

                                currentUser.setPassword(newPassword);
                                userService.encodePassword(currentUser);
                                savedUser = userService.saveUser(currentUser);
                                break;
                        }
                        case "phoneNumber": {
                                String newPhoneNumber = updateData.get("phoneNumber");

                                currentUser.setPhoneNumber(newPhoneNumber);
                                savedUser = userService.saveUser(currentUser);
                                break;
                        }
                        case "avatar": {
                                if (userAvatar != null) {
                                        String fileName = StringUtils.cleanPath(userAvatar.getOriginalFilename());
                                        currentUser.setAvatar(fileName);
                                        savedUser = userService.saveUser(currentUser);
                                        String uploadDir = "../user_images/" + savedUser.getId();
                                        FileUploadUtil.cleanDir(uploadDir);
                                        FileUploadUtil.saveFile(uploadDir, fileName, userAvatar);
                                }
                                break;
                        }
                }

                userResponseEntity.setErrorMessage(null);
                userResponseEntity.setSuccessMessage(UPDATE_USER_SUCCESS);
                userResponseEntity.setUser(savedUser);

                return new ResponseEntity<UserResponseEntity>(userResponseEntity, null, HttpStatus.SC_OK);
        }

        @GetMapping(value = "bookedRooms")
        public ResponseEntity<UserBookedRoomsResponseEntity> getUserBookedRooms(
                        @CookieValue("user") String cookie,
                        @RequestParam(value = "query", required = false, defaultValue = "") String query) {
                String userEmail = cookiePorcess.readCookie(cookie);
                User user = userService.getByEmail(userEmail);

                System.out.println(query);

                List<BookedRoomDTO> bookings = bookingService.getBookedRoomsByUser(user.getId(), query);

                UserBookedRoomsResponseEntity userBookedRoomsResponseEntity = new UserBookedRoomsResponseEntity();
                userBookedRoomsResponseEntity.setBookedRooms(bookings);

                Integer[] starLoop = new Integer[] { 1, 2, 3, 4, 5 };
                String[] ratingLabel = new String[] { "Mức độ sạch sẽ", "Độ chính xác", "Liên lạc", "Vị trí",
                                "Nhận phòng",
                                "Giá trị" };
                List<RatingDTO> ratings = new ArrayList<>();
                for (int i = 0; i < ratingLabel.length; i++) {
                        ratings.add(new RatingDTO(ratingLabel[i], starLoop));
                }

                userBookedRoomsResponseEntity.setRatingLabels(ratings);

                return new ResponseEntity<UserBookedRoomsResponseEntity>(userBookedRoomsResponseEntity, null,
                                HttpStatus.SC_OK);
        }
}
