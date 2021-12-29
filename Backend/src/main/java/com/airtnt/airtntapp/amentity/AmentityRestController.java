package com.airtnt.airtntapp.amentity;

import java.io.IOException;
import java.util.List;

import com.airtnt.airtntapp.FileUploadUtil;
import com.airtnt.entity.Amentity;
import com.airtnt.entity.AmentityCategory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/admin")
public class AmentityRestController {

    @Autowired
    AmentityService service;

    @GetMapping("/amentities/list")
    public List<Amentity> listAll() {
        return service.listAll();
    }

    @GetMapping("/amentities/{id}")
    public Amentity getById(@PathVariable("id") Integer id) {
        return service.getById(id);
    }

    @PostMapping("/amentities/save")
    public String save(
            @RequestParam(name = "id", required = false) Integer id,
            @RequestParam("name") String name,
            @RequestParam(name = "amentityImage", required = false) MultipartFile multipartFile,
            @RequestParam("status") Boolean status,
            @RequestParam("description") String description,
            @RequestParam("amentityCategory") Integer amentityCategoryId) throws IOException {
        Amentity amentity;
        if (id != null)
            amentity = new Amentity(id, name, description, new AmentityCategory(amentityCategoryId));
        else
            amentity = new Amentity(name, description, new AmentityCategory(amentityCategoryId));
        amentity.setStatus(status);
        if (multipartFile != null && !multipartFile.isEmpty()) {
            String fileName = StringUtils.cleanPath(multipartFile.getOriginalFilename());
            amentity.setIconImage(fileName);

            Amentity savedAmentity = service.save(amentity);

            String uploadDir = "../amentity_images";

            FileUploadUtil.saveFile(uploadDir, fileName, multipartFile);

            return String.valueOf(savedAmentity.getId());
        } else {
            Amentity savedAmentity = service.save(amentity);
            return String.valueOf(savedAmentity.getId());
        }
    }

    @DeleteMapping("/amentities/delete/{id}")
    public void delete(@PathVariable("id") Integer id) {
        service.delete(id);
    }

    @PostMapping("/amentities/check_name")
    public String checkName(@Param("id") Integer id,
            @Param("name") String name) {
        return service.checkName(id, name);
    }
}
