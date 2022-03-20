package com.airtnt.airtntapp.category;

import java.util.List;

import com.airtnt.airtntapp.category.dto.CategoryDTO;
import com.airtnt.entity.Category;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends CrudRepository<Category, Integer> {

    @Query("SELECT new com.airtnt.airtntapp.category.dto.CategoryDTO(c.id, c.name, CONCAT('/category_images/', c.icon)) FROM Category c")
    public List<CategoryDTO> fetchCategories();
}
