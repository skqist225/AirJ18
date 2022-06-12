package com.airtnt.airtntapp.aadmin.user;

import java.util.Optional;

import javax.persistence.Tuple;

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
    
    @Query(value = "select * from users as u "
    		+ "where MATCH(u.first_name, u.last_name, u.about) "
    		+ "AGAINST (?1)",
    		countQuery = "SELECT count(*) from users as u "
    				+ "where MATCH(u.first_name, u.last_name, u.about) "
    				+ "AGAINST (?1)", 
    		nativeQuery = true)
    public Page<User> findAllWithFullTextSearch(String searchText, Pageable pageable);
    
    @Query(value = "select u from User as u "
    		+ "where u.firstName like %?1% "
    		+ "or u.lastName like %?1% "
    		+ "or u.about like %?1% ")
    public Page<User> findAll(String searchText, Pageable pageable);
    
    public Page<User> findAll(Pageable pageable);
    
    @Query(value="select new com.airtnt.airtntapp.aadmin.user.AdminUserDTO(u.avatar, u.firstName, u.lastName, u.sex, u.birthday, u.email, u.password, u.role, u.phoneNumber, u.about) from User as u where u.id=?1") 
    public AdminUserDTO findUserById(Integer id);
    
    @Query(value="select new com.airtnt.airtntapp.aadmin.user.AddressDTO(u.address.country, u.address.state, u.address.city, u.address.aprtNoAndStreet) from User as u where u.id=?1")
    public AddressDTO findAddressById(Integer id);
    
    @Query(value = "select MONTH(u.created_at) as month, YEAR(u.created_at) as year, count(*) as registerCount from users as u\r\n"
    		+ "where YEAR(u.created_at) >= 2021\r\n"
    		+ "GROUP BY YEAR(u.created_at), MONTH(u.created_at)\r\n"
    		+ "ORDER BY u.created_at asc", nativeQuery = true)
    public List<Tuple> getRegisterStats();
    
}
