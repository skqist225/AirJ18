package com.airtnt.airtntapp.room.privacy;

import java.util.List;

import com.airtnt.entity.RoomPrivacy;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoomPrivacyService {

    @Autowired
    private RoomPrivacyRepository roomPrivacyRepository;

    public List<RoomPrivacy> listAll() {
        return (List<RoomPrivacy>) roomPrivacyRepository.findAll();
    }
}
