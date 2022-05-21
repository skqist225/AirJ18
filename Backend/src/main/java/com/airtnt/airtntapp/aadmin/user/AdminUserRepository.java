package com.airtnt.airtntapp.aadmin.user;

import java.util.Optional;
import java.util.List;

import com.airtnt.entity.User;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminUserRepository extends JpaRepository<User, Integer> {
    public User findByEmail(String email);
    
    public User findByPhoneNumber(String phoneNumber);
    
    public List<User> findAllByPhoneNumber(String phoneNumber);
    
    public Page<User> findAll(Pageable pageable);
    
    @Query(value="select new com.airtnt.airtntapp.aadmin.user.AdminUserDTO(u.avatar, u.firstName, u.lastName, u.sex, u.birthday, u.email, u.password, u.role, u.phoneNumber, u.about) from User as u where u.id=?1") 
    public AdminUserDTO findUserById(Integer id);
    
    @Query(value="select new com.airtnt.airtntapp.aadmin.user.AddressDTO(u.address.country, u.address.state, u.address.city, u.address.aprtNoAndStreet) from User as u where u.id=?1")
    public AddressDTO findAddressById(Integer id);
    
}
