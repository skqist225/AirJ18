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
import com.airtnt.airtntapp.middleware.Authenticate;
import com.airtnt.airtntapp.response.FailureResponse;
import com.airtnt.airtntapp.response.NotAuthenticatedResponse;
import com.airtnt.airtntapp.response.StandardJSONResponse;
import com.airtnt.airtntapp.response.SuccessResponse;
import com.airtnt.airtntapp.room.RoomService;
import com.airtnt.airtntapp.state.StateService;
import com.airtnt.airtntapp.user.dto.BookedRoomDTO;
import com.airtnt.airtntapp.user.dto.PostRegisterUserDTO;
import com.airtnt.airtntapp.user.dto.PostLoginUserDTO;
import com.airtnt.airtntapp.user.dto.PostUpdateUserDTO;
import com.airtnt.airtntapp.user.dto.WishlistsDTO;
import com.airtnt.airtntapp.user.response.UserBookedRoomsResponseEntity;
import com.airtnt.entity.Address;
import com.airtnt.entity.City;
import com.airtnt.entity.Country;
import com.airtnt.entity.Image;
import com.airtnt.entity.Room;
import com.airtnt.entity.Sex;
import com.airtnt.entity.State;
import com.airtnt.entity.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;

@RestController
@RequestMapping("/api/user/")
public class UserORestController {

        public final String REGISTER_USER_SUCCESS = "REGISTER_USER_SUCCESSFULLY";
        public final String REGISTER_USER_FAILURE = "REGISTER_USER_FAILURE";

        public final String LOGIN_SUCCESS = "LOGIN_SUCCESSFULLY";
        public final String LOGOUT_SUCCESS = "LOGOUT_SUCCESSFULLY";

        public final String UPDATE_USER_SUCCESS = "UPDATE_USER_SUCCESSFULLY";
        public final String UPDATE_USER_FAILURE = "UPDATE_USER_FAILURE";

        public final String STATIC_PATH = "src/main/resources/static/user_images";

        @Autowired
        private UserService userService;

        @Autowired
        private BookingService bookingService;

        @Autowired
        private CookieProcess cookiePorcess;

        @Autowired
        private Authenticate authenticate;

        @Autowired
        private CountryService countryService;

        @Autowired
        private StateService stateService;

        @Autowired
        private CityService cityService;

        @Autowired
        private RoomService roomService;

        @PostMapping("register")
        public ResponseEntity<StandardJSONResponse<User>> registerUser(@RequestBody PostRegisterUserDTO postUser,
                        HttpServletResponse res) {
                // check email exist
                boolean isDuplicatedEmail = userService.isEmailUnique(null, postUser.getEmail());
                if (!isDuplicatedEmail)
                        return new FailureResponse("Duplicated entry email").response();

                // create new user
                User user = User.buildUser(postUser);
                User savedUser = userService.save(user);

                return new SuccessResponse(201).response(savedUser);
        }

        @GetMapping("wishlists/ids")
        public ResponseEntity<StandardJSONResponse<Integer[]>> fetchWishlistsIds(
                        @CookieValue(value = "user", required = false) String cookie) {
                User user = authenticate.getLoggedInUser(cookie);

                if (user == null)
                        return new FailureResponse(401, "user not authenticated").response();

                Integer[] wishlists = new Integer[user.getFavRooms().size()];
                int i = 0;
                for (Room r : user.getFavRooms())
                        wishlists[i++] = r.getId();

                return new SuccessResponse().response(wishlists);
        }

