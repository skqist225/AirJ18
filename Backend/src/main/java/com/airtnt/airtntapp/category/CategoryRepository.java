package com.airtnt.airtntapp.category;

import java.util.List;

import com.airtnt.entity.Category;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends CrudRepository<Category, Integer> {

    @Query("SELECT new Category(c.id, c.name, c.icon) FROM Category c")
    public List<Category> getAllCategoriesWithDesiredField();
}
