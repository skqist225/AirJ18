package com.airtnt.airtntapp.room;

import java.util.*;
import java.util.stream.Collectors;

import com.airtnt.airtntapp.amentity.dto.AmenityRoomDetailsDTO;
import com.airtnt.airtntapp.booking.BookedDateDTO;
import com.airtnt.airtntapp.booking.BookingService;
import com.airtnt.airtntapp.calendar.CalendarClass;
import com.airtnt.airtntapp.city.CityService;
import com.airtnt.airtntapp.exception.NotAuthenticatedException;
import com.airtnt.airtntapp.exception.NullCookieException;
import com.airtnt.airtntapp.exception.RoomNotFoundException;
import com.airtnt.airtntapp.exception.UserNotFoundException;
import com.airtnt.airtntapp.middleware.Authenticate;
import com.airtnt.airtntapp.review.ReviewService;
import com.airtnt.airtntapp.review.dto.ReviewDTO;
import com.airtnt.airtntapp.room.dto.HostDTO;
import com.airtnt.airtntapp.room.dto.PostAddRoomDTO;
import com.airtnt.airtntapp.room.dto.RoomDetailsDTO;
import com.airtnt.airtntapp.room.dto.RoomHomePageDTO;
import com.airtnt.airtntapp.room.dto.RoomPricePerCurrencyDTO;
import com.airtnt.airtntapp.room.dto.page.listings.RoomListingsDTO;
import com.airtnt.airtntapp.room.response.CalendarResponseEntity;
import com.airtnt.airtntapp.room.response.RoomsOwnedByUserResponseEntity;
import com.airtnt.airtntapp.rule.RuleService;
import com.airtnt.airtntapp.state.StateService;
import com.airtnt.airtntapp.user.UserService;
import com.airtnt.entity.Room;
import com.airtnt.airtntapp.response.StandardJSONResponse;
import com.airtnt.airtntapp.response.error.BadResponse;
import com.airtnt.airtntapp.response.error.NotAuthenticatedResponse;
import com.airtnt.airtntapp.response.success.OkResponse;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.data.domain.Page;
import org.springframework.data.repository.query.Param;
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
import com.airtnt.entity.City;
import com.airtnt.entity.Country;
import com.airtnt.entity.Image;
import com.airtnt.entity.PriceType;
import com.airtnt.entity.Review;
import com.airtnt.entity.Role;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.nio.file.attribute.FileAttribute;
import java.nio.file.attribute.PosixFilePermission;
import java.nio.file.attribute.PosixFilePermissions;
import java.text.ParseException;

import org.springframework.web.bind.annotation.ModelAttribute;

import com.airtnt.entity.Rule;
import com.airtnt.entity.State;
import com.airtnt.entity.User;

@RestController
public class RoomRestController {
    private final String STATIC_PATH = System.getProperty("user.dir") + "/src/main/resources/static/room_images";

    // @Autowired
    // RedisTemplate redisTemplate;

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

    @Autowired
    private Environment env;

    @RequestMapping("/api/rooms")
    public ResponseEntity<StandardJSONResponse<List<RoomHomePageDTO>>> fetchRoomsByCategoryId(
            @RequestParam("categoryId") Integer categoryId,
            @RequestParam(value = "privacies", required = false, defaultValue = "") String privacies,
            @RequestParam(value = "minPrice", required = false, defaultValue = "0") String minPrice,
            @RequestParam(value = "maxPrice", required = false, defaultValue = "1000000000") String maxPrice,
            @RequestParam(value = "bedRoom", required = false, defaultValue = "0") String bedRoom,
            @RequestParam(value = "bed", required = false, defaultValue = "0") String bed,
            @RequestParam(value = "bathRoom", required = false, defaultValue = "0") String bathRoom,
            @RequestParam(value = "amentities", required = false, defaultValue = "") String amenitiesFilter,
            @RequestParam(value = "bookingDates", required = false, defaultValue = "") String bookingDates,
            @RequestParam(value = "query", required = false, defaultValue = "") String query)
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
        filters.put("query", query);

