package com.airtnt.airtntapp.privacy;

import com.airtnt.entity.RoomPrivacy;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PrivacyTypeRepository extends CrudRepository<RoomPrivacy, Integer> {

}
