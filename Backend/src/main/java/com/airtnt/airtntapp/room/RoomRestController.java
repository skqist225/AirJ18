package com.airtnt.airtntapp.room;

import java.util.*;
import java.util.stream.Collectors;

import com.airtnt.airtntapp.amentity.dto.AmenityRoomDetailsDTO;
import com.airtnt.airtntapp.booking.BookedDateDTO;
import com.airtnt.airtntapp.booking.BookingService;
import com.airtnt.airtntapp.calendar.CalendarClass;
import com.airtnt.airtntapp.city.CityService;
import com.airtnt.airtntapp.middleware.Authenticate;
import com.airtnt.airtntapp.review.ReviewService;
import com.airtnt.airtntapp.review.dto.ReviewDTO;
import com.airtnt.airtntapp.room.dto.HostDTO;
import com.airtnt.airtntapp.room.dto.PostAddRoomDTO;
import com.airtnt.airtntapp.room.dto.RoomDetailsDTO;
import com.airtnt.airtntapp.room.dto.RoomHomePageDTO;
import com.airtnt.airtntapp.room.dto.RoomPricePerCurrency;
import com.airtnt.airtntapp.room.dto.page.listings.RoomListingsDTO;
import com.airtnt.airtntapp.room.response.RoomByUserResponseEntity;
import com.airtnt.airtntapp.rule.RuleService;
import com.airtnt.airtntapp.state.StateService;
import com.airtnt.airtntapp.user.UserService;
import com.airtnt.airtntapp.user.admin.UserNotFoundException;
import com.airtnt.entity.Room;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
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

    @RequestMapping("/api/rooms")
    public List<RoomHomePageDTO> fetchRoomsByCategoryId(@RequestParam("categoryId") Integer categoryId,
            @RequestParam(value = "privacies", required = false, defaultValue = "") String privacies,
            @RequestParam(value = "minPrice", required = false, defaultValue = "0") String minPrice,
            @RequestParam(value = "maxPrice", required = false, defaultValue = "1000000000") String maxPrice,
            @RequestParam(value = "bedRoom", required = false, defaultValue = "0") String bedRoom,
            @RequestParam(value = "bed", required = false, defaultValue = "0") String bed,
            @RequestParam(value = "bathRoom", required = false, defaultValue = "0") String bathRoom,
            @RequestParam(value = "amentities", required = false, defaultValue = "") String amenitiesFilter,
            @RequestParam(value = "bookingDates", required = false, defaultValue = "") String bookingDates)
            throws ParseException {
        Map<String, String> filters = new HashMap<>();
        filters.put("privacies", privacies);
        filters.put("minPrice", minPrice);
        filters.put("maxPrice", maxPrice);
        filters.put("bedRoom", bedRoom);
        filters.put("bed", bed);
        filters.put("bathRoom", bathRoom);
        filters.put("amenities", amenitiesFilter);
        filters.put("bookingDates", bookingDates);

        List<Room> rooms = roomService.getRoomsByCategoryId(categoryId, true, 1, filters).getContent();
        System.out.println("Number of elements");
        System.out.println(roomService.getRoomsByCategoryId(categoryId, true, 1, filters).getTotalElements());
        System.out.println("-------------------");

        List<RoomHomePageDTO> roomHomePageDTOs = new ArrayList<>();
        for (Room room : rooms) {
            List<Integer> likedByUsers = roomService.getLikedUsers(room.getId());
            Set<Image> roomImages = room.getImages();
            List<String> images = new ArrayList<>();
            for (Image image : roomImages) {
                images.add(image.getImagePath(room.getHost().getEmail(), room.getId()));
            }

            RoomHomePageDTO roomHomePageDTO = RoomHomePageDTO.builder()
                    .name(room.getName())
                    .thumbnail(room.renderThumbnailImage())
                    .images(images)
                    .price(room.getPrice())
                    .currencySymbol(room.getCurrency().getSymbol())
                    .stayType(room.getPriceType() == (PriceType.PER_NIGHT) ? "đêm" : "tuần")
                    .likedByUsers(likedByUsers)
                    .id(room.getId())
                    .build();

            roomHomePageDTOs.add(roomHomePageDTO);
        }

        return roomHomePageDTOs;
    }

    @GetMapping("/api/room/{roomId}")
    public RoomDetailsDTO fetchRoomById(@PathVariable("roomId") Integer id)
            throws RoomNotFoundException, ParseException {
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

        List<String> images = new ArrayList<>();
        List<ReviewDTO> reviewDTOs = new ArrayList<>();
        List<AmenityRoomDetailsDTO> amenityRoomDetailsDTOs = new ArrayList<>();

        for (Image image : room.getImages()) {
            if (image.getImage().equals(room.getThumbnail()))
                continue;

            images.add(image.getImagePath(room.getHost().getEmail(), room.getId()));
        }

        for (Amentity a : room.getAmentities()) {
            AmenityRoomDetailsDTO amenityRoomDetailsDTO = AmenityRoomDetailsDTO.builder()
                    .id(a.getId())
                    .icon(a.getIconImagePath())
                    .name(a.getName())
                    .build();

            amenityRoomDetailsDTOs.add(amenityRoomDetailsDTO);
        }

        for (Review r : reviews) {
            ReviewDTO reviewDTO = ReviewDTO.builder()
                    .comment(r.getComment())
                    .customerName(r.getBooking().getCustomer().getFullName())
                    .customerAvatar(r.getBooking().getCustomer().getAvatarPath())
                    .rating(r.getSubRating())
                    .createdAt(r.getCreatedDate())
                    .build();
            reviewDTOs.add(reviewDTO);
        }
        List<BookedDateDTO> bookedDates = bookingService.getBookedDate(room);

        HostDTO hostDTO = HostDTO.builder()
                .name(room.getHost().getFullName())
                .avatar(room.getHost().getAvatarPath())
                .createdDate(room.getHost().getCreatedDate())
                .build();

        RoomDetailsDTO roomDetailsDTO = RoomDetailsDTO.builder()
                .thumbnail(room.renderThumbnailImage())
                .amenities(
                        amenityRoomDetailsDTOs)
                .rules(room.getRules())
                .images(images)
                .reviews(reviewDTOs)
                .id(room.getId())
                .name(room.getName())
                .description(room.getDescription())
                .location(room.getStreet() + " " + room.getCity().getName() + " " + room.getState().getName() + " "
                        + room.getCountry().getName())
                .privacy(room.getPrivacyType().getName()).guest(room.getAccomodatesCount()).host(hostDTO)
                .bed(room.getBedCount())
                .bathroom(room.getBathroomCount())
                .bedroom(room.getBedroomCount())
                .price(room.getPrice())
                .currencySymbol(room.getCurrency().getSymbol())
                .stayType(room.getPriceType() == (PriceType.PER_NIGHT) ? "đêm" : "tuần")
                .longitude(room.getLongitude())
                .latitude(room.getLatitude())
                .averageRating(avgRatings)
                .bookedDates(
                        bookedDates)
                .cityName(room.getCity().getName())
                .build();

        return roomDetailsDTO;
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

    @GetMapping("/api/room/user/page/{pageid}")
    public ResponseEntity<RoomByUserResponseEntity> fetchUserOwnedRooms(@CookieValue("user") String cookie,
            @PathVariable("pageid") Integer pageNumber,
            @RequestParam(name = "BATHROOMS", required = false, defaultValue = "0") String bathRoomsCount,
            @RequestParam(name = "BEDROOMS", required = false, defaultValue = "0") String bedRoomsCount,
            @RequestParam(name = "BEDS", required = false, defaultValue = "0") String bedsCount,
            @RequestParam(name = "query", required = false, defaultValue = "") String query,
            @RequestParam(name = "sort_dir", required = false, defaultValue = "asc") String sortDir,
            @RequestParam(name = "sort_field", required = false, defaultValue = "id") String sortField,
            @RequestParam(name = "AMENITY_IDS", required = false, defaultValue = "") String amentitiesFilter,
            @RequestParam(name = "STATUSES", required = false, defaultValue = "ACTIVE UNLISTED") String status) {
        User host = authenticate.getLoggedInUser(cookie);

        // When user not logged in
        RoomByUserResponseEntity roomByUserResponseEntity = new RoomByUserResponseEntity();
        if (host == null) {
            roomByUserResponseEntity.setErrorMessage("UNAUTHORIZED");
            return new ResponseEntity<RoomByUserResponseEntity>(roomByUserResponseEntity, null,
                    HttpStatus.UNAUTHORIZED);
        }

        // When user logged in

        Map<String, String> filters = new HashMap<>();
        filters.put("bedroomCount", bedRoomsCount);
        filters.put("bathroomCount", bathRoomsCount);
        filters.put("bedCount", bedsCount);
        filters.put("query", query);
        filters.put("sortDir", sortDir);
        filters.put("sortField", sortField);
        filters.put("amentities", amentitiesFilter);
        filters.put("status", status);

        roomByUserResponseEntity.setSuccessMessage(FETCH_OWNED_ROOMS_SUCCESS);
        Page<RoomListingsDTO> roomListingsDTOs = roomService.fetchUserOwnedRooms(host, pageNumber, filters);

        roomByUserResponseEntity.setRooms(roomListingsDTOs.toList());
        roomByUserResponseEntity.setTotalRecords(roomListingsDTOs.getTotalElements());
        roomByUserResponseEntity.setTotalPages(roomListingsDTOs.getTotalPages());

        return new ResponseEntity<RoomByUserResponseEntity>(roomByUserResponseEntity, null,
                HttpStatus.OK);
    }

    @GetMapping("/api/getAverageRoomPricePerNight")
    public double getAverageRoomPricePerNight() {
        List<RoomPricePerCurrency> roomPricePerCurrencies = roomService.getAverageRoomPricePerNight();
        double averageRoomPricePerNight = 0;
        long totalRecords = 0;
        for (RoomPricePerCurrency rp : roomPricePerCurrencies) {
            if (rp.getUnit().equals("USD")) {
                averageRoomPricePerNight += rp.getTotalPricePerNight() * 23000;
            } else {
                averageRoomPricePerNight += rp.getTotalPricePerNight();
            }
            totalRecords += rp.getTotalRecords();
        }

        return (averageRoomPricePerNight / totalRecords);
    }
}
