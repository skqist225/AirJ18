package com.airtnt.airtntapp.privacy;

import java.util.List;

import com.airtnt.entity.RoomPrivacy;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PrivacyTypeRepository extends CrudRepository<RoomPrivacy, Integer> {

    @Query("SELECT rp.id FROM RoomPrivacy rp")
    public List<Integer> getPrivacyIDs();
}
