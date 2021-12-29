package com.airtnt.airtntapp.user;

import java.util.List;
import java.util.NoSuchElementException;

import javax.transaction.Transactional;

import com.airtnt.airtntapp.country.CountryRepository;
import com.airtnt.airtntapp.user.admin.RoleRepository;
import com.airtnt.airtntapp.user.admin.UserNotFoundException;
import com.airtnt.entity.Country;
import com.airtnt.entity.Role;
import com.airtnt.entity.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class UserService {
    public static final int USERS_PER_PAGE = 4;

    @Autowired
    private RoleRepository roleRepo;

    @Autowired
    private CountryRepository countryRepo;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public void encodePassword(User user) {
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);
    }

    public boolean isPasswordMatch(String rawPass, String hashPass) {
        return passwordEncoder.matches(rawPass, hashPass);
    }

    public void registerUser(User user) {
        user.setRole(new Role(2));
        encodePassword(user);
        userRepository.save(user);
    }

    public boolean isEmailUnique(Integer id, String email) {
        User userByEmail = userRepository.findByEmail(email);

        if (userByEmail == null)
            return true;

        boolean isCreatingNew = (id == null);

        if (isCreatingNew) { // create
            if (userByEmail != null)
                return false;
        } else { // edit
            if (userByEmail.getId() != id) {
                return false;
            }
        }

        return true;
    }

    public User getByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User getCurrentUser(Integer userId) {
        return userRepository.findById(userId).get();
    }

    @Transactional
    public int verifyPhoneNumber(Integer userId) {
        return userRepository.verifyPhoneNumber(userId);
    }

    public List<User> findAllUsers() {
        return (List<User>) userRepository.findAll();
    }

    public Page<User> listByPage(int pageNum, String sortField, String sortDir, String keyword) {
        Sort sort = Sort.by(sortField);

        sort = sortDir.equals("asc") ? sort.ascending() : sort.descending();

        Pageable pageable = PageRequest.of(pageNum - 1, USERS_PER_PAGE, sort);

        if (keyword != null) {
            return userRepository.findAll(keyword, pageable);
        }

        return userRepository.findAll(pageable);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public User save(User user) {
        boolean isUpdatingUser = (user.getId() != null);
        System.out.println("get called" + System.nanoTime());
        if (isUpdatingUser) {
            User existingUser = userRepository.findById(user.getId()).get();

            if (user.getPassword().isEmpty()) {
                user.setPassword(existingUser.getPassword());
            } else {
                encodePassword(user);
            }
        } else {
            encodePassword(user);
        }

        return userRepository.save(user);
    }

    public List<Role> listRoles() {
        return (List<Role>) roleRepo.findAll();
    }

    public List<Country> listCountries() {
        return (List<Country>) countryRepo.findAll();
    }

    public User get(Integer id) throws UserNotFoundException {
        try {
            return userRepository.findById(id).get();
        } catch (NoSuchElementException ex) {
            throw new UserNotFoundException("Could not find any user with ID " + id);
        }
    }

    public void delete(Integer id) throws UserNotFoundException {
        Long countById = userRepository.countById(id);
        if ((countById == null || countById == 0)) {
            throw new UserNotFoundException("Could not find any user with ID " + id);
        }

        userRepository.deleteById(id);
    }

    public void updateUserEnabledStatus(Integer id, boolean enabled) {
        userRepository.updateStatus(id, enabled);
    }

    public User findById(Integer id) {
        return userRepository.findById(id).get();
    }

    public Integer getNumberOfUser(){
        return userRepository.getNumberOfUser();
    }
}
