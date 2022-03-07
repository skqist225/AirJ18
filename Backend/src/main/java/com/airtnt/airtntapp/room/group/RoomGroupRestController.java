package com.airtnt.airtntapp.room.group;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import com.airtnt.entity.RoomGroup;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/")
public class RoomGroupRestController {
    @Autowired
    private RoomGroupService roomGroupService;

    @GetMapping(value = "room-group")
    public List<RoomGroup> fetchRoomGroup() {
        return roomGroupService.getRoomGroups();
    }

}
