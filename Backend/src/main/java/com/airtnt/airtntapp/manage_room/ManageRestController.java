package com.airtnt.airtntapp.manage_room;

import java.util.HashMap;
import java.util.Map;

import com.airtnt.airtntapp.room.RoomService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ManageRestController {

    @Autowired
    private RoomService roomService;

    @PostMapping(value = "/manage-your-space/update/{roomId}/{fieldName}")
    public String getMethodName(@PathVariable("roomId") Integer roomId, @PathVariable("fieldName") String fieldName,
            @RequestBody Map<String, Object> payload) {
        Map<String, String> values = new HashMap<>();
        
        System.out.println("updated fields: " + fieldName);

        if (fieldName.equals("roomInfo")) {
            values.put("bedroomCount", payload.get("bedroom").toString());
            values.put("bedCount", payload.get("bed").toString());
            values.put("bathroomCount", payload.get("bathroom").toString());
        } else if (fieldName.equals("groupAndTypeAndPrivacy")) {
            values.put("roomGroup", payload.get("roomGroup").toString());
            values.put("category", payload.get("category").toString());
            values.put("roomPrivacy", payload.get("roomPrivacy").toString());
        } else if (fieldName.equals("location")) {
            values.put("country", payload.get("country").toString());
            values.put("state", payload.get("state").toString());
            values.put("city", payload.get("city").toString());
            values.put("street", payload.get("street").toString());
        } else if (fieldName.equals("status")) {
            values.put("status", payload.get("status").toString());
        } else if (fieldName.equals("amentities")) {
        	
        	
        	
            values.put("checked", payload.get("checked").toString());
            values.put("unchecked", payload.get("unchecked").toString());
            
        } else if (fieldName.equals("thumbnail")) {
            values.put("thumbnail", payload.get("thumbnail").toString());
        } else
            values.put(fieldName, payload.get(fieldName).toString());

        return roomService.updateField(roomId, fieldName, values);
    }
}
