package com.airtnt.airtntapp.amentity;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.FileAttribute;
import java.nio.file.attribute.PosixFilePermission;
import java.nio.file.attribute.PosixFilePermissions;
import java.util.List;
import java.util.Set;

import com.airtnt.airtntapp.FileUploadUtil;
import com.airtnt.airtntapp.amentity.category.AmentityCategorySerivce;
import com.airtnt.airtntapp.common.GetResource;
import com.airtnt.entity.Amentity;
import com.airtnt.entity.AmentityCategory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
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
public class AmentityAdminRestController {

    @Autowired
    AmentityService service;
    
    @Autowired
    AmentityCategorySerivce amentityCategoryService;
    
    @Autowired
    Environment env;

    @GetMapping("/amentities/list")
    public List<Amentity> listAll() {
        return service.listAll();
    }
    
    @GetMapping("/amentitiesCategory/list")
    public List<AmentityCategory> listAllAmentitiesCategory() {
        return amentityCategoryService.listAll();
    }


    @GetMapping("/amentities/{id}")
    public Amentity getById(@PathVariable("id") Integer id) {
        return service.getById(id);
    }

    @PostMapping("/amentities/save")
    public ResponseEntity<Object> save(
            @RequestParam(name = "id", required = false) Integer id,
            @RequestParam("name") String name,
            @RequestParam(name = "amentityImage", required = false) MultipartFile multipartFile,
            @RequestParam("status") Boolean status,
            @RequestParam("description") String description,
            @RequestParam("amentityCategory") Integer amentityCategoryId) throws IOException {
    	if (service.checkName(id, name).equals("Duplicated")) {
    		return ResponseEntity.badRequest().body("Ten da ton tai");
    	}
    	if (name.trim().isEmpty()) {
    		return ResponseEntity.badRequest().body("Please enter name");
    	}
    	if (description.trim().isEmpty()) {
    		return ResponseEntity.badRequest().body("Please enter description");
    	}
    	if (amentityCategoryId == null) {
    		return ResponseEntity.badRequest().body("Please choose amentity category");
    	}
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

            String uploadDir = "src/main/resources/static/amentity_images/";
            
            String environment = env.getProperty("env");
			System.out.println(environment);
			if (environment.equals("development")) {
				uploadDir = "src/main/resources/static/amentity_images/";
			} else {
				String filePath = "/opt/tomcat/webapps/ROOT/WEB-INF/classes/static/amentity_images/";
				Path uploadPath = Paths.get(filePath);
				if (!Files.exists(uploadPath)) {
					Set<PosixFilePermission> permissions = PosixFilePermissions.fromString("rwxr--r--");
					FileAttribute<Set<PosixFilePermission>> fileAttributes = PosixFilePermissions
							.asFileAttribute(permissions);

					Files.createDirectories(uploadPath, fileAttributes);
				}
				uploadDir = GetResource.getResourceAsFile("static/amentity_images/");
				System.out.println(uploadDir);
			}
 
            FileUploadUtil.saveFile(uploadDir, fileName, multipartFile);

            return ResponseEntity.ok().body(String.valueOf(savedAmentity.getId()));
        } else {
        	if (id == null) {
        		return ResponseEntity.badRequest().body("please choose image");        		
        	}
            Amentity savedAmentity = service.save(amentity);
            return ResponseEntity.ok().body(String.valueOf(savedAmentity.getId()));
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
