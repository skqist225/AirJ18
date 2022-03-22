class Rating {
  int? cleanliness;
  int? contact;
  int? checkin;
  int? accuracy;
  int? location;
  int? value;

  Rating(
      {this.cleanliness,
      this.contact,
      this.checkin,
      this.accuracy,
      this.location,
      this.value});

  Rating.fromJson(Map<String, dynamic> json) {
    cleanliness = json['cleanliness'];
    contact = json['contact'];
    checkin = json['checkin'];
    accuracy = json['accuracy'];
    location = json['location'];
    value = json['value'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['cleanliness'] = cleanliness;
    data['contact'] = contact;
    data['checkin'] = checkin;
    data['accuracy'] = accuracy;
    data['location'] = location;
    data['value'] = value;
    return data;
  }
}