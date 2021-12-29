package com.airtnt.airtntapp.rule;

import java.io.IOException;
import java.util.List;

import com.airtnt.airtntapp.FileUploadUtil;
import com.airtnt.entity.Rule;

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

    @PostMapping("/rules/save")
    public String saveRule(@RequestParam(name = "id", required = false) Integer id, @RequestParam("name") String name,
            @RequestParam(name = "ruleImage", required = false) MultipartFile multipartFile,
            @RequestParam("status") Boolean status) throws IOException {
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

            String uploadDir = "../Rule_images";

            FileUploadUtil.saveFile(uploadDir, fileName, multipartFile);

            return String.valueOf(savedRule.getId());
        } else {
            Rule savedRule = service.save(rule);
            return String.valueOf(savedRule.getId());
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
