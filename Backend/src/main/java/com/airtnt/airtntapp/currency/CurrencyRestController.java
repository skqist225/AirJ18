package com.airtnt.airtntapp.currency;

import java.util.List;

import com.airtnt.entity.Currency;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
public class CurrencyRestController {
    @Autowired
    CurrencyRepository repo;

    @GetMapping("/currencies/list")
    public List<Currency> listAll() {
        return (List<Currency>) repo.findAll();
    }

    @GetMapping("/currencies/{id}")
    public Currency getById(
            @PathVariable("id") Integer id) {
        return repo.findById(id).get();
    }

    @PostMapping("/currencies/save")
    public String save(@RequestBody Currency currency) {
        Currency savedCurrency = repo.save(currency);
        return String.valueOf(savedCurrency.getId());
    }

    @DeleteMapping("/currencies/delete/{id}")
    public void delete(@PathVariable("id") Integer id) {
        repo.deleteById(id);
    }

    @PostMapping("/currencies/check_unit")
    public String checkName(@Param("id") Integer id,
            @Param("unit") String unit) {
        Currency currency = repo.findByUnit(unit);

        if (currency == null)
            return "OK";

        if (id != null && currency.getId() == id)
            return "OK";

        return "Duplicated";
    }
}
