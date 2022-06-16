package com.airtnt.airtntapp.user;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.FileAttribute;
import java.nio.file.attribute.PosixFilePermission;
import java.nio.file.attribute.PosixFilePermissions;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import com.airtnt.airtntapp.FileUploadUtil;
import com.airtnt.airtntapp.booking.BookingService;
import com.airtnt.airtntapp.city.CityService;
import com.airtnt.airtntapp.common.GetResource;
import com.airtnt.airtntapp.cookie.CookieProcess;
import com.airtnt.airtntapp.country.CountryService;
import com.airtnt.airtntapp.exception.NotAuthenticatedException;
import com.airtnt.airtntapp.exception.NullCookieException;
import com.airtnt.airtntapp.exception.UserNotFoundException;
import com.airtnt.airtntapp.middleware.Authenticate;
import com.airtnt.airtntapp.response.StandardJSONResponse;
import com.airtnt.airtntapp.response.error.BadResponse;
import com.airtnt.airtntapp.response.error.NotAuthenticatedResponse;
import com.airtnt.airtntapp.response.success.OkResponse;
import com.airtnt.airtntapp.room.RoomService;
import com.airtnt.airtntapp.state.StateService;
import com.airtnt.airtntapp.user.dto.BookedRoomDTO;
import com.airtnt.airtntapp.user.dto.PostUpdateUserDTO;
import com.airtnt.airtntapp.user.dto.RatingDTO;
import com.airtnt.airtntapp.user.dto.UpdateUserDTO;
import com.airtnt.airtntapp.user.dto.UserSexDTO;
import com.airtnt.airtntapp.user.dto.WishlistsDTO;
import com.airtnt.airtntapp.user.response.BookedRoomsByUser;
import com.airtnt.entity.Address;
import com.airtnt.entity.Booking;
import com.airtnt.entity.Chat;
import com.airtnt.entity.City;
import com.airtnt.entity.Country;
import com.airtnt.entity.Image;
import com.airtnt.entity.Room;
import com.airtnt.entity.Sex;
import com.airtnt.entity.State;
import com.airtnt.entity.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
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

	@Autowired
	private Environment env;

	@GetMapping("sex")
	public ResponseEntity<StandardJSONResponse<List<UserSexDTO>>> getSexs() {
		List<UserSexDTO> sexs = new ArrayList<UserSexDTO>();

		for (Sex sex : Sex.values()) {
			sexs.add(new UserSexDTO(sex.toString(),
					sex.toString().equals("MALE") ? "Nam" : sex.toString().equals("FEMALE") ? "Nữ" : "Khác"));
		}

		return new OkResponse<List<UserSexDTO>>(sexs).response();
	}

	@GetMapping("wishlists/ids")
	public ResponseEntity<StandardJSONResponse<List<Integer>>> fetchWishlistsIds(
			@CookieValue(value = "user", required = false) String cookie) {
		try {
			User user = authenticate.getLoggedInUser(cookie);

			return new OkResponse<List<Integer>>(
					user.getFavRooms().stream().map(favRoom -> favRoom.getId()).collect(Collectors.toList()))
					.response();
		} catch (NullCookieException ex) {
			return new BadResponse<List<Integer>>(ex.getMessage()).response();
		} catch (NotAuthenticatedException ex) {
			return new NotAuthenticatedResponse<List<Integer>>().response();
		}
	}

	@GetMapping("wishlists")
	public ResponseEntity<StandardJSONResponse<WishlistsDTO[]>> fetchWishlists(
			@CookieValue(value = "user", required = false) String cookie) {
		try {
			User user = authenticate.getLoggedInUser(cookie);

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

			return new OkResponse<WishlistsDTO[]>(wishlists).response();
		} catch (NullCookieException ex) {
			return new BadResponse<WishlistsDTO[]>(ex.getMessage()).response();
		} catch (NotAuthenticatedException ex) {
			return new NotAuthenticatedResponse<WishlistsDTO[]>().response();
		}
	}

	@PutMapping("update-personal-info")
	public ResponseEntity<StandardJSONResponse<User>> updatePersonalInfo(@CookieValue("user") String cookie,
			@RequestBody PostUpdateUserDTO postUpdateUserDTO) throws IOException {
		try {
			User currentUser = authenticate.getLoggedInUser(cookie);

			User savedUser = null;
			String updatedField = postUpdateUserDTO.getUpdatedField();
			Map<String, String> updateData = postUpdateUserDTO.getUpdateData();

			switch (updatedField) {
				case "firstNameAndLastName": {
					if (updateData.get("firstName") == null && updateData.get("lastName") == null) {
						return new BadResponse<User>("First name or last name is required").response();
					}

					if (updateData.get("firstName") != null) {
						currentUser.setFirstName(updateData.get("firstName"));
					}
					if (updateData.get("lastName") != null) {
						currentUser.setLastName(updateData.get("lastName"));
					}
					savedUser = userService.saveUser(currentUser);
					break;
				}
				case "sex": {
					String newSex = updateData.get("sex");
					Sex sex = newSex.equals("MALE") ? Sex.MALE : newSex.equals("FEMALE") ? Sex.FEMALE : Sex.OTHER;
					currentUser.setSex(sex);
					savedUser = userService.saveUser(currentUser);
					break;
				}
				case "gender": {
					if (updateData.get("gender") == null) {
						return new BadResponse<User>("Gender is required").response();
					}
					String newSex = updateData.get("gender");
					Sex sex = newSex.equals("MALE") ? Sex.MALE : newSex.equals("FEMALE") ? Sex.FEMALE : Sex.OTHER;
					currentUser.setSex(sex);
					savedUser = userService.saveUser(currentUser);
					break;
				}
				case "birthdayWeb": {
					Integer yearOfBirth = Integer.parseInt(updateData.get("yearOfBirth"));
					Integer monthOfBirth = Integer.parseInt(updateData.get("monthOfBirth"));
					Integer dayOfBirth = Integer.parseInt(updateData.get("dayOfBirth"));

					currentUser.setBirthday(LocalDate.of(yearOfBirth, monthOfBirth, dayOfBirth));
					savedUser = userService.saveUser(currentUser);
					break;
				}
				case "birthday": {
					if (updateData.get("birthday") == null) {
						return new BadResponse<User>("Birthday is required").response();
					}
					LocalDate birthd = LocalDate.parse(updateData.get("birthday"));
					currentUser.setBirthday(birthd);
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

					return ResponseEntity.ok()
							.header(HttpHeaders.SET_COOKIE,
									cookiePorcess.writeCookie("user", savedUser.getEmail()).toString())
							.body(new StandardJSONResponse<User>(true, savedUser, null));
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

			return new OkResponse<User>(savedUser).response();
		} catch (NullCookieException ex) {
			return new BadResponse<User>(ex.getMessage()).response();
		} catch (NotAuthenticatedException ex) {
			return new NotAuthenticatedResponse<User>().response();
		}
	}

	@PutMapping("update")
	public ResponseEntity<StandardJSONResponse<User>> updateUser(@CookieValue("user") String cookie,
			@RequestBody UpdateUserDTO postUpdateUserDTO) {
		try {
			User currentUser = authenticate.getLoggedInUser(cookie);

			if (postUpdateUserDTO.getFirstName() == null && postUpdateUserDTO.getLastName() == null) {
				return new BadResponse<User>("First name or last name is required").response();
			}
			if (postUpdateUserDTO.getFirstName() != null) {
				currentUser.setFirstName(postUpdateUserDTO.getFirstName());
			}
			if (postUpdateUserDTO.getLastName() != null) {
				currentUser.setLastName(postUpdateUserDTO.getLastName());
			}

			if (postUpdateUserDTO.getGender() == null) {
				return new BadResponse<User>("Gender is required").response();
			}

			String newSex = postUpdateUserDTO.getGender();
			Sex sex = newSex.equals("MALE") ? Sex.MALE : newSex.equals("FEMALE") ? Sex.FEMALE : Sex.OTHER;
			currentUser.setSex(sex);

			if (postUpdateUserDTO.getBirthday() == null) {
				return new BadResponse<User>("Birthday is required").response();
			}

			LocalDate birthd = LocalDate.parse(postUpdateUserDTO.getBirthday());
			currentUser.setBirthday(birthd);

			return new OkResponse<User>(userService.saveUser(currentUser)).response();
		} catch (NullCookieException e) {
			return new BadResponse<User>(e.getMessage()).response();
		} catch (NotAuthenticatedException e) {
			return new NotAuthenticatedResponse<User>().response();
		}

	}

	@PutMapping("update-avatar")
	public ResponseEntity<StandardJSONResponse<User>> updateUserAvatar(@CookieValue("user") String cookie,
			@RequestParam(name = "newAvatar", required = false) MultipartFile newAvatar) throws IOException {
		try {
			User currentUser = authenticate.getLoggedInUser(cookie);

			if (newAvatar != null) {
				String fileName = StringUtils.cleanPath(newAvatar.getOriginalFilename());
				String uploadDir = "";
				String environment = env.getProperty("env");
				System.out.println(environment);
				if (environment.equals("development")) {
					uploadDir = "src/main/resources/static/user_images/" + currentUser.getId() + "/";
				} else {
					String filePath = "/opt/tomcat/webapps/ROOT/WEB-INF/classes/static/user_images/"
							+ currentUser.getId() + "/";
					Path uploadPath = Paths.get(filePath);
					if (!Files.exists(uploadPath)) {
						Set<PosixFilePermission> permissions = PosixFilePermissions.fromString("rwxr--r--");
						FileAttribute<Set<PosixFilePermission>> fileAttributes = PosixFilePermissions
								.asFileAttribute(permissions);

						Files.createDirectories(uploadPath, fileAttributes);
					}
					uploadDir = GetResource.getResourceAsFile("static/user_images/" + currentUser.getId() + "/");
					System.out.println(uploadDir);
				}

				FileUploadUtil.cleanDir(uploadDir);
				FileUploadUtil.saveFile(uploadDir, fileName, newAvatar);
				currentUser.setAvatar(fileName);
				User savedUser = userService.saveUser(currentUser);
				return new OkResponse<User>(savedUser).response();
			} else {
				return new BadResponse<User>("Please add image").response();
			}
		} catch (NullCookieException ex) {
			return new BadResponse<User>(ex.getMessage()).response();
		} catch (NotAuthenticatedException ex) {
			return new NotAuthenticatedResponse<User>().response();
		}
	}

	@PutMapping("add-to-favoritelists/{roomid}")
	public ResponseEntity<StandardJSONResponse<String>> addToWishLists(
			@CookieValue(value = "user", required = false) String cookie, @PathVariable("roomid") Integer roomid) {
		try {
			User user = authenticate.getLoggedInUser(cookie);

			user.addToWishLists(roomService.getRoomById(roomid));
			User savedUser = userService.saveUser(user);

			return savedUser != null ? new OkResponse<String>("add to wishlists successfully").response()
					: new BadResponse<String>("can not sync user data into database").response();
		} catch (NullCookieException ex) {
			return new BadResponse<String>(ex.getMessage()).response();
		} catch (NotAuthenticatedException ex) {
			return new NotAuthenticatedResponse<String>().response();
		}
	}

	@PutMapping("remove-from-favoritelists/{roomid}")
	public ResponseEntity<StandardJSONResponse<String>> removeFromWishLists(
			@CookieValue(value = "user", required = false) String cookie, @PathVariable("roomid") Integer roomId) {
		try {
			User user = authenticate.getLoggedInUser(cookie);
			user.removeFromWishLists(roomService.getRoomById(roomId));
			User savedUser = userService.saveUser(user);

			return savedUser != null ? new OkResponse<String>("remove from wishlists successfully").response()
					: new BadResponse<String>("can not sync user data into database").response();
		} catch (NullCookieException ex) {
			return new BadResponse<String>(ex.getMessage()).response();
		} catch (NotAuthenticatedException ex) {
			return new NotAuthenticatedResponse<String>().response();
		}
	}

	@GetMapping("booked-rooms")
	public ResponseEntity<StandardJSONResponse<BookedRoomsByUser>> getUserBookedRooms(
			@CookieValue(value = "user", required = false) String cookie,
			@RequestParam(value = "query", required = false, defaultValue = "") String query) {
		try {
			User user = authenticate.getLoggedInUser(cookie);
			List<BookedRoomDTO> bookings = bookingService.getBookedRoomsByUser(user.getId(), query);

			Integer[] starLoop = new Integer[] { 1, 2, 3, 4, 5 };
			String[] ratingLabel = new String[] { "Mức độ sạch sẽ", "Độ chính xác", "Liên lạc", "Vị trí", "Nhận phòng",
					"Giá trị" };
			List<RatingDTO> ratings = new ArrayList<>();
			for (int i = 0; i < ratingLabel.length; i++) {
				ratings.add(new RatingDTO(ratingLabel[i], starLoop));
			}

			return new OkResponse<BookedRoomsByUser>(new BookedRoomsByUser(ratings, bookings)).response();
		} catch (NullCookieException ex) {
			return new BadResponse<BookedRoomsByUser>(ex.getMessage()).response();
		} catch (NotAuthenticatedException ex) {
			return new NotAuthenticatedResponse<BookedRoomsByUser>().response();
		}
	}

	@DeleteMapping("{userid}")
	public ResponseEntity<StandardJSONResponse<String>> deleteUser(@PathVariable("userid") String userId)
			throws NumberFormatException, UserNotFoundException {
		boolean isDeleteSucceeded = userService.deleteUser(Integer.parseInt(userId));

		if (isDeleteSucceeded) {
			return new OkResponse<String>("Delete user successfully").response();
		} else {
			return new BadResponse<String>("Can not delete user").response();
		}
	}

	@GetMapping("inbox")
	public ResponseEntity<StandardJSONResponse<List<Chat>>> getUserChats(
			@CookieValue(value = "user", required = false) String cookie) {
		try {
			User user = authenticate.getLoggedInUser(cookie);
			// return new OkResponse<List<Chat>>(user.getSender()).response();

			return null;

		} catch (NullCookieException e) {
			return new BadResponse<List<Chat>>(e.getMessage()).response();
		} catch (NotAuthenticatedException e) {
			return new BadResponse<List<Chat>>(e.getMessage()).response();
		}
	}

	@GetMapping("info")
	public ResponseEntity<StandardJSONResponse<User>> getUserInfo(
			@CookieValue(value = "user", required = false) String cookie) {
		try {
			return new OkResponse<User>(authenticate.getLoggedInUser(cookie)).response();
		} catch (NullCookieException e) {
			return new BadResponse<User>(e.getMessage()).response();
		} catch (NotAuthenticatedException e) {
			return new BadResponse<User>(e.getMessage()).response();
		}
	}
}
