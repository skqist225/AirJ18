package com.airtnt.airtntapp.privacy;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import com.airtnt.entity.RoomPrivacy;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PrivacyTypeService {

    @Autowired
    private PrivacyTypeRepository privacyTypeRepository;

    public List<RoomPrivacy> getPrivacyType() {
        List<RoomPrivacy> privacyTypes = new ArrayList<>();
        Iterator<RoomPrivacy> iterator = privacyTypeRepository.findAll().iterator();

        while (iterator.hasNext()) {
            RoomPrivacy rt = (RoomPrivacy) iterator.next();
            privacyTypes.add(rt);
        }

        return privacyTypes;
    }

}
