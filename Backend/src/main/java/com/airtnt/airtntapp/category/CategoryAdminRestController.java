package com.airtnt.airtntapp.category;

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
import com.airtnt.airtntapp.common.GetResource;
import com.airtnt.entity.Category;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
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
public class CategoryAdminRestController {
    @Autowired
    CategoryService service;
    
    @Autowired
    Environment env;

    @GetMapping("/categories/list")
    public List<Category> listAll() {
        return service.listAll();
    }

    @GetMapping("/categories/{id}")
    public Category findById(
            @PathVariable("id") Integer id) {
        return service.findById(id);
    }

    @PostMapping("/categories/save")
    public ResponseEntity<Object> saveCategory(
            @RequestParam(name = "id", required = false) Integer id,
            @RequestParam("name") String name,
            @RequestParam(name = "fileImage", required = false) MultipartFile multipartFile,
            @RequestParam("status") Boolean status) throws IOException {
        Category category;
        if (id != null)
            category = new Category(id, name);
        else
            category = new Category(name);
        category.setStatus(status);
        if (multipartFile != null && !multipartFile.isEmpty()) {
            String fileName = StringUtils.cleanPath(multipartFile.getOriginalFilename());
            category.setIcon(fileName);

            Category savedCategory = service.save(category);

            String uploadDir = "src/main/resources/static/category_images/";
            
            String environment = env.getProperty("env");
			System.out.println(environment);
			if (environment.equals("development")) {
				uploadDir = "src/main/resources/static/category_images/";
			} else {
				String filePath = "/opt/tomcat/webapps/ROOT/WEB-INF/classes/static/category_images/";
				Path uploadPath = Paths.get(filePath);
				if (!Files.exists(uploadPath)) {
					Set<PosixFilePermission> permissions = PosixFilePermissions.fromString("rwxr--r--");
					FileAttribute<Set<PosixFilePermission>> fileAttributes = PosixFilePermissions
							.asFileAttribute(permissions);

					Files.createDirectories(uploadPath, fileAttributes);
				}
				uploadDir = GetResource.getResourceAsFile("static/category_images/");
				System.out.println(uploadDir);
			}

            FileUploadUtil.saveFile(uploadDir, fileName, multipartFile);

            return ResponseEntity.ok().body(String.valueOf(savedCategory.getId()));
        } else {
        	if (id == null) {
        		return ResponseEntity.badRequest().body("please choose image");        		
        	}
            Category savedCategory = service.save(category);
            return ResponseEntity.ok().body(String.valueOf(savedCategory.getId()));
        }
    }

    @DeleteMapping("/categories/delete/{id}")
    public void delete(@PathVariable("id") Integer id) {
        service.deleteById(id);
    }
}
