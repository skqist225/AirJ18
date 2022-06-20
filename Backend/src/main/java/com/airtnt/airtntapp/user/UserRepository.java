package com.airtnt.airtntapp.user;

import com.airtnt.entity.User;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends CrudRepository<User, Integer> {

    public Optional<User> findByEmail(String email);

    @Modifying
    @Query(value = "UPDATE User u SET u.phoneVerified = true WHERE u.id = ?1")
    public int verifyPhoneNumber(Integer userId);

    public Long countById(Integer id);

    @Query("SELECT u FROM User u WHERE CONCAT(u.id, '', u.email, ' ', u.firstName, ' ', u.lastName) LIKE %?1%")
    public Page<User> findAll(String keyword, Pageable pageable);

    @Query("UPDATE User u SET u.status = ?2 WHERE u.id = ?1")
    @Modifying
    public void updateStatus(Integer id, boolean status);

    public Page<User> findAll(Pageable pageable);

    @Query("SELECT count(*) From User ")
    public Integer getNumberOfUser();

    public Optional<User> findByPhoneNumber(String phoneNumber);
}
