package com.airtnt.airtntapp.settings;

import java.util.List;

import com.airtnt.airtntapp.amentity.category.AmentityCategorySerivce;
import com.airtnt.entity.AmentityCategory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/admin")
public class SettingController {
    @Autowired
    AmentityCategorySerivce service;

    @GetMapping("/settings")
    public String index(Model model) {
        List<AmentityCategory> amentityCategories = service.listAll();
        model.addAttribute("amentityCategories", amentityCategories);
        return "settings/settings.html";
    }
}
