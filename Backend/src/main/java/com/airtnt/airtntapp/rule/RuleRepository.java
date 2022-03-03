package com.airtnt.airtntapp.rule;

import com.airtnt.entity.Rule;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RuleRepository extends CrudRepository<Rule, Integer> {
    public Rule findByTitle(String title);

}
