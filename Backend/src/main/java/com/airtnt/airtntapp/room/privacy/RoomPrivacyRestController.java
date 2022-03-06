package com.airtnt.airtntapp.room.privacy;

import java.util.List;

import com.airtnt.entity.RoomPrivacy;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/")
public class RoomPrivacyRestController {
    @Autowired
    private RoomPrivacyService roomPrivacyService;

    @GetMapping("room-privacy")
    public List<RoomPrivacy> getRoomPrivacies() {
        List<RoomPrivacy> privacies = roomPrivacyService.listAll();

        return privacies;
    }

}
