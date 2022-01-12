package com.airtnt.airtntapp.room;

import java.util.*;
import java.util.stream.Collectors;

import com.airtnt.airtntapp.booking.BookedDate;
import com.airtnt.airtntapp.booking.BookingService;
import com.airtnt.airtntapp.calendar.CalendarClass;
import com.airtnt.airtntapp.city.CityService;
import com.airtnt.airtntapp.cookie.CookieProcess;
import com.airtnt.airtntapp.middleware.Authenticate;
import com.airtnt.airtntapp.review.ReviewService;
import com.airtnt.airtntapp.room.dto.PostAddRoomDTO;
import com.airtnt.airtntapp.room.response.RoomByUserResponseEntity;
import com.airtnt.airtntapp.rule.RuleService;
import com.airtnt.airtntapp.state.StateService;
import com.airtnt.airtntapp.user.UserService;
import com.airtnt.airtntapp.user.admin.UserNotFoundException;
import com.airtnt.entity.Room;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.airtnt.entity.Amentity;
import com.airtnt.entity.Booking;
import com.airtnt.entity.Category;
import com.airtnt.entity.City;
import com.airtnt.entity.Country;
import com.airtnt.entity.Currency;
import com.airtnt.entity.Image;
import com.airtnt.entity.PriceType;
import com.airtnt.entity.Review;
import com.airtnt.entity.Role;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.text.ParseException;

import org.springframework.web.bind.annotation.ModelAttribute;

import com.airtnt.entity.RoomGroup;
import com.airtnt.entity.RoomPrivacy;
import com.airtnt.entity.Rule;
import com.airtnt.entity.State;
import com.airtnt.entity.User;
import com.airtnt.entity.exception.RoomNotFoundException;

@RestController
public class RoomRestController {

    private final String FETCH_OWNED_ROOMS_SUCCESS = "FETCH_OWNED_ROOMS_SUCCESSFULLY";

    @Autowired
    private RoomService roomService;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private UserService userService;

    @Autowired
    private RuleService ruleService;

    @Autowired
    private StateService stateService;

    @Autowired
    private CityService cityService;

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private Authenticate authenticate;

    @RequestMapping("/api/room/category/{categoryId}")
    public String fetchRoomsByCategoryId(@PathVariable("categoryId") Integer categoryId,
            @RequestParam(value = "privacies", required = false, defaultValue = "") String privacies,
            @RequestParam(value = "minPrice", required = false, defaultValue = "0") String minPrice,
            @RequestParam(value = "maxPrice", required = false, defaultValue = "1000000000") String maxPrice,
            @RequestParam(value = "bedRoom", required = false, defaultValue = "0") String bedRoom,
            @RequestParam(value = "bed", required = false, defaultValue = "0") String bed,
            @RequestParam(value = "bathRoom", required = false, defaultValue = "0") String bathRoom,
            @RequestParam(value = "amentities", required = false, defaultValue = "") String amentitiesFilter) {
        JSONArray roomsJSON = new JSONArray();

        Map<String, String> filters = new HashMap<>();
        filters.put("privacies", privacies);
        filters.put("minPrice", minPrice);
        filters.put("maxPrice", maxPrice);
        filters.put("bedRoom", bedRoom);
        filters.put("bed", bed);
        filters.put("bathRoom", bathRoom);
        filters.put("amentities", amentitiesFilter);

        List<Room> rooms = roomService.getRoomsByCategoryId(categoryId, true, 1, filters).getContent();

        for (Room room : rooms) {
            List<Integer> likedByUsers = roomService.getLikedUsers(room.getId());
            Set<Image> roomImages = room.getImages();
            List<String> images = new ArrayList<>();
            for (Image image : roomImages) {
                images.add(image.getImagePath(room.getHost().getEmail(), room.getId()));
            }

            roomsJSON
                    .put(new JSONObject().put("name", room.getName()).put("thumbnail", room.renderThumbnailImage())
                            .put("images", images)
                            .put("price", room.getPrice()).put("currency", room.getCurrency().getSymbol())
                            .put("stay_type", room.getPriceType() == (PriceType.PER_NIGHT) ? "đêm" : "tuần")
                            .put("liked_by_users", likedByUsers)
                            .put("id", room.getId()));
        }

        return roomsJSON.toString();
    }

