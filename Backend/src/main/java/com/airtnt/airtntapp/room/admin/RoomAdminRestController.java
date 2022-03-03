package com.airtnt.airtntapp.room.admin;

import com.airtnt.airtntapp.room.RoomService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
public class RoomAdminRestController {

    @Autowired
    private RoomService roomService;

    @PostMapping("/rooms/checkName")
    public String checkName(@Param("id") Integer id, @Param("name") String name) {
        return roomService.isNameUnique(id, name) ? "OK" : "Duplicated";
    }
}
