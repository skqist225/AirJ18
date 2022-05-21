package com.airtnt.airtntapp.aadmin.address;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.airtnt.entity.Address;

@Repository
public interface AdminAddressRepository extends JpaRepository<Address, Integer> {
	
}
