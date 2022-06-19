package com.airtnt.airtntapp.room;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.Set;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Expression;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.transaction.Transactional;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.query.QueryUtils;
import org.springframework.stereotype.Service;

import com.airtnt.airtntapp.FileUploadUtil;
import com.airtnt.airtntapp.amentity.AmentityService;
import com.airtnt.airtntapp.amentity.dto.AmenityRoomDetailsDTO;
import com.airtnt.airtntapp.city.CityRepository;
import com.airtnt.airtntapp.exception.RoomNotFoundException;
import com.airtnt.airtntapp.privacy.PrivacyTypeRepository;
import com.airtnt.airtntapp.room.dto.RoomPricePerCurrencyDTO;
import com.airtnt.airtntapp.state.StateRepository;
import com.airtnt.airtntapp.user.UserRepository;
import com.airtnt.entity.Amentity;
import com.airtnt.entity.Category;
import com.airtnt.entity.City;
import com.airtnt.entity.Country;
import com.airtnt.entity.Image;
import com.airtnt.entity.Room;
import com.airtnt.entity.RoomGroup;
import com.airtnt.entity.RoomPrivacy;
import com.airtnt.entity.State;
import com.airtnt.entity.User;
import com.airtnt.entity.PriceType;

@Service
@Transactional
public class RoomService {
	public static final int MAX_ROOM_PER_FETCH = 40;
	public static final int MAX_ROOM_PER_FETCH_BY_HOST = 100;
	public static final int ROOMS_PER_PAGE = 10;

	@Autowired
	private RoomRepository roomRepository;

	@Autowired
	private PrivacyTypeRepository privacyTypeRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private StateRepository stateRepository;

	@Autowired
	private CityRepository cityRepository;

	@Autowired
	private EntityManager entityManager;
	
	@Autowired
	private AmentityService amentityService;

	public Room save(Room room) {
		return roomRepository.save(room);
	}

	public List<Room> getRoomsByHostId(User host) {
		Iterator<Room> itr = roomRepository.findByHost(host).iterator();
		List<Room> rooms = new ArrayList<>();
		itr.forEachRemaining(rooms::add);
		return rooms;
	}

	public Room getRoomById(int id) {
		Optional<Room> optionalRoom = roomRepository.findById(id);
		Room room = new Room();
		if (optionalRoom.isPresent()) {
			room = optionalRoom.get();
		}

		return room;
	}

