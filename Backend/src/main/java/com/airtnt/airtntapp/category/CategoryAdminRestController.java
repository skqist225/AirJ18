package com.airtnt.airtntapp.category;

import java.io.IOException;
import java.util.List;

import com.airtnt.airtntapp.FileUploadUtil;
import com.airtnt.entity.Category;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/admin")
public class CategoryAdminRestController {
    @Autowired
    CategoryService service;

    @GetMapping("/categories/list")
    public List<Category> listAll() {
        return service.listAll();
    }

    @GetMapping("/categories/{id}")
    public Category findById(
            @PathVariable("id") Integer id) {
        return service.findById(id);
    }

    @PostMapping("/categories/save")
    public String saveCategory(
            @RequestParam(name = "id", required = false) Integer id,
            @RequestParam("name") String name,
            @RequestParam(name = "fileImage", required = false) MultipartFile multipartFile,
            @RequestParam("status") Boolean status) throws IOException {
        Category category;
        if (id != null)
            category = new Category(id, name);
        else
            category = new Category(name);
        category.setStatus(status);
        if (multipartFile != null && !multipartFile.isEmpty()) {
            String fileName = StringUtils.cleanPath(multipartFile.getOriginalFilename());
            category.setIcon(fileName);

            Category savedCategory = service.save(category);

            String uploadDir = "../category_images";

            FileUploadUtil.saveFile(uploadDir, fileName, multipartFile);

            return String.valueOf(savedCategory.getId());
        } else {
            Category savedCategory = service.save(category);
            return String.valueOf(savedCategory.getId());
        }
    }

    @DeleteMapping("/categories/delete/{id}")
    public void delete(@PathVariable("id") Integer id) {
        service.deleteById(id);
    }
}