        List<Room> rooms = roomService.getRoomsByCategoryId(categoryId, true, 1, filters).getContent();
        System.out.println("total eles: ");
        System.out.println(roomService.getRoomsByCategoryId(categoryId, true, 1, filters).getTotalElements());
        System.out.println("-------------");

        List<RoomHomePageDTO> roomHomePageDTOs = new ArrayList<>();
        for (Room room : rooms) {
            List<Integer> likedByUsers = roomService.getLikedUsers(room.getId());
            List<String> images = new ArrayList<>();
            room.getImages().forEach(image -> images.add(image.getImagePath(room.getHost().getEmail(), room.getId())));
            roomHomePageDTOs.add(RoomHomePageDTO.buildRoomHomePageDTO(room, images, likedByUsers));
        }

        return new OkResponse<List<RoomHomePageDTO>>(roomHomePageDTOs).response();
    }

    @GetMapping("/api/room/{roomId}")
    public ResponseEntity<StandardJSONResponse<RoomDetailsDTO>> fetchRoomById(@PathVariable("roomId") Integer id)
            throws RoomNotFoundException, ParseException {
        Room room = roomService.getById(id);

        List<Booking> bookings = bookingService.getBookingsByRoom(room);
        Integer[] bookingIds = new Integer[bookings.size()];
        for (int i = 0; i < bookings.size(); i++)
            bookingIds[i] = bookings.get(i).getId();

        List<Review> reviews = reviewService.getReviewsByBookings(bookingIds);

        float avgRatings = 0;
        for (Review r : reviews)
            avgRatings += r.getFinalRating();
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
        room.getAmentities().forEach(
                amenity -> amenityRoomDetailsDTOs.add(AmenityRoomDetailsDTO.buildAmenityRoomDetailsDTO(amenity)));
        reviews.forEach(review -> reviewDTOs.add(ReviewDTO.buildReviewDTO(review)));

        List<BookedDateDTO> bookedDates = bookingService.getBookedDates(room);

        HostDTO hostDTO = HostDTO.buildHostDTO(room);
        RoomDetailsDTO roomDetailsDTO = RoomDetailsDTO.buildRoomDetailsDTO(room, reviewDTOs, images,
                amenityRoomDetailsDTOs, hostDTO, bookedDates, avgRatings);

        return new OkResponse<RoomDetailsDTO>(roomDetailsDTO).response();
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
    public ResponseEntity<StandardJSONResponse<CalendarResponseEntity>> getCalendayByYearAndMonthV2(
            @PathVariable("selectedYear") int selectedYear,
            @PathVariable("selectedMonth") int selectedMonth) {
        List<String> daysInMonth = CalendarClass.getDaysInMonth(selectedMonth - 1, selectedYear);
        String strDaysInMonth = daysInMonth.stream().map(Object::toString).collect(Collectors.joining(" "));
        GregorianCalendar gCal = new GregorianCalendar(selectedYear, selectedMonth - 1, 1);
        int startInWeek = gCal.get(Calendar.DAY_OF_WEEK); // ngày thứ mấy trong tuần đó

        return new OkResponse<CalendarResponseEntity>(new CalendarResponseEntity(strDaysInMonth, startInWeek))
                .response();
    }

    @PostMapping("/room/verify-phone")
    public String verifyPhoneForRoom(@RequestBody Map<String, Integer> payload) {
        Integer roomId = payload.get("roomId");
        Room room = roomService.getRoomById(roomId);
        int isUpdated = userService.verifyPhoneNumber(room.getHost().getId());

        return isUpdated == 1 ? "success" : "failure";
    }

    @PostMapping("/api/room/save")
    public String saveRoom(@AuthenticationPrincipal UserDetails userDetails,
            @ModelAttribute PostAddRoomDTO payload) throws IOException, UserNotFoundException {
        Set<Rule> rules = new HashSet<>();
        Set<Amentity> amenities = new HashSet<>();
        Set<Image> images = new HashSet<>();

        Iterator<Rule> itr = ruleService.listAllRule();
        itr.forEachRemaining(rules::add);

        for (int i = 0; i < payload.getAmentities().length; i++) {
            amenities.add(new Amentity(payload.getAmentities()[i]));
        }

        for (int i = 0; i < payload.getImages().length; i++) {
            images.add(new Image(payload.getImages()[i]));
        }
        PriceType pt = Objects.equals(payload.getPriceType(), PriceType.PER_NIGHT.name()) ? PriceType.PER_NIGHT
                : PriceType.PER_WEEK;
        Country country = new Country(payload.getCountry());

        // check if state exist
        State state = stateService.getStateByName(payload.getState());
        if (state == null)
            state = new State(payload.getState(), country);

        // check if city exist
        City city = cityService.getCityByName(payload.getCity());
        if (city == null)
            city = new City(payload.getCity(), state);

        User user = userService.findById(payload.getHost());
        user.setRole(new Role(1));
        userService.saveUser(user);

        boolean status = user.isPhoneVerified();

        Room room = Room.buildRoom(payload, images, amenities, pt, city, state, country, rules, status);
        Room savedRoom = roomService.save(room);

        /* MOVE IMAGE TO FOLDER */
        String environment = env.getProperty("env");
        if (environment.equals("development")) {
            if (savedRoom != null) {
                String uploadDir = STATIC_PATH + "/" + user.getEmail() + "/"
                        + savedRoom.getId();
                String source = STATIC_PATH + "/" + user.getEmail() + "/";
                Path sourcePath = Paths.get(source);
                Path targetPath = Files.createDirectories(Paths.get(uploadDir));
                for (String imageName : payload.getImages()) {
                    Files.move(sourcePath.resolve(imageName), targetPath.resolve(imageName),
                            StandardCopyOption.REPLACE_EXISTING);
                }
            }
        } else {
            String filePath = "/opt/tomcat/webapps/ROOT/WEB-INF/classes/static/room_images/"
                    + user.getEmail() + "/"
                    + savedRoom.getId();
            Path uploadPath = Paths.get(filePath);
            if (!Files.exists(uploadPath)) {
                Set<PosixFilePermission> permissions = PosixFilePermissions.fromString("rwxr--r--");
                FileAttribute<Set<PosixFilePermission>> fileAttributes = PosixFilePermissions
                        .asFileAttribute(permissions);

                Files.createDirectories(uploadPath, fileAttributes);
            }
        }

        assert savedRoom != null;
        return savedRoom.getId() + "";
    }

    @GetMapping("/api/rooms/user/{pageid}")
    public ResponseEntity<StandardJSONResponse<RoomsOwnedByUserResponseEntity>> fetchUserOwnedRooms(
            @CookieValue(value = "user", required = false) String cookie,
            @PathVariable("pageid") Integer pageNumber,
            @RequestParam(name = "BATHROOMS", required = false, defaultValue = "0") String bathRoomsCount,
            @RequestParam(name = "BEDROOMS", required = false, defaultValue = "0") String bedRoomsCount,
            @RequestParam(name = "BEDS", required = false, defaultValue = "0") String bedsCount,
            @RequestParam(name = "QUERY", required = false, defaultValue = "") String query,
            @RequestParam(name = "SORTDIR", required = false, defaultValue = "DESC") String sortDir,
            @RequestParam(name = "SORTFIELD", required = false, defaultValue = "createdDate") String sortField,
            @RequestParam(name = "AMENITY_IDS", required = false, defaultValue = "") String amentitiesFilter,
            @RequestParam(name = "STATUSES", required = false, defaultValue = "ACTIVE UNLISTED") String status) {
        try {
            User host = authenticate.getLoggedInUser(cookie);

            Map<String, String> filters = new HashMap<>();
            filters.put("bedroomCount", bedRoomsCount);
            filters.put("bathroomCount", bathRoomsCount);
            filters.put("bedCount", bedsCount);
            filters.put("query", query);
            filters.put("sortDir", sortDir);
            filters.put("sortField", sortField);
            filters.put("amentities", amentitiesFilter);
            filters.put("status", status);
            List<RoomListingsDTO> roomListingsDTOs = new ArrayList<>();
            RoomsOwnedByUserResponseEntity roomsOwnedByUserResponseEntity = new RoomsOwnedByUserResponseEntity();

            // if (redisTemplate.opsForHash().get("TOTAL_PAGES", "TOTAL_PAGES") != null) {
            // roomListingsDTOs = redisTemplate.opsForHash().values("ROOM");

            // roomsOwnedByUserResponseEntity.setRooms(roomListingsDTOs);
            // roomsOwnedByUserResponseEntity
            // .setTotalPages((int) redisTemplate.opsForHash().get("TOTAL_PAGES",
            // "TOTAL_PAGES"));
            // roomsOwnedByUserResponseEntity
            // .setTotalRecords((long) redisTemplate.opsForHash().get("TOTAL_ELS",
            // "TOTAL_ELS"));
            // } else {
            Page<Room> roomsPage = roomService.fetchUserOwnedRooms(host, pageNumber, filters);
            for (Room room : roomsPage.getContent()) {
                roomListingsDTOs.add(RoomListingsDTO.buildRoomListingsDTO(room));
                // redisTemplate.opsForHash().put("ROOM", room.getId().toString(),
                // RoomListingsDTO.buildRoomListingsDTO(room));
            }
            // redisTemplate.opsForHash().put("TOTAL_PAGES", "TOTAL_PAGES", (Integer)
            // roomsPage.getTotalPages());
            // redisTemplate.opsForHash().put("TOTAL_ELS", "TOTAL_ELS", (Long)
            // roomsPage.getTotalElements());

            roomsOwnedByUserResponseEntity.setRooms(roomListingsDTOs);
            roomsOwnedByUserResponseEntity.setTotalPages(roomsPage.getTotalPages());
            roomsOwnedByUserResponseEntity.setTotalRecords(roomsPage.getTotalElements());
            // }

            return new OkResponse<RoomsOwnedByUserResponseEntity>(
                    roomsOwnedByUserResponseEntity)
                    .response();
        } catch (

        NullCookieException ex) {
            return new BadResponse<RoomsOwnedByUserResponseEntity>(ex.getMessage()).response();
        } catch (NotAuthenticatedException ex) {
            return new NotAuthenticatedResponse<RoomsOwnedByUserResponseEntity>().response();
        }
    }

    @GetMapping("/api/rooms/average-price")
    public ResponseEntity<StandardJSONResponse<Double>> getAverageRoomPricePerNight(
            @RequestParam(value = "type", defaultValue = "PER_NIGHT") String priceType) {
        double avgRoomPricePerNight = 0;
        long totalRecords = 0;

        if (priceType.equals(PriceType.PER_NIGHT.name())) {
            List<RoomPricePerCurrencyDTO> roomPricePerCurrencies = roomService
                    .findAverageRoomPriceByPriceType(PriceType.PER_NIGHT);

            for (RoomPricePerCurrencyDTO price : roomPricePerCurrencies) {
                if (price.getUnit().equals("USD"))
                    avgRoomPricePerNight += price.getTotalPricePerNight() * 23000;
                else
                    avgRoomPricePerNight += price.getTotalPricePerNight();

                totalRecords += price.getTotalRecords();
            }
        } else {
            // List<RoomPricePerCurrencyDTO> roomPricePerCurrencies = roomService
            // .findAverageRoomPriceByPriceType(priceType);
            // double averageRoomPricePerNight = 0;
            // long totalRecords = 0;
            // for (RoomPricePerCurrencyDTO rp : roomPricePerCurrencies) {
            // if (rp.getUnit().equals("USD"))
            // averageRoomPricePerNight += rp.getTotalPricePerNight() * 23000;
            // else
            // averageRoomPricePerNight += rp.getTotalPricePerNight();

            // totalRecords += rp.getTotalRecords();
            // }
        }

        return new OkResponse<Double>(avgRoomPricePerNight / totalRecords).response();
    }
}
