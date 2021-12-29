package com.airtnt.airtntapp.room;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import com.airtnt.entity.Room;
import com.airtnt.entity.User;

@Repository
public interface RoomRepository extends JpaRepository<Room, Integer>, JpaSpecificationExecutor<Room> {

        @Query(value = "select user_id from users_favorite_rooms where room_id = :roomId", nativeQuery = true)
        public List<Integer> getLikedUsers(Integer roomId);

        @Query("SELECT r FROM Room r JOIN r.amentities ra WHERE r.category.id = :categoryId AND r.status = :status" +
                        " AND r.price >= :minPrice AND r.price <= :maxPrice" +
                        " AND r.bedroomCount >= :bedroomCount AND r.bathroomCount >= :bathroomCount AND r.bedCount >= :bedCount"
                        +
                        " AND ra.id IN (:amentitiesID) AND r.privacyType.id IN (:privacies)")
        public Page<Room> getByCategoryAndStatus(Integer categoryId, boolean status,
                        @Param("privacies") List<Integer> privacies, float minPrice, float maxPrice, int bedroomCount,
                        int bedCount,
                        int bathroomCount, @Param("amentitiesID") List<Integer> amentitiesID, Pageable pageable);

        @Query("SELECT r FROM Room r WHERE r.category.id = :categoryId AND r.status = :status")
        public Page<Room> getByCategoryAndStatus(Integer categoryId, boolean status,
                        Pageable pageable);

        public List<Room> findByHost(User host);

        @Query("SELECT r FROM Room r JOIN r.amentities ra WHERE r.host = :host" + " AND r.name LIKE %:query%"
                        + " AND r.bedroomCount >= :bedroomCount AND r.bathroomCount >= :bathroomCount AND r.bedCount >= :bedCount"
                        + " AND ra.id IN (:amentitiesID)" + " AND r.status IN (:statusesID)")
        public Page<Room> getRoomsByHost(User host, String query, int bedroomCount, int bathroomCount, int bedCount,
                        @Param("amentitiesID") List<Integer> amentitiesID,
                        @Param("statusesID") List<Boolean> statusesID, Pageable pageable);

        @Modifying
        @Query("Update Room r set r.status = true where r.id = ?1")
        public int updateRoomStatus(Integer roomId);

        @Query("SELECT r FROM Room r WHERE r.name LIKE %?1%")
        public Page<Room> findAll(String keyword, Pageable pageable);

        public Room findByName(String name);

        public Long countById(Integer id);

        @Query("SELECT u FROM Room u WHERE CONCAT(u.id, '', u.name, ' ', u.description, ' ', u.category) LIKE %?1%")
        public Page<Room> findAllAdmin(String keyword, Pageable pageable);

        @Query("UPDATE Room u SET u.status = ?2 WHERE u.id = ?1")
        @Modifying
        public void updateStatus(Integer id, boolean status);

        @Query("SELECT count(*) From Room r")
        public Integer getNumberOfRoom();

}
