package com.airtnt.airtntapp.amentity;

import java.util.List;

import com.airtnt.entity.Amentity;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AmentityRepository extends CrudRepository<Amentity, Integer> {
    public Amentity findByName(String name);

    public List<Amentity> findByProminent(boolean isProminent);

    public List<Amentity> findByFavorite(boolean isFavorite);

    public List<Amentity> findBySafe(boolean isSafe);

    @Query(value = "SELECT * FROM `airtnt`.`amentities` LIMIT 18;", nativeQuery = true)
    public List<Amentity> getFirst18Amentities();

}
