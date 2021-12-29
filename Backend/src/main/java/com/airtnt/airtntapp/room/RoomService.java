package com.airtnt.airtntapp.room;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.Set;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Expression;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.airtnt.airtntapp.FileUploadUtil;
import com.airtnt.airtntapp.city.CityRepository;
import com.airtnt.airtntapp.state.StateRepository;
import com.airtnt.airtntapp.user.UserRepository;
import com.airtnt.entity.Amentity;
import com.airtnt.entity.Category;
import com.airtnt.entity.City;
import com.airtnt.entity.Country;
import com.airtnt.entity.Room;
import com.airtnt.entity.RoomGroup;
import com.airtnt.entity.RoomPrivacy;
import com.airtnt.entity.State;
import com.airtnt.entity.User;
import com.airtnt.entity.Exception.RoomNotFoundException;

@Service
@Transactional
public class RoomService {
	public static final int MAX_ROOM_PER_FETCH = 40;
	public static final int MAX_ROOM_PER_FETCH_BY_HOST = 10;
	public static final int ROOMS_PER_PAGE = 10;

	@Autowired
	private RoomRepository roomRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private StateRepository stateRepository;

	@Autowired
	private CityRepository cityRepository;

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
		Pageable pageable = PageRequest.of(pageNumber - 1, MAX_ROOM_PER_FETCH_BY_HOST, sort); // pase base 0

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

	public Page<Room> getRoomsByCategoryId(Integer categoryId, boolean status, int pageNumber,
			Map<String, String> filters) {
		float minPrice = Float.parseFloat(filters.get("minPrice"));
		float maxPrice = Float.parseFloat(filters.get("maxPrice"));
		int bedroomCount = Integer.parseInt(filters.get("bedRoom"));
		int bedCount = Integer.parseInt(filters.get("bed"));
		int bathroomCount = Integer.parseInt(filters.get("bathRoom"));

		List<Integer> amentitiesID = new ArrayList<>();
		List<Integer> privaciesID = new ArrayList<>();

		if (!filters.get("privacies").isEmpty()) {
			String[] privacies = filters.get("privacies").split(" ");

			for (int i = 0; i < privacies.length; i++) {
				privaciesID.add(Integer.parseInt(privacies[i]));
			}
		}
		if (!filters.get("amentities").isEmpty()) {
			String[] amentities = filters.get("amentities").split(" ");

			for (int i = 0; i < amentities.length; i++) {
				amentitiesID.add(Integer.parseInt(amentities[i]));
			}
		}

		Pageable pageable = PageRequest.of(pageNumber - 1, MAX_ROOM_PER_FETCH);
		if (amentitiesID.size() == 0) {
			return roomRepository.findAll(new Specification<Room>() {
				@Override
				public Predicate toPredicate(Root<Room> root, CriteriaQuery<?> query,
						CriteriaBuilder criteriaBuilder) {
					List<Predicate> predicates = new ArrayList<>();
					predicates.add(
							criteriaBuilder.and(criteriaBuilder.equal(root.get("category").get("id"), categoryId)));
					predicates.add(criteriaBuilder
							.and(criteriaBuilder.greaterThanOrEqualTo(root.get("price"), minPrice)));
					predicates.add(criteriaBuilder
							.and(criteriaBuilder.lessThanOrEqualTo(root.get("price"), maxPrice)));
					predicates.add(criteriaBuilder
							.and(criteriaBuilder.greaterThanOrEqualTo(root.get("bedroomCount"),
									bedroomCount)));
					predicates.add(criteriaBuilder
							.and(criteriaBuilder.greaterThanOrEqualTo(root.get("bathroomCount"),
									bathroomCount)));
					predicates.add(
							criteriaBuilder.and(criteriaBuilder.greaterThanOrEqualTo(root.get("bedCount"),
									bedCount)));

					if (privaciesID.size() > 0) {
						Expression<Boolean> roomPrivacyId = root.get("privacyType").get("id");
						Predicate predicate = roomPrivacyId.in(privaciesID);
						predicates.add(predicate);
					}

					return criteriaBuilder.and(predicates.toArray(new Predicate[predicates.size()]));
				}
			}, pageable);
		}

		return roomRepository.getByCategoryAndStatus(categoryId, status,
				privaciesID, minPrice,
				maxPrice, bedroomCount, bedCount, bathroomCount, amentitiesID, pageable);
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

				Set<Amentity> updatedAmentities = room.getAmentities();

				String[] checkedArr = values.get("checked").split(",");
				String[] uncheckedArr = values.get("unchecked").split(",");

				for (String s : checkedArr)
					System.out.println(s);

				for (String s : uncheckedArr)
					System.out.println(s);

				System.out.println(checkedArr.length);
				System.out.println(uncheckedArr.length);

				for (Amentity a : updatedAmentities) {
					for (int i = 0; i < uncheckedArr.length; i++) {
						if (!uncheckedArr[i].equals("") && a.getId() == Integer.parseInt(uncheckedArr[i])) {
							updatedAmentities.remove(a);
						} else
							continue;
					}
				}

				for (int i = 0; i < checkedArr.length; i++) {
					if (!checkedArr[i].equals(""))
						updatedAmentities.add(new Amentity(Integer.parseInt(checkedArr[i])));
				}

				room.setAmentities(updatedAmentities);
				break;
			}
			case "thumbnail": {
				room.setThumbnail(values.get("thumbnail"));
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

}
