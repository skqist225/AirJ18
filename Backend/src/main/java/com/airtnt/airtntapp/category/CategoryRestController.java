package com.airtnt.airtntapp.category;

import java.util.List;

import com.airtnt.entity.Category;

import org.json.JSONArray;
import org.json.JSONObject;
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
    public String fetchCategories() {
        List<Category> categories = categoryService.findAllCategoriesWithDesiredField();

        JSONArray jsonArray = new JSONArray();
        for (Category category : categories) {
            jsonArray.put(new JSONObject().put("id", category.getId()).put("name", category.getName()).put("icon",
                    category.getIconPath()));
        }

        return jsonArray.toString();
    }
}
