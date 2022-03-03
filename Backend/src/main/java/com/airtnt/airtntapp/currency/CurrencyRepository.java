package com.airtnt.airtntapp.currency;

import com.airtnt.entity.Currency;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CurrencyRepository extends CrudRepository<Currency, Integer> {
    public Currency findByUnit(String unit);
}