	public Page<Room> getRoomsByHost(User host, int pageNumber, Map<String, String> filters) {
		/*-------------------------------------------FILTER KEY------------------------------------------------*/
		int bedroomCount = Integer.parseInt(filters.get("bedroomCount"));
		int bathroomCount = Integer.parseInt(filters.get("bathroomCount"));
		int bedCount = Integer.parseInt(filters.get("bedCount"));
		String roomName = filters.get("query");
		String sortDir = filters.get("sortDir");
		String sortField = filters.get("sortField");

		/*-------------------------------------------FILTER KEY------------------------------------------------*/

		List<Integer> amentitiesID = new ArrayList<>();
		List<Boolean> statusesID = new ArrayList<>();

		if (!filters.get("amentities").isEmpty()) {
			String[] amentities = filters.get("amentities").split(" ");

			for (int i = 0; i < amentities.length; i++) {
				amentitiesID.add(Integer.parseInt(amentities[i]));
			}
		}

		if (!filters.get("status").isEmpty()) {
			String[] statuses = filters.get("status").split(" ");

			for (int i = 0; i < statuses.length; i++) {
				if (statuses[i].equals("ACTIVE")) {
					statusesID.add(true);
				}
				if (statuses[i].equals("UNLISTED")) {
					statusesID.add(false);
				}
			}
		}

		Sort sort = Sort.by(sortField);
		if (sortField.equals("location")) {
			Sort sortByCountry = Sort.by("country.name");
			Sort sortByState = Sort.by("state.name");
			Sort sortByCity = Sort.by("city.name");
			sort = sortByCountry.and(sortByState.and(sortByCity));
		}
		if (sortField.equals("lastModified")) {
			sort = Sort.by("updatedDate");
		}
		if (sortField.equals("category-name")) {
			sort = Sort.by("category.name");
		}

		sort = sortDir.equals("asc") ? sort.ascending() : sort.descending();
		Pageable pageable = PageRequest.of(pageNumber - 1, 100000, sort); // pase base 0

		/*-----------------------------OUPUT FILTER OPTION--------------------------------------------------- */
		for (Map.Entry<String, String> key : filters.entrySet()) {
			System.out.println("key: " + key.getKey() + " value: " + key.getValue());
		}
		/*-----------------------------OUPUT FILTER OPTION--------------------------------------------------- */

		if (amentitiesID.size() == 0) {
			return roomRepository.findAll(new Specification<Room>() {
				@Override
				public Predicate toPredicate(Root<Room> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
					List<Predicate> predicates = new ArrayList<>();

					predicates.add(criteriaBuilder.and(criteriaBuilder.equal(root.get("host"), host)));
					predicates.add(criteriaBuilder.and(criteriaBuilder.like(root.get("name"), "%" + roomName + "%")));
					predicates.add(criteriaBuilder
							.and(criteriaBuilder.greaterThanOrEqualTo(root.get("bedroomCount"), bedroomCount)));
					predicates.add(criteriaBuilder
							.and(criteriaBuilder.greaterThanOrEqualTo(root.get("bathroomCount"), bathroomCount)));
					predicates.add(
							criteriaBuilder.and(criteriaBuilder.greaterThanOrEqualTo(root.get("bedCount"), bedCount)));
					Expression<Boolean> status = root.get("status");
					Predicate predicate = status.in(statusesID);
					predicates.add(predicate);

					return criteriaBuilder.and(predicates.toArray(new Predicate[predicates.size()]));
				}
			}, pageable);
		}

		Page<Room> rooms = roomRepository.getRoomsByHost(host, roomName, bedroomCount, bathroomCount, bedCount,
				amentitiesID, statusesID, pageable);
		return rooms;
	}

	// public Page<Room> getRoomsByCategoryId(Integer categoryId, boolean status,
	// int pageNumber,
	// Map<String, String> filters) throws ParseException {

	// }

	public Page<Room> getRoomsByCategoryId(Integer categoryId, boolean status, int pageNumber,
			Map<String, String> filters) throws ParseException {
		float minPrice = Float.parseFloat(filters.get("minPrice"));
		float maxPrice = Float.parseFloat(filters.get("maxPrice"));
		int bedroomCount = Integer.parseInt(filters.get("bedRoom"));
		int bedCount = Integer.parseInt(filters.get("bed"));
		int bathroomCount = Integer.parseInt(filters.get("bathRoom"));
		String query = filters.get("query");
		// default case for amenities and privacies
		List<Integer> amentitiesID = new ArrayList<>();
		List<Integer> privaciesID = privacyTypeRepository.getPrivacyIDs();
		List<Date> bookingDates = new ArrayList<>();

		if (!filters.get("privacies").isEmpty()) {
			privaciesID.removeAll(privaciesID);
			String[] privacies = filters.get("privacies").split(" ");

			for (int i = 0; i < privacies.length; i++)
				privaciesID.add(Integer.parseInt(privacies[i]));
		}

		if (!filters.get("amenities").isEmpty()) {
			String[] amentities = filters.get("amenities").split(" ");

			for (int i = 0; i < amentities.length; i++)
				amentitiesID.add(Integer.parseInt(amentities[i]));
		}

		if (!filters.get("bookingDates").isEmpty()) {
			String[] bDates = filters.get("bookingDates").split(" ");

			for (int i = 0; i < bDates.length; i++) {
				Date date = new SimpleDateFormat("yyyy-MM-dd").parse(bDates[i]);
				bookingDates.add(date);
			}
		}

		Pageable pageable = PageRequest.of(pageNumber - 1, MAX_ROOM_PER_FETCH);

		if (bookingDates.size() > 0) {
			if (amentitiesID.size() > 0) {
				return roomRepository.getRoomByCategoryAndConditions(categoryId, status, minPrice, maxPrice,
						bedroomCount, bedCount, bathroomCount, privaciesID, amentitiesID, bookingDates, query,
						pageable);
			} else {
				return roomRepository.getRoomByCategoryAndConditions(categoryId, status, minPrice, maxPrice,
						bedroomCount, bedCount, bathroomCount, privaciesID, bookingDates, query, pageable);
			}

		} else
			return roomRepository.getRoomByCategoryAndConditions(categoryId, status, minPrice, maxPrice, bedroomCount,
					bedCount, bathroomCount, privaciesID, query, pageable);
	}

