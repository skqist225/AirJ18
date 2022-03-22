import 'package:book_hotel/model/amenitie_model.dart';
import 'package:book_hotel/model/booked_dates_model.dart';
import 'package:book_hotel/model/host_model.dart';
import 'package:book_hotel/model/review_model.dart';
import 'package:book_hotel/model/rules_model.dart';

class RoomDetail {
  int? bed;
  List<Amenities>? amenities;
  List<String>? images;
  String? thumbnail;
  double? latitude;
  String? description;
  String? privacy;
  List<BookedDates>? bookedDates;
  double? averageRating;
  List<Rules>? rules;
  int? bedroom;
  String? stayType;
  List<Reviews>? reviews;
  double? price;
  String? name;
  Host? host;
  String? location;
  int? guest;
  String? currencySymbol;
  int? id;
  int? bathroom;
  double? longitude;
  String? cityName;

  RoomDetail(
      {this.bed,
      this.amenities,
      this.images,
      this.thumbnail,
      this.latitude,
      this.description,
      this.privacy,
      this.bookedDates,
      this.averageRating,
      this.rules,
      this.bedroom,
      this.stayType,
      this.reviews,
      this.price,
      this.name,
      this.host,
      this.location,
      this.guest,
      this.currencySymbol,
      this.id,
      this.bathroom,
      this.longitude,
      this.cityName});

  RoomDetail.fromJson(Map<String, dynamic> json) {
    bed = json['bed'];
    if (json['amenities'] != null) {
      amenities = <Amenities>[];
      json['amenities'].forEach((v) {
        amenities!.add(Amenities.fromJson(v));
      });
    }
    images = json['images'].cast<String>();
    thumbnail = json['thumbnail'];
    latitude = json['latitude'];
    description = json['description'];
    privacy = json['privacy'];
    if (json['bookedDates'] != null) {
      bookedDates = <BookedDates>[];
      json['bookedDates'].forEach((v) {
        bookedDates!.add(BookedDates.fromJson(v));
      });
    }
    averageRating = json['averageRating'];
    if (json['rules'] != null) {
      rules = <Rules>[];
      json['rules'].forEach((v) {
        rules!.add(Rules.fromJson(v));
      });
    }
    bedroom = json['bedroom'];
    stayType = json['stayType'];
    if (json['reviews'] != null) {
      reviews = <Reviews>[];
      json['reviews'].forEach((v) {
        reviews!.add(Reviews.fromJson(v));
      });
    }
    price = json['price'];
    name = json['name'];
    host = json['host'] != null ? Host.fromJson(json['host']) : null;
    location = json['location'];
    guest = json['guest'];
    currencySymbol = json['currencySymbol'];
    id = json['id'];
    bathroom = json['bathroom'];
    longitude = json['longitude'];
    cityName = json['cityName'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['bed'] = bed;
    if (amenities != null) {
      data['amenities'] = amenities!.map((v) => v.toJson()).toList();
    }
    data['images'] = images;
    data['thumbnail'] = thumbnail;
    data['latitude'] = latitude;
    data['description'] = description;
    data['privacy'] = privacy;
    if (bookedDates != null) {
      data['bookedDates'] = bookedDates!.map((v) => v.toJson()).toList();
    }
    data['averageRating'] = averageRating;
    if (rules != null) {
      data['rules'] = rules!.map((v) => v.toJson()).toList();
    }
    data['bedroom'] = bedroom;
    data['stayType'] = stayType;
    if (reviews != null) {
      data['reviews'] = reviews!.map((v) => v.toJson()).toList();
    }
    data['price'] = price;
    data['name'] = name;
    if (host != null) {
      data['host'] = host!.toJson();
    }
    data['location'] = location;
    data['guest'] = guest;
    data['currencySymbol'] = currencySymbol;
    data['id'] = id;
    data['bathroom'] = bathroom;
    data['longitude'] = longitude;
    data['cityName'] = cityName;
    return data;
  }
}












