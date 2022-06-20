package com.airtnt.airtntapp.user.admin;

import java.io.IOException;
import java.util.List;

import com.airtnt.airtntapp.FileUploadUtil;
import com.airtnt.airtntapp.address.AddressRepository;
import com.airtnt.airtntapp.exception.DuplicatedEntryPhoneNumberExeption;
import com.airtnt.airtntapp.exception.UserNotFoundException;
import com.airtnt.airtntapp.security.UserDetailsImpl;
import com.airtnt.airtntapp.user.UserService;
import com.airtnt.entity.Address;
import com.airtnt.entity.City;
import com.airtnt.entity.Country;
import com.airtnt.entity.Role;
import com.airtnt.entity.State;
import com.airtnt.entity.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
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
public class UserAdminController {

	@Autowired
	UserService service;
	@Autowired
	AddressRepository addressRepo;

	@GetMapping("/users")
	public String listFirstPage(Model model) {
		return listByPage(1, "firstName", "asc", null, model);
	}

	@GetMapping("/users/page/{pageNum}")
	public String listByPage(@PathVariable("pageNum") int pageNum, @Param("sortField") String sortField,
			@Param("sortDir") String sortDir, @Param("keyword") String keyword, Model model) {
		Page<User> page = service.listByPage(pageNum, sortField, sortDir, keyword);
		List<User> listUsers = page.getContent();

		long startCount = (pageNum - 1) * UserService.USERS_PER_PAGE + 1;
		long endCount = startCount + UserService.USERS_PER_PAGE - 1;
		if (endCount > page.getTotalElements()) {
			endCount = page.getTotalElements();
		}

		String reverseSortDir = sortDir.equals("asc") ? "desc" : "asc";

		model.addAttribute("currentPage", pageNum);
		model.addAttribute("totalPages", page.getTotalPages());
		model.addAttribute("startCount", startCount);
		model.addAttribute("endCount", endCount);
		model.addAttribute("totalItems", page.getTotalElements());
		model.addAttribute("listUsers", listUsers);
		model.addAttribute("sortField", sortField);
		model.addAttribute("sortDir", sortDir);
		model.addAttribute("reverseSortDir", reverseSortDir);
		model.addAttribute("keyword", keyword);

		return "users/users";
	}

	@GetMapping("/users/new")
	public String newUser(Model model) {

		List<Role> listRoles = service.listRoles();
		List<Country> listCountries = service.listCountries();

		User user = new User();
		user.setStatus(true);
		model.addAttribute("user", user);
		model.addAttribute("listRoles", listRoles);
		model.addAttribute("listCountries", listCountries);
		model.addAttribute("pageTitle", "Create New User");
		model.addAttribute("addresss", new Address(new Country(), new State(), new City(), ""));

		return "users/user_form";
	}

	@PostMapping("/users/save")
	public String saveUser(User user, RedirectAttributes ra,
			@RequestParam(name = "image", required = false) MultipartFile multipartFile,
			@RequestParam("countrySelected") Integer countryId,
			@RequestParam(name = "state", required = false) Integer stateId,
			@RequestParam(name = "city", required = false) Integer cityId,
			@RequestParam(name = "addresss", required = false) String address)
			throws IOException, DuplicatedEntryPhoneNumberExeption {
		State state;
		Country country;
		City city;
		if (countryId != null)
			country = new Country(countryId);
		else
			country = null;
		if (stateId != null)
			state = new State(stateId);
		else
			state = null;
		if (cityId != null)
			city = new City(cityId);
		else
			city = null;
		Address addressToSave = new Address(country, state, city, address);
		Address addressSaved = addressRepo.save(addressToSave);
		user.setAddress(addressSaved);
		if (!multipartFile.isEmpty()) {
			String fileName = StringUtils.cleanPath(multipartFile.getOriginalFilename());
			user.setAvatar(fileName);

			User savedUser = service.save(user);

			String uploadDir = "../user_images/" + savedUser.getId();

			FileUploadUtil.cleanDir(uploadDir);
			FileUploadUtil.saveFile(uploadDir, fileName, multipartFile);
		} else {
			if (user.getAvatar().isEmpty())
				user.setAvatar(null);
			service.save(user);
		}

		ra.addFlashAttribute("message", "The user has been saved successfully.");
		return getRedirectURLtoAffectedUser(user);
	}

	private String getRedirectURLtoAffectedUser(User user) {
		String firstPartOfEmail = user.getEmail().split("@")[0];
		return "redirect:/admin/users/page/1?sortField=id&sortDir=asc&keyword=" + firstPartOfEmail;
	}

	@GetMapping("/users/edit/{id}")
	public String editUser(Model model, @PathVariable("id") int id, RedirectAttributes ra)
			throws UserNotFoundException {
		try {
			List<Role> listRoles = service.listRoles();
			List<Country> listCountries = service.listCountries();

			User user = service.findById(id);
			Address address = user.getAddress();
			Integer countryId, stateId, cityId;
			if (address == null) {
				countryId = null;
				stateId = null;
				cityId = null;
			} else {
				countryId = address.getCountry() == null ? null : address.getCountry().getId();
				stateId = address.getState() == null ? null : address.getState().getId();
				cityId = address.getCity() == null ? null : address.getCity().getId();
			}
			model.addAttribute("user", user);
			model.addAttribute("listRoles", listRoles);
			model.addAttribute("listCountries", listCountries);
			model.addAttribute("pageTitle", "Edit User (ID: " + id + ")");
			model.addAttribute("addresss", address);
			model.addAttribute("countryId", countryId);
			model.addAttribute("stateId", stateId);
			model.addAttribute("cityId", cityId);

			return "users/user_form";

		} catch (UserNotFoundException ex) {
			ra.addFlashAttribute("message", ex.getMessage());
			return "redirect:/admin/users";
		}
	}

	@GetMapping("/users/{id}/enabled/{enable}")
	public String updateStatus(@PathVariable("id") Integer id, @PathVariable("enable") Boolean enable,
			RedirectAttributes redirectAttributes) {
		service.updateUserEnabledStatus(id, enable);
		String status = enable ? "enabled" : "disabled";
		String message = "The user ID " + id + " has been " + status;
		redirectAttributes.addFlashAttribute("message", message);
		return "redirect:/admin/users";
	}

	@GetMapping("/users/delete/{id}")
	public String deleteUser(@PathVariable("id") Integer id, RedirectAttributes ra) {
		try {
			service.delete(id);
			ra.addFlashAttribute("message", "The user ID " + id + " has been deleted successully");
		} catch (UserNotFoundException ex) {
			ra.addFlashAttribute("message", ex.getMessage());
		}
		return "redirect:/admin/users";
	}

	@GetMapping("/account")
	public String viewDetails(@AuthenticationPrincipal UserDetailsImpl loggedUser, Model model,
			RedirectAttributes ra) {
		Integer id = loggedUser.getId();

		try {
			List<Role> listRoles = service.listRoles();
			List<Country> listCountries = service.listCountries();

			User user = service.findById(id);
			model.addAttribute("user", user);
			model.addAttribute("listRoles", listRoles);
			model.addAttribute("listCountries", listCountries);
			model.addAttribute("pageTitle", "Edit User (ID: " + id + ")");
			model.addAttribute("addresss", user.getAddress());

			return "users/user_form";

		} catch (UserNotFoundException ex) {
			ra.addFlashAttribute("message", ex.getMessage());
			return "redirect:/admin/users";
		}
	}
}