    @GetMapping("/api/room/{roomId}")
    public String fetchRoomById(@PathVariable("roomId") Integer id) throws RoomNotFoundException, ParseException {
        Room room = roomService.getById(id);

        List<Booking> bookings = bookingService.getBookingsByRoom(room);
        Integer[] bookingIds = new Integer[bookings.size()];
        for (int i = 0; i < bookings.size(); i++)
            bookingIds[i] = bookings.get(i).getId();

        List<Review> reviews = reviewService.getReviewsByBookings(bookingIds);

        List<Integer> bedCount = new ArrayList<>();
        for (int i = 0; i < room.getBedCount(); i++) {
            bedCount.add(1);
        }

        float avgRatings = 0;
        for (Review r : reviews) {
            avgRatings += r.getFinalRating();
        }
        if (reviews.size() > 0)
            avgRatings /= reviews.size();

        JSONArray amentities = new JSONArray();
        JSONArray rules = new JSONArray();
        JSONArray images = new JSONArray();
        JSONArray reviewsJSON = new JSONArray();

        for (Amentity a : room.getAmentities()) {
            amentities.put(
                    new JSONObject().put("name", a.getName()).put("icon", a.getIconImagePath()).put("id", a.getId()));
        }

        for (Rule r : room.getRules()) {
            rules.put(new JSONObject().put("title", r.getTitle()).put("icon", r.getIconPath()));
        }

        for (Image image : room.getImages()) {
            if (image.getImage().equals(room.getThumbnail()))
                continue;

            images.put(image.getImagePath(room.getHost().getEmail(), room.getId()));
        }

        for (Review r : reviews) {
            reviewsJSON.put(new JSONObject().put("comment", r.getComment())
                    .put("customer_name", r.getBooking().getCustomer().getFullName())
                    .put("customer_avatar", r.getBooking().getCustomer().getAvatarPath()).put("rating",
                            new JSONObject().put("cleanliness", r.getSubRating().getCleanliness())
                                    .put("contact", r.getSubRating().getContact())
                                    .put("checkin", r.getSubRating().getCheckin())
                                    .put("accuracy", r.getSubRating().getAccuracy())
                                    .put("location", r.getSubRating().getLocation())
                                    .put("value", r.getSubRating().getValue())));
        }
        List<BookedDate> bookedDates = bookingService.getBookedDate(room);

        JSONObject jsonObject = new JSONObject();
        jsonObject.put("id", room.getId()).put("images", images)
                .put("name", room.getName())
                .put("thumbnail", room.renderThumbnailImage())
                .put("description", room.getDescription())
                .put("location",
                        room.getStreet() + " " + room.getCity().getName() + " " + room.getState().getName() + " "
                                + room.getCountry().getName())
                .put("privacy", room.getPrivacyType().getName()).put("guest", room.getAccomodatesCount())
                .put("bedroom", room.getBedroomCount()).put("bed", room.getBedCount())
                .put("bathroom", room.getBathroomCount())
                .put("host",
                        new JSONObject().put("name", room.getHost().getFullName()).put("avatar",
                                room.getHost().getAvatarPath()).put("id", room.getHost().getId())
                                .put("created_date", room.getHost().getCreatedDate()))
                .put("price", room.getPrice())
                .put("currency", room.getCurrency().getSymbol())
                .put("stay_type", room.getPriceType() == (PriceType.PER_NIGHT) ? "đêm" : "tuần")
                .put("amenitities", amentities)
                .put("longitude", room.getLongitude())
                .put("latitude", room.getLatitude())
                .put("average_rating", avgRatings)
                .put("reviews", reviewsJSON).put("rules", rules)
                .put("bookedDates", bookedDates);

        return jsonObject.toString();
    }

    @PostMapping("/rooms/checkName")
    public String checkName(@Param("id") Integer id, @Param("name") String name) {
        return roomService.isNameUnique(id, name) ? "OK" : "Duplicated";
    }

    @GetMapping("/calendar/{selectedMonth}/{selectedYear}")
    public String getCalendayByYearAndMonth(@PathVariable("selectedYear") int selectedYear,
            @PathVariable("selectedMonth") int selectedMonth) {
        List<String> daysInMonth = CalendarClass.getDaysInMonth(selectedMonth - 1, selectedYear);
        String strDaysInMonth = daysInMonth.stream().map(Object::toString).collect(Collectors.joining(" "));
        GregorianCalendar gCal = new GregorianCalendar(selectedYear, selectedMonth - 1, 1);
        int startInWeek = gCal.get(Calendar.DAY_OF_WEEK); // ngày thứ mấy trong tuần đó
        return new JSONObject().put("daysInMonth", strDaysInMonth).put("startInWeek", startInWeek).toString();
    }

    @GetMapping("/api/calendar/{selectedMonth}/{selectedYear}")
    public String getCalendayByYearAndMonthV2(@PathVariable("selectedYear") int selectedYear,
            @PathVariable("selectedMonth") int selectedMonth) {
        List<String> daysInMonth = CalendarClass.getDaysInMonth(selectedMonth - 1, selectedYear);
        String strDaysInMonth = daysInMonth.stream().map(Object::toString).collect(Collectors.joining(" "));
        GregorianCalendar gCal = new GregorianCalendar(selectedYear, selectedMonth - 1, 1);
        int startInWeek = gCal.get(Calendar.DAY_OF_WEEK); // ngày thứ mấy trong tuần đó
        return new JSONObject().put("daysInMonth", strDaysInMonth).put("startInWeek", startInWeek).toString();
    }

