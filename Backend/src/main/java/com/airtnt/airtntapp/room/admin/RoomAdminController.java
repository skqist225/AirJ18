package com.airtnt.airtntapp.room.admin;

import java.io.IOException;
import java.util.List;

import com.airtnt.airtntapp.FileUploadUtil;
import com.airtnt.airtntapp.amentity.AmentityService;
import com.airtnt.airtntapp.category.CategoryService;
import com.airtnt.airtntapp.country.CountryService;
import com.airtnt.airtntapp.currency.CurrencyRepository;
import com.airtnt.airtntapp.exception.RoomNotFoundException;
import com.airtnt.airtntapp.review.ReviewService;
import com.airtnt.airtntapp.room.RoomService;
import com.airtnt.airtntapp.room.group.RoomGroupService;
import com.airtnt.airtntapp.room.privacy.RoomPrivacyService;
import com.airtnt.airtntapp.rule.RuleService;
import com.airtnt.airtntapp.user.UserService;
import com.airtnt.entity.Amentity;
import com.airtnt.entity.Category;
import com.airtnt.entity.Country;
import com.airtnt.entity.Currency;
import com.airtnt.entity.Review;
import com.airtnt.entity.Room;
import com.airtnt.entity.RoomGroup;
import com.airtnt.entity.RoomPrivacy;
import com.airtnt.entity.Rule;
import com.airtnt.entity.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/admin")
@Transactional
public class RoomAdminController {
    @Autowired
    RoomService service;
    @Autowired
    CountryService countryService;
    @Autowired
    UserService userService;
    @Autowired
    CategoryService categoryService;
    @Autowired
    CurrencyRepository currencyRepository;
    @Autowired
    AmentityService amentityService;
    @Autowired
    RuleService ruleService;
    @Autowired
    RoomGroupService roomGroupService;
    @Autowired
    RoomPrivacyService roomPrivacyService;

    @Autowired
    private ReviewService reviewService;

    @GetMapping("/rooms")
    public String listFirstPage(Model model) {
        return listByPage(1, "name", "asc", null, model);
    }

    @GetMapping("/rooms/page/{pageNum}")
    public String listByPage(@PathVariable("pageNum") int pageNum, @Param("sortField") String sortField,
            @Param("sortDir") String sortDir, @Param("keyword") String keyword, Model model) {
        Page<Room> page = service.listByPage(pageNum, sortField, sortDir, keyword);
        List<Room> listRooms = page.getContent();

        long startCount = (pageNum - 1) * RoomService.ROOMS_PER_PAGE + 1;
        long endCount = startCount + RoomService.ROOMS_PER_PAGE - 1;
        if (endCount > page.getTotalElements()) {
            endCount = page.getTotalElements();
        }

        String reverseSortDir = sortDir.equals("asc") ? "desc" : "asc";

        model.addAttribute("currentPage", pageNum);
        model.addAttribute("totalPages", page.getTotalPages());
        model.addAttribute("startCount", startCount);
        model.addAttribute("endCount", endCount);
        model.addAttribute("totalItems", page.getTotalElements());
        model.addAttribute("listRooms", listRooms);
        model.addAttribute("sortField", sortField);
        model.addAttribute("sortDir", sortDir);
        model.addAttribute("reverseSortDir", reverseSortDir);
        model.addAttribute("keyword", keyword);

        return "rooms/rooms";
    }

    @GetMapping("/rooms/new")
    public String newRoom(Model model) {
        List<User> listUsers = userService.findAllUsers();
        List<Category> listCategories = categoryService.listAll();
        List<Currency> listCurrencies = (List<Currency>) currencyRepository.findAll();
        List<Country> listCountries = countryService.listAll();
        List<Rule> listRules = ruleService.listAll();
        List<Amentity> listAmentities = amentityService.listAll();
        List<RoomGroup> listRoomGroups = roomGroupService.listAll();
        List<RoomPrivacy> listPrivacyTypes = roomPrivacyService.listAll();
        model.addAttribute("listRules", listRules);
        model.addAttribute("listAmentities", listAmentities);
        model.addAttribute("listHosts", listUsers);
        model.addAttribute("listCategories", listCategories);
        model.addAttribute("listCurrencies", listCurrencies);
        model.addAttribute("listCountries", listCountries);
        model.addAttribute("listRoomGroups", listRoomGroups);
        model.addAttribute("listPrivacyTypes", listPrivacyTypes);

        Room room = new Room();
        model.addAttribute("room", room);

        model.addAttribute("pageTitle", "Add New Room");
        return "rooms/room_form";
    }

