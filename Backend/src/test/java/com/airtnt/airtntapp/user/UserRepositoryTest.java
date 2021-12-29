package com.airtnt.airtntapp.user;

import com.airtnt.entity.Address;
import com.airtnt.entity.City;
import com.airtnt.entity.Country;
import com.airtnt.entity.State;
import com.airtnt.entity.User;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class UserRepositoryTest {

    @Autowired
    UserRepository userRepository;

    @Test
    public void testVerifyPhoneNumber() {
        int isUpdated = userRepository.verifyPhoneNumber(17);
        System.out.println(isUpdated);
    }

    @Test
    public void testGetAddress() {
        User user = new User(29);
        user.setAddress(new Address(new Country(), new State(), new City(), "abc"));
        assertThat(user.getAddress().getAprtNoAndStreet()).isEqualTo("abc");
    }
}
