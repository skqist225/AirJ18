package com.airtnt.airtntapp.room.privacy;

import com.airtnt.entity.RoomPrivacy;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomPrivacyRepository extends CrudRepository<RoomPrivacy, Integer> {
}
