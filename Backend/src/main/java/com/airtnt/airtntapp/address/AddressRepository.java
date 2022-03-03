package com.airtnt.airtntapp.address;

import com.airtnt.entity.Address;

import org.springframework.data.repository.CrudRepository;

public interface AddressRepository extends CrudRepository<Address, Integer> {
    Address findById(int id);
}
