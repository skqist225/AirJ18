class BookedDates {
  String? checkinDate;
  String? checkoutDate;

  BookedDates({this.checkinDate, this.checkoutDate});

  BookedDates.fromJson(Map<String, dynamic> json) {
    checkinDate = json['checkinDate'];
    checkoutDate = json['checkoutDate'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['checkinDate'] = checkinDate;
    data['checkoutDate'] = checkoutDate;
    return data;
  }
}