	public int updateRoomStatus(Integer roomId) {
		return roomRepository.updateRoomStatus(roomId);
	}

	public int completeRentalProcess(Integer roomId) {
		return updateRoomStatus(roomId);
	}

	public void deleteRoom(Integer roomId) {
		Room room = roomRepository.getById(roomId);
		room.getAmentities().clear();
		room.getImages().clear();

		User host = userRepository.findById(room.getHost().getId()).get();
		host.removeFromWishLists(room);

		String uploadPath = "../room_images/" + room.getHost().getEmail() + "/" + room.getId();
		try {
			roomRepository.delete(room);
			FileUploadUtil.removeDir(uploadPath);
		} catch (Exception e) {
			System.out.println(e.getMessage());
		}
	}

	public String updateField(Integer roomId, String fieldName, Map<String, String> values) {
		Room room = roomRepository.getById(roomId);

		System.out.println("field name: " + fieldName);
		switch (fieldName) {
		case "name": {
			room.setName(values.get(fieldName));
			break;
		}
		case "roomInfo": {
			room.setBedCount(Integer.parseInt(values.get("bedCount")));
			room.setBedroomCount(Integer.parseInt(values.get("bedroomCount")));
			room.setBathroomCount(Integer.parseInt(values.get("bathroomCount")));
			break;
		}
		case "groupAndTypeAndPrivacy": {
			room.setRoomGroup(new RoomGroup(Integer.parseInt(values.get("roomGroup"))));
			room.setCategory(new Category(Integer.parseInt(values.get("category"))));
			room.setPrivacyType(new RoomPrivacy(Integer.parseInt(values.get("roomPrivacy"))));
			break;
		}
		case "location": {
			Country country = new Country(216);
			State state = new State(values.get("state"), country);
			City city = new City(values.get("city"), state);

			State state2;
			state2 = stateRepository.findByName(values.get("state"));
			if (state2 == null)
				state2 = stateRepository.save(state);

			City city2;
			city2 = cityRepository.findByName(values.get("city"));
			if (city2 == null)
				city2 = cityRepository.save(city);

			System.out.println(values.get("country"));
			System.out.println(values.get("city"));
			System.out.println(values.get("state"));
			System.out.println(values.get("street"));

			room.setCountry(country);
			room.setState(state2);
			room.setCity(city2);
			room.setStreet(values.get("street"));
			break;
		}
		case "status": {
			int request = Integer.parseInt(values.get("status"));

			if (request == 1) {
				room.setStatus(true);
			} else if (request == 0) {
				room.setStatus(false);
			} else {
				try {
					roomRepository.delete(room);
					return "Delete successfully";
				} catch (Exception e) {
					return "Delete fail";
				}
			}
			break;
		}
		case "amentities": {

			Set<Amentity> updatedAmentities = new HashSet<Amentity>();
			List<Amentity> amentities = amentityService.getAllAmentities();
			for(Amentity a : amentities) {
				updatedAmentities.add(a);
			}

			String[] checkedArr = values.get("checked").split(",");
			String[] uncheckedArr = values.get("unchecked").split(",");

			System.out.println("checked");
			for (String s : checkedArr)
				System.out.println(s);

			System.out.println("unchecked");
			for (String s : uncheckedArr)
				System.out.println(s);
			
			for(Amentity amentity : amentities) {
				if(values.get("unchecked").contains(amentity.getId().toString())) {
					updatedAmentities.remove(amentity);
				}
			}
			
			for(Amentity amentity : amentities) {
				if(values.get("checked").contains(amentity.getId().toString())) {
					updatedAmentities.add(amentity);
				}
			}

			room.setAmentities(updatedAmentities);
			break;
		}
		case "thumbnail": {
//			room.getImages().remove(new Image(values.get("thumbnail")));
			boolean isHaving = false;
			for (Image image : room.getImages()) {
				if (image.getImage().equals(room.getThumbnail())) {
					isHaving = true;
					break;
				}
			}
			if (!isHaving) {
				room.getImages().add(new Image(room.getThumbnail()));
			}

			System.out.println("updated thumbnail: " + values.get("thumbnail"));
			room.setThumbnail(values.get("thumbnail"));
			break;
		}
		case "description": {
			room.setDescription(values.get("description"));
			break;
		}
		}

		Room savedRoom = roomRepository.save(room);
		return savedRoom != null ? "OK" : "ERROR";
	}

