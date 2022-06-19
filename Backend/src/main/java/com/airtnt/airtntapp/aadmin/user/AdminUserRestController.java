package com.airtnt.airtntapp.aadmin.user;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.FileAttribute;
import java.nio.file.attribute.PosixFilePermission;
import java.nio.file.attribute.PosixFilePermissions;
import java.rmi.AccessException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Set;

import com.airtnt.airtntapp.FileUploadUtil;
import com.airtnt.airtntapp.aadmin.address.AdminAddressService;
import com.airtnt.airtntapp.aadmin.exception.PasswordNotMatchException;
import com.airtnt.airtntapp.common.GetResource;
import com.airtnt.airtntapp.response.success.OkResponse;
import com.airtnt.entity.Address;
import com.airtnt.entity.City;
import com.airtnt.entity.Country;
import com.airtnt.entity.Sex;
import com.airtnt.entity.State;
import com.airtnt.entity.User;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/admin/api")
public class AdminUserRestController {
	public static final Integer NUMBER_OF_USER_PER_PAGE = 10;
	
	@Autowired
	AdminAddressService addressService;
	
    @Autowired
    AdminUserService userService;

    @Autowired
    Environment env;
    
    @GetMapping("/users")
    public Page<User> findAllUser(
    		@RequestParam("page")int page, 
    		@RequestParam("sortField")String sortField, 
    		@RequestParam("sortDir")String sortDir,
    		@RequestParam("searchText") String searchText
    		) {
    	Pageable pageable = PageRequest.of(page-1, NUMBER_OF_USER_PER_PAGE, Sort.by(sortField).ascending());
        return userService.findAll(searchText, pageable);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<Object> findUserById(@PathVariable Integer id) {
    	if(id<1)return ResponseEntity.badRequest().body("Id must greater than 0!");
    	AdminUserDTO adminUserDTO = userService.findById(id);
    	if(adminUserDTO.getAvatar()!=null) {
    		adminUserDTO.setAvatar("/user_images/" + id + "/" + adminUserDTO.getAvatar());	
    	}else {
    		adminUserDTO.setAvatar("/user_images/default_user_avatar.png");
    	}
        return ResponseEntity.ok().body(adminUserDTO);
    }
    
    @CrossOrigin(origins="http://localhost:3000")
    @PostMapping("/users/add")
    public ResponseEntity<Object> Add(@RequestParam String user,@RequestParam(value="avatar", required=false) MultipartFile avatar) throws IOException {
    	ObjectMapper mapper = new ObjectMapper();
    	AdminUserDTO userDTO = mapper.readValue(user, AdminUserDTO.class);
//    	https://stackoverflow.com/questions/12626502/rollback-transaction-after-test
//    	^                 # start-of-string
//    	(?=.*[0-9])       # a digit must occur at least once
//    	(?=.*[a-z])       # a lower case letter must occur at least once
//    	(?=.*[A-Z])       # an upper case letter must occur at least once
//    	(?=.*[@#$%^&+=])  # a special character must occur at least once
//    	(?=\S+$)          # no whitespace allowed in the entire string
//    	.{8,}             # anything, at least eight places though
//    	$                 # end-of-string
    	
        if(userDTO.getFirstName().isEmpty())
        	return ResponseEntity.badRequest().body("Please Enter FirstName");
        if(userDTO.getLastName().isEmpty())
        	return ResponseEntity.badRequest().body("Please Enter LastName");
        if(userDTO.getSex()== null)
        	return ResponseEntity.badRequest().body("Please Choose Gender");
        if(userDTO.getBirthDay()==null)
        	return ResponseEntity.badRequest().body("Please Enter Birthday");
        if(userDTO.getEmail().isEmpty())
        	return ResponseEntity.badRequest().body("Please Enter Email");
        if(userDTO.getPassword().isEmpty())
        	return ResponseEntity.badRequest().body("Please Enter Password");
        if (!userDTO.getPassword().matches("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,}$"))
        	return ResponseEntity.badRequest().body("Password Should be have at least 1 digit number, 1 lower case letter, 1 upper case letter"
        			+ "1 special character(@#$%^&+=! and no white space allowed, at least 8 places though!!!");
        if(userDTO.getRole()==null)
        	return ResponseEntity.badRequest().body("Please Choose Role");
        if(userDTO.getPhoneNumber().isEmpty())
        	return ResponseEntity.badRequest().body("Please Enter Phone Number");
        if (!userDTO.getPhoneNumber().matches("(84|0[3|5|7|8|9])+([0-9]{8})\\b")) {
        	return ResponseEntity.badRequest().body("PhoneNumber must have right format!!!");
        }
        if (userDTO.getAddress() == null) {
        	return ResponseEntity.badRequest().body("Please Choose Country");
        }
        if(userDTO.getAddress().getCountry()==null)
        	return ResponseEntity.badRequest().body("Please Choose Country");
        if(userDTO.getAddress().getState()==null)
        	return ResponseEntity.badRequest().body("Please Choose State");
        if(userDTO.getAddress().getCity()==null)
        	return ResponseEntity.badRequest().body("Please Choose City");
        if(userDTO.getAddress().getAprtNoAndStreet() == null || userDTO.getAddress().getAprtNoAndStreet().equals(""))
        	return ResponseEntity.badRequest().body("Please Enter Address");
        if(userDTO.getAbout() == null || userDTO.getAbout().isEmpty())
        	return ResponseEntity.badRequest().body("Please Enter About");
        
        Address address = Address.builder()
        		.country(new Country(userDTO.getAddress().getCountry().getId()))	
        		.state(new State(userDTO.getAddress().getState().getId()))
        		.city(new City(userDTO.getAddress().getCity().getId()))
        		.aprtNoAndStreet(userDTO.getAddress().getAprtNoAndStreet())
        		.build()
        		;
        
        Address addressCreated = addressService.saveAddress(address);
    	User userToSave = User.builder()
    			.firstName(userDTO.getFirstName())
    			.lastName(userDTO.getLastName())
    			.password(userDTO.getPassword())
    			.about(userDTO.getAbout())
    			.address(addressCreated)
				.birthday(userDTO.getBirthDay())
				.sex(userDTO.getSex())
				.email(userDTO.getEmail())
				.role(userDTO.getRole())
				.phoneNumber(userDTO.getPhoneNumber())
    			.build();
    	 
    	if(avatar!=null) {
			userToSave.setAvatar(StringUtils.cleanPath(avatar.getOriginalFilename()));
    	}
        
        User userSaved = userService.addUser(userToSave);
    	
    	if (avatar != null) {
			String fileName = StringUtils.cleanPath(avatar.getOriginalFilename());
			String uploadDir = "src/main/resources/static/user_images" + "/" + userSaved.getId() + "/";
			
			String environment = env.getProperty("env");
			System.out.println(environment);
			if (environment.equals("development")) {
				uploadDir = "src/main/resources/static/user_images" + "/" + userSaved.getId() + "/";
			} else {
				String filePath = "/opt/tomcat/webapps/ROOT/WEB-INF/classes/static/user_images" + "/" + userSaved.getId() + "/";
				Path uploadPath = Paths.get(filePath);
				if (!Files.exists(uploadPath)) {
					Set<PosixFilePermission> permissions = PosixFilePermissions.fromString("rwxr--r--");
					FileAttribute<Set<PosixFilePermission>> fileAttributes = PosixFilePermissions
							.asFileAttribute(permissions);

					Files.createDirectories(uploadPath, fileAttributes);
				}
				uploadDir = GetResource.getResourceAsFile("static/user_images" + "/" + userSaved.getId()) + "/";
				System.out.println(uploadDir);
			}
			
			FileUploadUtil.cleanDir(uploadDir);
			FileUploadUtil.saveFile(uploadDir, fileName, avatar);

		}
        
        return ResponseEntity.ok().body(userSaved);
    }
    
    @CrossOrigin(origins="http://localhost:3000")
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Object> Delete(@PathVariable Integer id){
    	if(id<1)return ResponseEntity.badRequest().body("Id must greater than 0!");
    	
    	if(userService.deleteUserById(id))
    		return ResponseEntity.ok().body("Xoa Thanh Cong");
    	return ResponseEntity.badRequest().body("Xoa That Bai");
    }
    
    @GetMapping(value = "/image/{imageUrl}", produces = MediaType.IMAGE_JPEG_VALUE)
    public ResponseEntity<Resource> image(@PathVariable String imageUrl) throws IOException {
        final ByteArrayResource inputStream = new ByteArrayResource(Files.readAllBytes(Paths.get(imageUrl)));
        return ResponseEntity
                .status(HttpStatus.OK)
                .contentLength(inputStream.contentLength())
                .body(inputStream);

    }
    
    @CrossOrigin(origins="http://localhost:3000")
    @PostMapping("/users/edit")
    public ResponseEntity<Object> Edit(@RequestParam String user,@RequestParam(value="avatar", required=false) MultipartFile avatar,
    		@RequestParam Integer id) throws IOException {
    	ObjectMapper mapper = new ObjectMapper();
    	AdminUserDTO userDTO = mapper.readValue(user, AdminUserDTO.class);
//    	https://stackoverflow.com/questions/12626502/rollback-transaction-after-test
//    	^                 # start-of-string
//    	(?=.*[0-9])       # a digit must occur at least once
//    	(?=.*[a-z])       # a lower case letter must occur at least once
//    	(?=.*[A-Z])       # an upper case letter must occur at least once
//    	(?=.*[@#$%^&+=])  # a special character must occur at least once
//    	(?=\S+$)          # no whitespace allowed in the entire string
//    	.{8,}             # anything, at least eight places though
//    	$                 # end-of-string
    	
        if(userDTO.getFirstName().isEmpty())
        	return ResponseEntity.badRequest().body("Please Enter FirstName");
        if(userDTO.getLastName().isEmpty())
        	return ResponseEntity.badRequest().body("Please Enter LastName");
        if(userDTO.getSex()== null)
        	return ResponseEntity.badRequest().body("Please Choose Gender");
        if(userDTO.getBirthDay()==null)
        	return ResponseEntity.badRequest().body("Please Enter Birthday");
        if(userDTO.getEmail().isEmpty())
        	return ResponseEntity.badRequest().body("Please Enter Email");
        if(userDTO.getPassword().isEmpty())
        	return ResponseEntity.badRequest().body("Please Enter Password");
        if (!userDTO.getPassword().matches("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,}$"))
        	return ResponseEntity.badRequest().body("Password Should be have at least 1 digit number, 1 lower case letter, 1 upper case letter"
        			+ "1 special character(@#$%^&+=! and no white space allowed, at least 8 places though!!!");
        if(userDTO.getRole()==null)
        	return ResponseEntity.badRequest().body("Please Choose Role");
        if(userDTO.getPhoneNumber().isEmpty())
        	return ResponseEntity.badRequest().body("Please Enter Phone Number");
        if (!userDTO.getPhoneNumber().matches("(84|0[3|5|7|8|9])+([0-9]{8})\\b")) {
        	return ResponseEntity.badRequest().body("PhoneNumber must have right format!!!");
        }
        if (userDTO.getAddress() == null) {
        	return ResponseEntity.badRequest().body("Please Choose Country");
        }
        if(userDTO.getAddress().getCountry()==null)
        	return ResponseEntity.badRequest().body("Please Choose Country");
        if(userDTO.getAddress().getState()==null)
        	return ResponseEntity.badRequest().body("Please Choose State");
        if(userDTO.getAddress().getCity()==null)
        	return ResponseEntity.badRequest().body("Please Choose City");
        if(userDTO.getAddress().getAprtNoAndStreet() == null || userDTO.getAddress().getAprtNoAndStreet().equals(""))
        	return ResponseEntity.badRequest().body("Please Enter Address");
        if(userDTO.getAbout() == null || userDTO.getAbout().isEmpty())
        	return ResponseEntity.badRequest().body("Please Enter About");
        
        Address address = Address.builder()
        		.country(new Country(userDTO.getAddress().getCountry().getId()))	
        		.state(new State(userDTO.getAddress().getState().getId()))
        		.city(new City(userDTO.getAddress().getCity().getId()))
        		.aprtNoAndStreet(userDTO.getAddress().getAprtNoAndStreet())
        		.build()
        		;
        
        Address addressCreated = addressService.saveAddress(address);
        User userToSave = userService.findUserById(id);
        userToSave.setFirstName(userDTO.getFirstName());
        userToSave.setLastName(userDTO.getLastName());
        userToSave.setPassword(userDTO.getPassword());
        userToSave.setAbout(userDTO.getAbout());
        userToSave.setAddress(addressCreated);
        userToSave.setBirthday(userDTO.getBirthDay());
        userToSave.setSex(userDTO.getSex());
        userToSave.setEmail(userDTO.getEmail());
        userToSave.setRole(userDTO.getRole());
		userToSave.setPhoneNumber(userDTO.getPhoneNumber());
    	userToSave.setId(id);
        
    	if(avatar!=null) {
			userToSave.setAvatar(StringUtils.cleanPath(avatar.getOriginalFilename()));
    	}else {
    		//userToSave.setAvatar(userDTO.getAvatar());
    	}
        
        User userSaved = userService.editUser(userToSave);
    	
    	if (avatar != null) {
			String fileName = StringUtils.cleanPath(avatar.getOriginalFilename());
			String uploadDir = "src/main/resources/static/user_images" + "/" + userSaved.getId() + "/";
			
			String environment = env.getProperty("env");
			System.out.println(environment);
			if (environment.equals("development")) {
				uploadDir = "src/main/resources/static/user_images" + "/" + userSaved.getId() + "/";
			} else {
				String filePath = "/opt/tomcat/webapps/ROOT/WEB-INF/classes/static/user_images" + "/" + userSaved.getId() + "/";
				Path uploadPath = Paths.get(filePath);
				if (!Files.exists(uploadPath)) {
					Set<PosixFilePermission> permissions = PosixFilePermissions.fromString("rwxr--r--");
					FileAttribute<Set<PosixFilePermission>> fileAttributes = PosixFilePermissions
							.asFileAttribute(permissions);

					Files.createDirectories(uploadPath, fileAttributes);
				}
				uploadDir = GetResource.getResourceAsFile("static/user_images" + "/" + userSaved.getId() + "/");
				System.out.println(uploadDir);
			}
			
			FileUploadUtil.cleanDir(uploadDir);
			FileUploadUtil.saveFile(uploadDir, fileName, avatar);

		}
        
        return ResponseEntity.ok().body(userSaved);
    }
    
    @PostMapping("users/{id}/change_status")
    public ResponseEntity<Object> changeStatus(@PathVariable Integer id){
    	userService.changeStatus(id);
    	return ResponseEntity.ok().body("Success");
    }
}
