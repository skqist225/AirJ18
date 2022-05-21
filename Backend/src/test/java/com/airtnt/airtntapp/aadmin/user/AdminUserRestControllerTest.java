package com.airtnt.airtntapp.aadmin.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import com.airtnt.entity.User;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.module.paramnames.ParameterNamesModule;
import com.airtnt.entity.Sex;
import com.airtnt.entity.Address;
import com.airtnt.entity.Role;
import com.airtnt.entity.Country;
import com.airtnt.entity.State;
import com.airtnt.entity.City;

import java.time.LocalDate;
import java.util.Date;

import org.junit.jupiter.api.Test;

@Transactional
@SpringBootTest
@AutoConfigureMockMvc
public class AdminUserRestControllerTest {

    @Autowired
    private MockMvc mvc;

    @Test
    public void testGetUser() throws Exception {
        assertNotNull(mvc);
        this.mvc.perform(get("/admin/api/users")).andExpect(status().isOk());
    }

    @Test
    public void testPostUserWithWeakPassword() throws Exception {
        assertNotNull(mvc);
        this.mvc.perform(post("/admin/api/users/add")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                        asJsonString(
                                AdminUserDTO.builder()
                                        .avatar("/user_images/2/avatar.png")
                                        .firstName("firstname")
                                        .lastName("lastname")
                                        .sex(Sex.MALE)
                                        .birthday(LocalDate.of(2000, 1, 1))
                                        .email("minhthongtest@gmail.com")
                                        .password("123456789")
                                        .role(new Role(3, "Admin"))
                                        .phoneNumber("0826879111")
                                        .supremeHost(false)
                                        .phoneVerified(false)
                                        .about("test them user moi")
                                        .build())
                		)
                .accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status()
                        .isBadRequest())
                .andExpect(content().string("Password khong dung dinh dang!"));
        
    }

    @Test
	public void TestPostUserWithEmailConflict() throws Exception {
		assertNotNull(mvc);
		this.mvc.perform(post("/admin/api/users/add")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                        asJsonString(
                                AdminUserDTO.builder()
                                        .avatar("/user_images/2/avatar.png")
                                        .firstName("firstname")
                                        .lastName("lastname")
                                        .sex(Sex.MALE)
                                        .birthday(LocalDate.of(2000, 1, 1))
                                        .email("minhthong774@gmail.com")
                                        .password("123456789tH@")
                                        .role(new Role(3, "Admin"))
                                        .phoneNumber("0826879111")
//                                        .address(new Address(new Country(216), new State(120), new City(8928),
//                                                "97 Man Thiện, Phường Hiệp Phú"))
                                        .supremeHost(false)
                                        .phoneVerified(false)
                                        .about("test them user moi")
                                        .build())
                		)
                .accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status()
                        .isBadRequest())
                .andExpect(content().string("Email da ton tai!"));
	}
    
    @Test
	public void TestPostUserSuccess() throws Exception {
		assertNotNull(mvc);
		this.mvc.perform(post("/admin/api/users/add")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                        asJsonString(
                                AdminUserDTO.builder()
                                        .avatar("/user_images/2/avatar.png")
                                        .firstName("firstname")
                                        .lastName("lastname")
                                        .sex(Sex.MALE)
                                        .birthday(LocalDate.of(2000, 1, 1))
                                        .email("emailTestPostSuccess@gmail.com")
                                        .password("123456789tH@")
                                        .role(new Role(3, "Admin"))
                                        .phoneNumber("0826879111")
//                                        .address(new Address(new Country(216), new State(120), new City(8928),
//                                                "97 Man Thiện, Phường Hiệp Phú"))
                                        .supremeHost(false)
                                        .phoneVerified(false)
                                        .about("test them user moi")
                                        .build())
                		)
                .accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status()
                        .isOk());
	}

    public static String asJsonString(final Object obj) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            mapper.findAndRegisterModules();
            System.out.print("json" + mapper.writeValueAsString(obj));
            return mapper.writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
    
    @Test
    public void TestDeleteUserWithIdLostRange() throws Exception {
    	assertNotNull(mvc);
    	this.mvc.perform(delete("/admin/api/users/-1"))
    		.andDo(print())
    		.andExpect(status()
    				.isBadRequest())
    		.andExpect(content().string("Id must greater than 0!"));
    	
    }
    
    @Test
    public void TestDeleteUserWithIdNotFound() throws Exception {
    	assertNotNull(mvc);
    	this.mvc.perform(delete("/admin/api/users/1"))
    		.andDo(print())
    		.andExpect(status()
    				.isBadRequest())
    		.andExpect(content().string("Khong tim thay user de xoa!"));
    	
    }
    
    @Test
    public void TestDeleteUserHaveOwnerRoom() throws Exception{
    	assertNotNull(mvc);
    	this.mvc.perform(delete("/admin/api/users/29"))
    		.andDo(print())
    		.andExpect(status()
    				.isBadRequest())
    		.andExpect(content().string("User co owner room. Khong the xoa!"));
    }
    
    @Test
    public void TestDeleteUserHaveFavouriteRoom() throws Exception{
    	assertNotNull(mvc);
    	this.mvc.perform(delete("/admin/api/users/17"))
    		.andDo(print())
    		.andExpect(status()
    				.isBadRequest())
    		.andExpect(content().string("User co favourite room. Khong the xoa!"));
    }
}
