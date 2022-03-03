package com.airtnt.airtntapp.amentity;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import com.airtnt.entity.Amentity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AmentityService {
    @Autowired
    AmentityRepository amentityRepository;

    public List<Amentity> getAmentities(String findCriteria) {
        List<Amentity> amentities = null;
        if (findCriteria == "prominent") {
            amentities = amentityRepository.findByProminent(true);
        } else if (findCriteria == "favorite") {
            amentities = amentityRepository.findByFavorite(true);
        } else {
            amentities = amentityRepository.findBySafe(true);
        }

        return amentities;
    }

    public List<Amentity> getFirst18Amentities() {
        List<Amentity> amentities = amentityRepository.getFirst18Amentities();

        return amentities;
    }

    public List<Amentity> getAllAmentities() {
        Iterator<Amentity> itr = amentityRepository.findAll().iterator();
        List<Amentity> amentities = new ArrayList<>();

        itr.forEachRemaining(amentities::add);

        return amentities;
    }

    public List<Amentity> listAll() {
        return (List<Amentity>) amentityRepository.findAll();
    }

    public Amentity getById(Integer id) {
        return amentityRepository.findById(id).get();
    }

    public Amentity save(Amentity amentity) {
        if (amentity.getId() != null) {
            Amentity amentityDB = amentityRepository.findById(amentity.getId()).get();
            if (amentity.getIconImage() == null)
                amentity.setIconImage(amentityDB.getIconImage());

            return amentityRepository.save(amentity);
        }
        return amentityRepository.save(amentity);
    }

    public void delete(Integer id) {
        amentityRepository.deleteById(id);
    }

    public String checkName(Integer id, String name) {
        Amentity amentity = amentityRepository.findByName(name);

        if (amentity == null)
            return "OK";

        if (id != null && amentity.getId() == id)
            return "OK";

        return "Duplicated";
    }
}