	public Room getById(int id) throws RoomNotFoundException {
		try {
			return roomRepository.getById(id);
		} catch (NoSuchElementException ex) {
			throw new RoomNotFoundException("could not find room with id: " + id);
		}
	}

	public Page<Room> listByPage(int pageNum, String sortField, String sortDir, String keyword) {
		Sort sort = Sort.by(sortField);

		sort = sortDir.equals("asc") ? sort.ascending() : sort.descending();

		Pageable pageable = PageRequest.of(pageNum - 1, ROOMS_PER_PAGE, sort);

		if (keyword != null) {
			return roomRepository.findAll(keyword, pageable);
		}

		return roomRepository.findAll(pageable);
	}

	public boolean isNameUnique(Integer id, String name) {
		Room room = roomRepository.findByName(name);

		if (room == null)
			return true;

		boolean isCreatingNew = (id == null);

		if (isCreatingNew) {
			if (room != null)
				return false;
		} else {
			if (room.getId() != id) {
				return true;
			}
		}

		return true;
	}

	public void updateRoomEnabledStatus(Integer id, Boolean status) {
		roomRepository.updateStatus(id, status);
	}

	public void deleteRoomAdmin(Integer id) throws RoomNotFoundException {
		Long countById = roomRepository.countById(id);
		if ((countById == null || countById == 0)) {
			throw new RoomNotFoundException("Could not find any room with ID " + id);
		}

		roomRepository.deleteById(id);
	}

	public Integer getNumberOfRoom() {
		return roomRepository.getNumberOfRoom();
	}

	public List<Integer> getLikedUsers(Integer roomId) {
		return roomRepository.getLikedUsers(roomId);
	}

