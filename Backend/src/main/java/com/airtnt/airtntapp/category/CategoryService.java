package com.airtnt.airtntapp.category;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import com.airtnt.airtntapp.category.dto.CategoryDTO;
import com.airtnt.entity.Category;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public Category getCategoryById(int categoryId) {
        return categoryRepository.findById(categoryId).get();
    }

    public List<Category> getAllCategory() {
        List<Category> categories = new ArrayList<>();

        Iterator<Category> itr = categoryRepository.findAll().iterator();
        itr.forEachRemaining(categories::add);

        return categories;
    }

    public List<CategoryDTO> fetchCategories() {
        return categoryRepository.fetchCategories();
    }

    public List<Category> listAll() {
        return (List<Category>) categoryRepository.findAll();
    }

    public Category findById(Integer id) {
        return categoryRepository.findById(id).get();
    }

    public Category save(Category category) {
        if (category.getId() != null) {
            Category categoryDB = categoryRepository.findById(category.getId()).get();
            categoryDB.setName(category.getName());
            categoryDB.setStatus(category.isStatus());
            if (category.getIcon() != null)
                categoryDB.setIcon(category.getIcon());
            return categoryRepository.save(categoryDB);
        }
        return categoryRepository.save(category);
    }

    public void deleteById(Integer id) {
        categoryRepository.deleteById(id);
    }

}
