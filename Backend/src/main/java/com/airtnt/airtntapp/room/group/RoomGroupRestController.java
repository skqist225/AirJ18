package com.airtnt.airtntapp.room.group;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import com.airtnt.airtntapp.response.StandardJSONResponse;
import com.airtnt.airtntapp.response.success.OkResponse;
import com.airtnt.entity.RoomGroup;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/")
public class RoomGroupRestController {
    @Autowired
    private RoomGroupService roomGroupService;

    @GetMapping(value = "room-group")
    public ResponseEntity<StandardJSONResponse<List<RoomGroup>>> fetchRoomGroup() {
        return new OkResponse<List<RoomGroup>>(roomGroupService.getRoomGroups()).response();
    }
}