        @GetMapping("wishlists")
        public ResponseEntity<StandardJSONResponse<WishlistsDTO[]>> fetchWishlists(
                        @CookieValue(value = "user", required = false) String cookie) {
                User user = authenticate.getLoggedInUser(cookie);
                if (user == null)
                        return new FailureResponse(401, "user not authenticated").response();

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
                                images[j++] = image.getImagePath(r.getHost().getEmail(), r.getId());
                        }
                        wlDTO.setImages(images);
                        wishlists[i++] = wlDTO;
                }

                return new SuccessResponse().response(wishlists);
        }

        @PostMapping("update-personal-info")
        public ResponseEntity<StandardJSONResponse<User>> updatePersonalInfo(@CookieValue("user") String cookie,
                        @RequestBody PostUpdateUserDTO postUpdateUserDTO)
                        throws IOException {
                User currentUser = authenticate.getLoggedInUser(cookie);
                if (currentUser == null)
                        return new FailureResponse(401, "user not authenticated").response();

                User savedUser = null;
                String updatedField = postUpdateUserDTO.getUpdatedField();
                Map<String, String> updateData = postUpdateUserDTO.getUpdateData();

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

                                return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE,
                                                cookiePorcess.writeCookie("user", savedUser.getEmail()).toString())
                                                .body(new StandardJSONResponse<>(true, savedUser, null));
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
                }

                return new SuccessResponse(201).response(savedUser);
        }

        @PostMapping("update-avatar")
        public ResponseEntity<StandardJSONResponse<User>> updateUserAvatar(@CookieValue("user") String cookie,
                        @RequestParam(name = "newAvatar", required = false) MultipartFile newAvatar)
                        throws IOException {
                User currentUser = authenticate.getLoggedInUser(cookie);
                if (currentUser == null)
                        return new FailureResponse(401, "user not authenticated").response();

                User savedUser = null;

                if (newAvatar != null) {
                        String fileName = StringUtils.cleanPath(newAvatar.getOriginalFilename());
                        currentUser.setAvatar(fileName);
                        savedUser = userService.saveUser(currentUser);
                        String uploadDir = STATIC_PATH + "/" + savedUser.getId();
                        FileUploadUtil.cleanDir(uploadDir);
                        FileUploadUtil.saveFile(uploadDir, fileName, newAvatar);
                }

                return new SuccessResponse(201).response(savedUser);
        }

        @GetMapping("add-to-favoritelists/{roomid}")
        public ResponseEntity<StandardJSONResponse<String>> addToWishLists(
                        @CookieValue(value = "user", required = false) String cookie,
                        @PathVariable("roomid") Integer roomid) {
                User user = authenticate.getLoggedInUser(cookie);
                if (user == null)
                        return NotAuthenticatedResponse.response();

                user.addToWishLists(roomService.getRoomById(roomid));
                User savedUser = userService.saveUser(user);

                return savedUser != null ? new SuccessResponse().response("add to wishlists successfully")
                                : new FailureResponse("can not sync user data into database").response();
        }

        @GetMapping("remove-from-favoritelists/{roomid}")
        public ResponseEntity<StandardJSONResponse<String>> removeFromWishLists(
                        @CookieValue(value = "user", required = false) String cookie,
                        @PathVariable("roomid") Integer roomId) {
                User user = authenticate.getLoggedInUser(cookie);
                if (user == null)
                        return NotAuthenticatedResponse.response();

                user.removeFromWishLists(roomService.getRoomById(roomId));
                User savedUser = userService.saveUser(user);

                return savedUser != null ? new SuccessResponse().response("remove from wishlists successfully")
                                : new FailureResponse("can not sync user data into database").response();
        }

        @GetMapping(value = "booked-rooms")
        public ResponseEntity<StandardJSONResponse<UserBookedRoomsResponseEntity>> getUserBookedRooms(
                        @CookieValue(value = "user", required = false) String cookie,
                        @RequestParam(value = "query", required = false, defaultValue = "") String query) {
                User user = authenticate.getLoggedInUser(cookie);
                if (user == null)
                        return new FailureResponse(401, "user not authenticated").response();

                List<BookedRoomDTO> bookings = bookingService.getBookedRoomsByUser(user.getId(), query);

                Integer[] starLoop = new Integer[] { 1, 2, 3, 4, 5 };
                String[] ratingLabel = new String[] { "Mức độ sạch sẽ", "Độ chính xác", "Liên lạc", "Vị trí",
                                "Nhận phòng",
                                "Giá trị" };
                List<RatingDTO> ratings = new ArrayList<>();
                for (int i = 0; i < ratingLabel.length; i++) {
                        ratings.add(new RatingDTO(ratingLabel[i], starLoop));
                }

                return new SuccessResponse().response(new UserBookedRoomsResponseEntity(
                                ratings, bookings));
        }
}
