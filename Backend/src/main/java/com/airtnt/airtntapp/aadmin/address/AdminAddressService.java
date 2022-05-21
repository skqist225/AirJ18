package com.airtnt.airtntapp.aadmin.address;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.airtnt.entity.Address;

@Service
public class AdminAddressService {
	
	@Autowired
	AdminAddressRepository addressRepository;
	
	public Address saveAddress(Address address) {
		return addressRepository.save(address);
	}
	
	public Address findById(Integer id) {
		return addressRepository.findById(id).get();
	}
}