    @PostMapping("/rooms/save")
    public String saveRoom(Room room, RedirectAttributes ra,
            @RequestParam(name = "image", required = false) MultipartFile multipartFile) throws IOException {

        if (!multipartFile.isEmpty()) {
            String fileName = StringUtils.cleanPath(multipartFile.getOriginalFilename());
            room.setThumbnail(fileName);

            Room savedRoom = service.save(room);

            String uploadDir = "../room_images/" + savedRoom.getHost().getEmail() + "/" + savedRoom.getId();

            FileUploadUtil.cleanDir(uploadDir);
            FileUploadUtil.saveFile(uploadDir, fileName, multipartFile);
        } else {
            if (room.renderThumbnailImage().isEmpty())
                room.setThumbnail(null);
            service.save(room);
        }

        ra.addFlashAttribute("message", "The room has been saved successfully.");
        return getRedirectURLtoAffectedRoom(room);
    }

    private String getRedirectURLtoAffectedRoom(Room room) {
        String name = room.getName();
        return "redirect:/admin/rooms/page/1?sortField=id&sortDir=asc&keyword=" + name;
    }

    @GetMapping("/rooms/edit/{id}")
    public String editRoom(Model model, @PathVariable("id") int id, RedirectAttributes ra)
            throws RoomNotFoundException {
        try {
            List<User> listUsers = userService.findAllUsers();
            List<Category> listCategories = categoryService.listAll();
            List<Currency> listCurrencies = (List<Currency>) currencyRepository.findAll();
            List<Country> listCountries = countryService.listAll();
            List<Rule> listRules = ruleService.listAll();
            List<Amentity> listAmentities = amentityService.listAll();
            List<RoomGroup> listRoomGroups = roomGroupService.listAll();
            List<RoomPrivacy> listPrivacyTypes = roomPrivacyService.listAll();
            model.addAttribute("listRules", listRules);
            model.addAttribute("listAmentities", listAmentities);
            model.addAttribute("listHosts", listUsers);
            model.addAttribute("listCategories", listCategories);
            model.addAttribute("listCurrencies", listCurrencies);
            model.addAttribute("listCountries", listCountries);
            model.addAttribute("listRoomGroups", listRoomGroups);
            model.addAttribute("listPrivacyTypes", listPrivacyTypes);

            Room room = service.getById(id);
            model.addAttribute("room", room);

            model.addAttribute("pageTitle", "Edit Room (ID: " + id + ")");

            return "rooms/room_form";

        } catch (RoomNotFoundException ex) {
            ra.addFlashAttribute("message", ex.getMessage());
            return "redirect:/admin/rooms";
        }
    }

    @GetMapping("/rooms/{id}/enabled/{enable}")
    public String updateStatus(@PathVariable("id") Integer id, @PathVariable("enable") Boolean enable,
            RedirectAttributes redirectAttributes) {
        service.updateRoomEnabledStatus(id, enable);
        String status = enable ? "enabled" : "disabled";
        String message = "The room ID " + id + " has been " + status;
        redirectAttributes.addFlashAttribute("message", message);
        return "redirect:/admin/rooms";
    }

    @GetMapping("/rooms/delete/{id}")
    public String deleteRoom(@PathVariable("id") Integer id, RedirectAttributes ra) throws RoomNotFoundException {
        service.deleteRoom(id);
        ra.addFlashAttribute("message", "The room ID " + id + " has been deleted successully");
        return "redirect:/admin/rooms";
    }

    @GetMapping("/rooms/seeReview/{id}")
    public String seeReview(Model model, @PathVariable("id") Integer id) {
        List<Review> reviews = reviewService.getReviewByIdRoom(id);
        Integer totalRating = reviewService.getTotalRatingByIdRoom(id);
        model.addAttribute("reviews", reviews);
        model.addAttribute("totalRating", totalRating);
        return "rooms/seeReview";
    }
}