    @PostMapping("/room/verify-phone")
    public String verifyPhoneForRoom(@RequestBody Map<String, Integer> payload) {
        Integer roomId = payload.get("roomId");
        Room room = roomService.getRoomById(roomId);
        int isUpdated = userService.verifyPhoneNumber(room.getHost().getId());
        if (isUpdated == 1)
            return "success";
        else
            return "failure";
    }

    @PostMapping("room/save")
    public String saveRoom(@AuthenticationPrincipal UserDetails userDetails,
            @ModelAttribute PostAddRoomDTO payload) throws IOException, UserNotFoundException {
        Set<Rule> rules = new HashSet<>();
        Set<Amentity> amenities = new HashSet<>();
        Set<Image> images = new HashSet<>();

        Iterator<Rule> itr = ruleService.listAllRule();
        while (itr.hasNext()) {
            rules.add(itr.next());
        }

        for (int i = 0; i < payload.getAmentities().length; i++) {
            amenities.add(new Amentity(payload.getAmentities()[i]));
        }

        for (int i = 0; i < payload.getImages().length; i++) {
            images.add(new Image(payload.getImages()[i]));
        }
        PriceType pt = Objects.equals(payload.getPriceType(), "PER_NIGHT") ? PriceType.PER_NIGHT : PriceType.PER_WEEK;
        Country country = new Country(payload.getCountry());

        // check if state exist
        State state = stateService.getStateByName(payload.getState());
        if (state == null)
            state = new State(payload.getState(), country);

        // check if city exist
        City city = cityService.getCityByName(payload.getCity());
        if (city == null)
            city = new City(payload.getCity(), state);

        User user = userService.get(payload.getHost());
        user.setRole(new Role(1));
        userService.saveUser(user);

        boolean status = user.isPhoneVerified();

        Room room = Room.builder().name(payload.getName()).accomodatesCount(payload.getAccomodatesCount())
                .bathroomCount(payload.getBathroomCount()).bedCount(payload.getBedCount())
                .bedroomCount(payload.getBedroomCount()).description(payload.getDescription()).amentities(amenities)
                .images(images).latitude(payload.getLatitude()).longitude(payload.getLongitude())
                .price(payload.getPrice()).priceType(pt).city(city)
                .state(state).country(country).rules(rules).host(new User(payload.getHost()))
                .roomGroup(new RoomGroup(payload.getRoomGroup())).priceType(PriceType.PER_NIGHT)
                .host(new User(payload.getHost())).category(new Category(payload.getCategory()))
                .currency(new Currency(payload.getCurrency())).privacyType(new RoomPrivacy(payload.getPrivacyType()))
                .thumbnail(images.iterator().next().getImage()).street(payload.getStreet()).status(status).build();

        Room savedRoom = roomService.save(room);

        /* MOVE IMAGE TO FOLDER */
        if (savedRoom != null) {
            String STATIC_PATH = "src/main/resources/static/room_images/";
            String uploadDir = STATIC_PATH + user.getEmail() + "/" + savedRoom.getId();
            String source = STATIC_PATH + user.getEmail() + "/";
            Path sourcePath = Paths.get(source);
            Path targetPath = Files.createDirectories(Paths.get(uploadDir));
            for (String imageName : payload.getImages()) {
                Files.move(sourcePath.resolve(imageName), targetPath.resolve(imageName),
                        StandardCopyOption.REPLACE_EXISTING);
            }
        }

        assert savedRoom != null;
        return savedRoom.getId() + "";
    }

    @GetMapping("/api/room/user")
    public ResponseEntity<RoomByUserResponseEntity> fetchUserOwnedRooms(@CookieValue("user") String cookie) {
        User host = authenticate.getLoggedInUser(cookie);

        RoomByUserResponseEntity roomByUserResponseEntity = new RoomByUserResponseEntity();
        if (host == null) {
            roomByUserResponseEntity.setErrorMessage("UNAUTHORIZED");
            return new ResponseEntity<RoomByUserResponseEntity>(roomByUserResponseEntity, null,
                    HttpStatus.UNAUTHORIZED);
        }

        roomByUserResponseEntity.setSuccessMessage(FETCH_OWNED_ROOMS_SUCCESS);
        roomByUserResponseEntity.setRooms(roomService.fetchUserOwnedRooms(host));

        return new ResponseEntity<RoomByUserResponseEntity>(roomByUserResponseEntity, null,
                HttpStatus.OK);
    }
}