	public Page<Room> fetchUserOwnedRooms(User host, Integer pageNumber, Map<String, String> filters) {
		/*-------------------------------------------FILTER KEY------------------------------------------------*/
		int bedroomCount = Integer.parseInt(filters.get("bedroomCount"));
		int bathroomCount = Integer.parseInt(filters.get("bathroomCount"));
		int bedCount = Integer.parseInt(filters.get("bedCount"));
		String query = filters.get("query");
		String sortDir = filters.get("sortDir");
		String sortField = filters.get("sortField");

		/*-----------------------------OUPUT FILTER OPTION--------------------------------------------------- */
		for (Map.Entry<String, String> key : filters.entrySet()) {
			System.out.println("key: " + key.getKey() + ", value: " + key.getValue());
		}
		/*-----------------------------OUPUT FILTER OPTION--------------------------------------------------- */

		/*-------------------------------------------FILTER KEY------------------------------------------------*/

		Sort sort = Sort.by(sortField);
		if (sortField.equals("location")) {
			Sort sortByCountry = Sort.by("country.name");
			Sort sortByState = Sort.by("state.name");
			Sort sortByCity = Sort.by("city.name");
			sort = sortByCountry.and(sortByState.and(sortByCity));
		}
		if (sortField.equals("lastModified")) {
			sort = Sort.by("updatedDate");
		}
		if (sortField.equals("category-name")) {
			sort = Sort.by("category.name");
		}
		System.out.println("true: " + sortDir.equals("ASC"));
		sort = sortDir.equals("ASC") ? sort.ascending() : sort.descending();
		Pageable pageable = PageRequest.of(pageNumber - 1, 20, sort); // pase base 0

		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<Room> criteriaQuery = criteriaBuilder.createQuery(Room.class);
		Root<Room> root = criteriaQuery.from(Room.class);

		List<Predicate> predicates = new ArrayList<>();
		List<Integer> amentitiesID = new ArrayList<>();
		List<Boolean> statusesID = new ArrayList<>();

		Expression<Boolean> roomStatus = root.get("status");
		Expression<Integer> roomBedroomCount = root.get("bedroomCount");
		Expression<Integer> roomBathroomCount = root.get("bathroomCount");
		Expression<Integer> roomBedCount = root.get("bedCount");
		Expression<String> roomName = root.get("name");
		Expression<User> roomHost = root.get("host");

		predicates.add(criteriaBuilder.and(criteriaBuilder.equal(roomHost, host)));

		if (!StringUtils.isEmpty(filters.get("amentities"))) {
			Join<Room, Amentity> joinOptions = root.join("amentities", JoinType.LEFT);
			String[] amentities = filters.get("amentities").split(" ");
			for (int i = 0; i < amentities.length; i++) {
				amentitiesID.add(Integer.parseInt(amentities[i]));
			}

			predicates.add(criteriaBuilder.and(joinOptions.get("id").in(amentitiesID)));
		}

		if (!StringUtils.isEmpty(filters.get("status"))) {
			System.out.println("status" + filters.get("status"));
			String[] statuses = filters.get("status").split(" ");
			if(statuses.length != 2) {
				for (int i = 0; i < statuses.length; i++) {
					boolean x = statuses[i].equals("ACTIVE");
					statusesID.add(x);
				}

				predicates.add(criteriaBuilder.and(roomStatus.in(statusesID)));
			}
		}

		if (!StringUtils.isEmpty(query)) {
			predicates.add(criteriaBuilder.and(criteriaBuilder.like(roomName, "%" + query + "%")));
		}

		predicates.add(criteriaBuilder.and(criteriaBuilder.greaterThanOrEqualTo(roomBedroomCount, bedroomCount)));
		predicates.add(criteriaBuilder.and(criteriaBuilder.greaterThanOrEqualTo(roomBathroomCount, bathroomCount)));
		predicates.add(criteriaBuilder.and(criteriaBuilder.greaterThanOrEqualTo(roomBedCount, bedCount)));

		criteriaQuery.where(criteriaBuilder.and(predicates.toArray(new Predicate[predicates.size()])))
				.groupBy(root.get("id"));

		criteriaQuery.orderBy(QueryUtils.toOrders(pageable.getSort(), root, criteriaBuilder));
		TypedQuery<Room> query2 = entityManager.createQuery(criteriaQuery);
		int totalRows = query2.getResultList().size();
		query2.setFirstResult(pageable.getPageNumber() * pageable.getPageSize());
		query2.setMaxResults(pageable.getPageSize());

		Page<Room> result = new PageImpl<Room>(query2.getResultList(), pageable, totalRows);

		return result;
	}

	public List<RoomPricePerCurrencyDTO> findAverageRoomPriceByPriceType(PriceType type) {
		return roomRepository.findAverageRoomPriceByPriceType(type);
	}

	public List<Integer> getRoomIdByHost(User host) {
		return roomRepository.getRoomIdByHost(host);
	}
}
