package com.airtnt.airtntapp.hosting;

import com.airtnt.airtntapp.room.RoomService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
public class HostingRestController {

    @Autowired
    private RoomService roomService;

    @GetMapping(value = "room/{roomId}/complete-rental-process")
    public String completeRentalProcess(@PathVariable("roomId") Integer roomId) {
        int isUpdated = roomService.completeRentalProcess(roomId);
        if (isUpdated == 1) {
            return new String("Complete!");
        } else {
            return new String("Something went wrong!");
        }
    }

}
