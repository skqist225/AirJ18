package com.airtnt.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import javax.persistence.*;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Getter
@Setter
@Entity
@Table(name = "rooms")
public class Room extends BaseEntity {

	@Builder
	public Room(int id, String name, Set<Image> images, String thumbnail, byte rating,
			Country country, State state, City city, String street, int bedroomCount, int bathroomCount,
			int accomodatesCount, int bedCount, RoomGroup roomGroup, Currency currency,
			Category category, String description, Set<Amentity> amentities, float latitude, float longitude,
			float price, RoomPrivacy privacyType, PriceType priceType, User host,
			Set<Rule> rules, boolean status) {
		super(status);
		this.name = name;
		this.images = images;
		this.thumbnail = thumbnail;
		this.rating = rating;
		this.country = country;
		this.state = state;
		this.city = city;
		this.bedroomCount = bedroomCount;
		this.bathroomCount = bathroomCount;
		this.accomodatesCount = accomodatesCount;
		this.bedCount = bedCount;
		this.roomGroup = roomGroup;
		this.currency = currency;
		this.category = category;
		this.description = description;
		this.amentities = amentities;
		this.latitude = latitude;
		this.longitude = longitude;
		this.price = price;
		this.privacyType = privacyType;
		this.priceType = priceType;
		this.host = host;
		this.rules = rules;
		this.street = street;
	}

	public Room(int id) {
		super(id);
	}

	public Room() {
	}

	@Column(nullable = false, length = 512)
	private String name;

	@OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
	@JoinColumn(name = "room_id")
	private Set<Image> images = new HashSet<>();

	private String thumbnail;

	@Column(columnDefinition = "smallint")
	private byte rating;

	@ManyToOne
	@JoinColumn(name = "country_id")
	private Country country;  

	@ManyToOne(cascade = CascadeType.PERSIST)
	@JoinColumn(name = "state_id")
	private State state;

	@ManyToOne(cascade = CascadeType.PERSIST)
	@JoinColumn(name = "city_id")
	private City city;

	private String street;

	@Column(nullable = false, columnDefinition = "SMALLINT DEFAULT 0")
	private int bedroomCount;

	@Column(nullable = false, columnDefinition = "SMALLINT DEFAULT 0")
	private int bathroomCount;

	@Column(nullable = false, columnDefinition = "SMALLINT DEFAULT 0")
	private int accomodatesCount;

	@Column(nullable = false, columnDefinition = "SMALLINT DEFAULT 0")
	private int bedCount;

	@ManyToOne
	@JoinColumn(name = "room_group_id")
	private RoomGroup roomGroup;

	@OneToOne
	@JoinColumn(name = "currency_id")
	private Currency currency;

	@ManyToOne
	@JoinColumn(name = "category_id")
	private Category category;

	@Column(columnDefinition = "TEXT NOT NULL")
	private String description;

	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(name = "rooms_amentities", joinColumns = @JoinColumn(name = "room_id"), inverseJoinColumns = @JoinColumn(name = "amentity_id"))
	private Set<Amentity> amentities = new HashSet<>();

	@Column(columnDefinition = "DEFAULT 0")
	private float latitude;

	@Column(columnDefinition = "DEFAULT 0")
	private float longitude;

	@Column(nullable = false)
	private float price;

	@ManyToOne
	@JoinColumn(name = "room_privacy_id")
	private RoomPrivacy privacyType;

	@Enumerated(EnumType.STRING)
	@Column(length = 20, nullable = false)
	private PriceType priceType;

	@ManyToOne
	@JoinColumn(name = "host_id")
	private User host;

	@OneToMany(mappedBy = "room", cascade = CascadeType.REMOVE)
	private List<Booking> bookings;

	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(name = "rooms_rules", joinColumns = @JoinColumn(name = "room_id"), inverseJoinColumns = @JoinColumn(name = "rule_id"))
	private Set<Rule> rules = new HashSet<>();

	@Override
	public String toString() {
		return "Room [name=" + name + ", images=" + images + ", rating=" + rating
				+ ", country=" + country + ", state=" + state + ", city=" + city + ", bedRoomCount=" + bedroomCount
				+ ", bathRoomCount=" + bathroomCount + ", accomodatesCount=" + accomodatesCount + ", bedCount="
				+ bedCount + ", category=" + category + ", description=" + description + ", amentities=" + amentities
				+ ", latitude=" + latitude + ", longtitude=" + longitude + ", price=" + price + ", priceType="
				+ priceType + ", host=" + host + ", rules="
				+ rules + "]";
	}

	@Transient
	public String renderThumbnailImage() {
		return "/room_images/" + this.host.getEmail() + "/" + this.getId() + "/" + this.thumbnail;
	}

	@Transient
	public long calculateHowManyDaysFromPastToCurrent() {
		SimpleDateFormat df1 = new SimpleDateFormat("yyyy");
		SimpleDateFormat df2 = new SimpleDateFormat("MM");
		SimpleDateFormat df3 = new SimpleDateFormat("dd");

		String year = df1.format(this.getUpdatedDate());
		String month = df2.format(this.getUpdatedDate());
		String day = df3.format(this.getUpdatedDate());

		LocalDate dateBefore = LocalDate.of(Integer.parseInt(year), Integer.parseInt(month), Integer.parseInt(day));
		LocalDate currentdate = LocalDate.now();
		LocalDate dateAfter = LocalDate.of(currentdate.getYear(), currentdate.getMonth(), currentdate.getDayOfMonth());
		long noOfDaysBetween = ChronoUnit.DAYS.between(dateBefore, dateAfter);

		return noOfDaysBetween;
	}

}
