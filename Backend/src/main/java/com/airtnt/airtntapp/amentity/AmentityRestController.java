package com.airtnt.airtntapp.amentity;

import java.util.List;

import com.airtnt.entity.Amentity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class AmentityRestController {

    @Autowired
    private AmentityService amentityService;

    @GetMapping("/amenities")
    public List<Amentity> fetchAmenities() {
        return amentityService.getAllAmentities();
    }
}
