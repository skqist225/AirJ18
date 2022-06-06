package com.airtnt.entity;

import java.time.LocalDateTime;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "bookings")
public class Booking extends BaseEntity {
	@DateTimeFormat(pattern = "dd-MM-yyyy")
	@JsonFormat(pattern = "dd-MM-yyyy")
	private Date checkinDate;

	@DateTimeFormat(pattern = "dd-MM-yyyy")
	@JsonFormat(pattern = "dd-MM-yyyy")
	private Date checkoutDate;

	@DateTimeFormat(pattern = "dd-MM-yyyy")
	@JsonFormat(pattern = "dd-MM-yyyy")
	private LocalDateTime bookingDate;

	@DateTimeFormat(pattern = "dd-MM-yyyy")
	@JsonFormat(pattern = "dd-MM-yyyy")
	private LocalDateTime cancelDate;

	@Column(columnDefinition = "Decimal(20,2)", nullable = false)
	private float pricePerDay;

	@Column(columnDefinition = "SMALLINT default 0")
	private int numberOfDays;

	@Builder.Default
	@Column(columnDefinition = "boolean default false")
	private boolean isRefund = false;

	@Column(columnDefinition = "Decimal(20,2) default '0.00'")
	private float refundPaid;

	@Column(columnDefinition = "Decimal(20,2)", nullable = false)
	private float siteFee;

	@Column(columnDefinition = "Decimal(20,2)", nullable = false)
	private float cleanFee;

	@Column(columnDefinition = "Decimal(20,2) default '0.00'")
	private float totalFee;

	private boolean isComplete; // 3 state: pending success cancelled

	@ManyToOne
	@JoinColumn(name = "customer_id", nullable = false)
	private User customer;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "room_id", nullable = false)
	private Room room;

	@OneToOne(mappedBy = "booking")
	private Review review;

	private String clientMessage;
	private String userToken;

	@Transient
	long lastUpdated;

	public Booking(Integer bookingId) {
		super(bookingId);
	}
}
