package com.airtnt.airtntapp.category;

import java.util.List;

import com.airtnt.airtntapp.category.dto.CategoryDTO;
import com.airtnt.airtntapp.response.StandardJSONResponse;
import com.airtnt.airtntapp.response.success.OkResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/")
public class CategoryRestController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping("categories")
    public ResponseEntity<StandardJSONResponse<List<CategoryDTO>>> fetchCategories() {
        return new OkResponse<List<CategoryDTO>>(categoryService.fetchCategories()).response();
    }
}
