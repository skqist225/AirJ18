import 'package:book_hotel/model/rating_model.dart';

class Reviews {
  String? customerAvatar;
  Rating? rating;
  String? comment;
  String? customerName;
  String? createdAt;

  Reviews(
      {this.customerAvatar,
      this.rating,
      this.comment,
      this.customerName,
      this.createdAt});

  Reviews.fromJson(Map<String, dynamic> json) {
    customerAvatar = json['customerAvatar'];
    rating = json['rating'] != null ? Rating.fromJson(json['rating']) : null;
    comment = json['comment'];
    customerName = json['customerName'];
    createdAt = json['createdAt'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['customerAvatar'] = customerAvatar;
    if (rating != null) {
      data['rating'] = rating!.toJson();
    }
    data['comment'] = comment;
    data['customerName'] = customerName;
    data['createdAt'] = createdAt;
    return data;
  }
}