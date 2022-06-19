package com.airtnt.airtntapp.aadmin.user;

import java.util.List;
import java.util.Optional;

import com.airtnt.airtntapp.aadmin.address.AdminAddressRepository;
import com.airtnt.airtntapp.aadmin.booking.AdminBookingRepository;
import com.airtnt.airtntapp.aadmin.exception.EmailConflictException;
import com.airtnt.airtntapp.aadmin.exception.ForeignKeyConstraintException;
import com.airtnt.airtntapp.aadmin.exception.PasswordNotMatchException;
import com.airtnt.airtntapp.aadmin.exception.PhoneNumberAlreadyUseException;
import com.airtnt.airtntapp.aadmin.exception.UserNotFoundException;
import com.airtnt.entity.Booking;
import com.airtnt.entity.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class AdminUserService {
    @Autowired
    AdminUserRepository userRepository;
    
    @Autowired
    AdminBookingRepository bookingRepository;

    public Page<User> findAll(String searchText, Pageable pageable) {
    	if (searchText != null && searchText != "")
    		return (Page<User>) userRepository.findAll(searchText, pageable);
    	else {
    		return (Page<User>) userRepository.findAll(pageable);
    	}
        
    }

    public AdminUserDTO findById(Integer id) {
        AdminUserDTO adminUserDTO = userRepository.findUserById(id);
        AddressDTO addressDTO = userRepository.findAddressById(id);
        adminUserDTO.setAddress(addressDTO);
        
        if(adminUserDTO == null)
        	throw new UserNotFoundException("Khong tim thay User!");
        else
        	return adminUserDTO;
    }

    public Boolean updateUser(User user) {
        Optional<User> userCurr;
        try {
            userCurr = userRepository.findById(user.getId());
        } catch (IllegalArgumentException exception) {
            return false;
        }
        if (userCurr.isEmpty())
            return false;
        else {
            userRepository.save(user);
            return true;
        }
    }

    public Boolean deleteUser(User user) {
        Optional<User> userCurr;
        try {
            userCurr = userRepository.findById(user.getId());
        } catch (IllegalArgumentException exception) {
            return false;
        }
        if (userCurr.isEmpty())
            return false;
        else {
            userRepository.deleteById(user.getId());
            return true;
        }
    }

    public User addUser(User user) {
        User userCheck;
        userCheck = userRepository.findByEmail(user.getEmail());
        
        if (userCheck != null) 
            throw new EmailConflictException("Email da ton tai!");
        
        User list = userRepository.findByPhoneNumber(user.getPhoneNumber());
        if (list!=null) 
            throw new PhoneNumberAlreadyUseException("So dien thoai da duoc su dung!");
        
        User userSaved = userRepository.save(user);
        
        return userSaved;
    }
    
    public Boolean deleteUserById(Integer id) {
    	
    	Optional<User> userById = userRepository.findById(id);
    	if(userById.isEmpty())
    		throw new UserNotFoundException("Khong tim thay user de xoa!");
    	
    	if(!userById.get().getOwnedRooms().isEmpty())
    		throw new ForeignKeyConstraintException("User co owner room. Khong the xoa!");
 
    	if(!userById.get().getFavRooms().isEmpty())
    		throw new ForeignKeyConstraintException("User co favourite room. Khong the xoa!");
    	
    	List<Booking> bookingById = bookingRepository.findByCustomer(userById.get());
    	
    	if (!bookingById.isEmpty()) {
    		throw new ForeignKeyConstraintException("User co booking. Khong the xoa!");
    	}
    	
    	userRepository.deleteById(id);
    	return true;
    }
    
    public User editUser(User user) {
        User userCheck;
        userCheck = userRepository.findByEmail(user.getEmail());
        
        if (userCheck != null && userCheck.getId()!=user.getId()) 
            throw new EmailConflictException("Email da ton tai!");
        
        List<User> list = userRepository.findAllByPhoneNumber(user.getPhoneNumber());
        System.out.println(user.getPhoneNumber());
        Boolean isOldPhone = false;
        for(int i = 0; i < list.size(); i++) {
        	if(list.get(i).getId() == user.getId()) {
        		isOldPhone = true;
        		break;
        	}
        }
        if (list.size() > 0 && !isOldPhone)
            throw new PhoneNumberAlreadyUseException("So dien thoai da duoc su dung!");
        
        User userSaved = userRepository.save(user);
        
        return userSaved;
    }
    
    public void changeStatus(Integer id) {
    	User user = userRepository.findById(id).get();
    	user.setStatus(!user.isStatus());
    	userRepository.save(user);
    }
    
    public User findUserById(Integer id) {
    	User user = userRepository.findById(id).get();
        
        if(user == null)
        	throw new UserNotFoundException("Khong tim thay User!");
        else
        	return user;
    }
}
