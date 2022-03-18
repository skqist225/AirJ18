package com.airtnt.airtntapp.review;

import java.util.List;

import com.airtnt.entity.Review;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends CrudRepository<Review, Integer> {

    @Query("SELECT r FROM Review r WHERE r.booking.id IN (:bookingIds) AND r.finalRating = :numberOfStars")
    public List<Review> getReviewsByBookingsAndNumberOfStars(Integer[] bookingIds, Float numberOfStars);

    @Query("SELECT r FROM Review r WHERE r.booking.id IN (:bookingIds) AND r.finalRating >= :numberOfStars")
    public List<Review> getAllReviewsByBookings(Integer[] bookingIds, Float numberOfStars);

    @Query("SELECT r FROM Review r WHERE r.booking.id IN (:bookingIds)")
    public List<Review> getReviewsByBookings(Integer[] bookingIds);

    @Query("SELECT r FROM Review r WHERE r.booking.room.id = :id")
    public List<Review> getReviewByIdRoom(int id);

    @Query("SELECT AVG(r.finalRating) FROM Review r WHERE r.booking.room.id = :id")
    public Integer getTotalRatingByIdRoom(Integer id);
}
