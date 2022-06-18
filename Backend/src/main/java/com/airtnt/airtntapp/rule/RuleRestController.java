package com.airtnt.airtntapp.rule;

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
import com.airtnt.entity.Rule;

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
public class RuleRestController {
    @Autowired
    RuleService service;

    @GetMapping("/rules/list")
    public List<Rule> listAll() {
        return service.listAll();
    }

    @GetMapping("/rules/{id}")
    public Rule findById(@PathVariable("id") Integer id) {
        return service.getById(id);
    }
    
    @Autowired
	private Environment env;

    @PostMapping("/rules/save")
    public ResponseEntity<Object> saveRule(@RequestParam(name = "id", required = false) Integer id, @RequestParam("name") String name,
            @RequestParam(name = "ruleImage", required = false) MultipartFile multipartFile,
            @RequestParam("status") Boolean status) throws IOException {
    	if (service.checkName(id, name).equals("Duplicated")) {
    		return ResponseEntity.badRequest().body("Ten da ton tai");
    	}
    	if (name.trim().isEmpty()) {
    		return ResponseEntity.badRequest().body("Please enter name");
    	}
        Rule rule;
        if (id != null)
            rule = new Rule(id, name);
        else
            rule = new Rule(name);
        rule.setStatus(status);
        if (multipartFile != null && !multipartFile.isEmpty()) {
            String fileName = StringUtils.cleanPath(multipartFile.getOriginalFilename());
            rule.setIcon(fileName);

            Rule savedRule = service.save(rule);
            String uploadDir = "src/main/resources/static/rule_images/";
            
            String environment = env.getProperty("env");
			System.out.println(environment);
			if (environment.equals("development")) {
				uploadDir = "src/main/resources/static/rule_images/";
			} else {
				String filePath = "/opt/tomcat/webapps/ROOT/WEB-INF/classes/static/rule_images/";
				Path uploadPath = Paths.get(filePath);
				if (!Files.exists(uploadPath)) {
					Set<PosixFilePermission> permissions = PosixFilePermissions.fromString("rwxr--r--");
					FileAttribute<Set<PosixFilePermission>> fileAttributes = PosixFilePermissions
							.asFileAttribute(permissions);

					Files.createDirectories(uploadPath, fileAttributes);
				}
				uploadDir = GetResource.getResourceAsFile("static/rule_images/");
				System.out.println(uploadDir);
			}


            FileUploadUtil.saveFile(uploadDir, fileName, multipartFile);

            return ResponseEntity.ok().body(String.valueOf(savedRule.getId()));
        } else {
        	if (id == null) {
        		return ResponseEntity.badRequest().body("please choose image");        		
        	}
            Rule savedRule = service.save(rule);
            return ResponseEntity.ok().body(String.valueOf(savedRule.getId()));
        }
    }

    @DeleteMapping("/rules/delete/{id}")
    public void delete(@PathVariable("id") Integer id) {
        service.deleteById(id);
    }

    @PostMapping("/rules/check_name")
    public String checkName(@Param("id") Integer id, @Param("name") String name) {
        return service.checkName(id, name);
    }
}
