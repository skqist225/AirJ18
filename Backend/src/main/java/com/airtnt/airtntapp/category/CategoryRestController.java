package com.airtnt.airtntapp.category;

import java.util.List;

import com.airtnt.entity.Category;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class CategoryRestController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping("/categories")
    public List<Category> fetchCategories() {
        return categoryService.getAllCategory();
    }
}
