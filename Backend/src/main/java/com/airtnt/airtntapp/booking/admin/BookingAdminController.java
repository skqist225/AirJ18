package com.airtnt.airtntapp.booking.admin;

import java.util.List;

import com.airtnt.airtntapp.booking.BookingService;
import com.airtnt.airtntapp.exception.BookingNotFoundException;
import com.airtnt.entity.Booking;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/admin")
public class BookingAdminController {

    @Autowired
    private BookingService service;

    @GetMapping("/bookings")
    public String listFirstPage(Model model) {
        return listByPage(1, "id", "asc", null, model);
    }

    @GetMapping("/bookings/page/{pageNum}")
    public String listByPage(@PathVariable("pageNum") int pageNum, @Param("sortField") String sortField,
            @Param("sortDir") String sortDir, @Param("keyword") String keyword, Model model) {
        Page<Booking> page = service.listByPage(pageNum, sortField, sortDir, keyword);
        List<Booking> listBookings = page.getContent();

        long startCount = (pageNum - 1) * service.BOOKINGS_PER_PAGE + 1;
        long endCount = startCount + service.BOOKINGS_PER_PAGE - 1;
        if (endCount > page.getTotalElements()) {
            endCount = page.getTotalElements();
        }

        String reverseSortDir = sortDir.equals("asc") ? "desc" : "asc";

        model.addAttribute("currentPage", pageNum);
        model.addAttribute("totalPages", page.getTotalPages());
        model.addAttribute("startCount", startCount);
        model.addAttribute("endCount", endCount);
        model.addAttribute("totalItems", page.getTotalElements());
        model.addAttribute("listBookings", listBookings);
        model.addAttribute("sortField", sortField);
        model.addAttribute("sortDir", sortDir);
        model.addAttribute("reverseSortDir", reverseSortDir);
        model.addAttribute("keyword", keyword);

        return "bookings/bookings";
    }

    @GetMapping("/bookings/edit/{id}")
    public String editRoom(Model model, @PathVariable("id") int id, RedirectAttributes ra)
            throws BookingNotFoundException {
        try {

            Booking booking = service.getById(id);
            model.addAttribute("booking", booking);

            model.addAttribute("pageTitle", "Edit Booking (ID: " + id + ")");

            return "bookings/booking_form";

        } catch (BookingNotFoundException ex) {
            ra.addFlashAttribute("message", ex.getMessage());
            return "redirect:/admin/bookings";
        }
    }

}
