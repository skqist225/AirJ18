package com.airtnt.airtntapp.room.privacy;

import java.util.List;

import com.airtnt.airtntapp.response.StandardJSONResponse;
import com.airtnt.entity.RoomPrivacy;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/")
public class RoomPrivacyRestController {
    @Autowired
    private RoomPrivacyService roomPrivacyService;

    @GetMapping("room-privacy")
    public ResponseEntity<StandardJSONResponse<List<RoomPrivacy>>> getRoomPrivacies() {
        StandardJSONResponse<List<RoomPrivacy>> response = new StandardJSONResponse<>(true,
                roomPrivacyService.listAll(), null);
        return new ResponseEntity<StandardJSONResponse<List<RoomPrivacy>>>(response, null, HttpStatus.OK);
    }
}
