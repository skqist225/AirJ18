package com.airtnt.airtntapp;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/admin")
public class MainAdminController {
    @GetMapping("/")
    public String homePageAdmin() {
        return "admin/index";
    }
}
