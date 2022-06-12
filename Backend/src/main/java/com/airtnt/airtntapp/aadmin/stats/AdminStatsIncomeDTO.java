package com.airtnt.airtntapp.aadmin.stats;

import java.math.BigDecimal;
import java.math.BigInteger;

import javax.persistence.EntityResult;
import javax.persistence.FieldResult;
import javax.persistence.SqlResultSetMapping;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AdminStatsIncomeDTO {
	
	private Integer month;
	private Integer year;
	private BigDecimal income;
	private BigInteger bookingCount;
}
