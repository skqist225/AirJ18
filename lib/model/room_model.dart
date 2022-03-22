class RoomModel {
  String? thumbnail;
  List<String>? images;
  List<int>? likedByUsers;
  double? price;
  String? name;
  String? currencySymbol;
  int? id;
  String? stayType;

  RoomModel(
      {this.thumbnail,
      this.images,
      this.likedByUsers,
      this.price,
      this.name,
      this.currencySymbol,
      this.id,
      this.stayType});

  RoomModel.fromJson(Map<String, dynamic> json) {
    thumbnail = json['thumbnail'];
    images = json['images'].cast<String>();
    likedByUsers = json['likedByUsers'].cast<int>();
    price = json['price'];
    name = json['name'];
    currencySymbol = json['currencySymbol'];
    id = json['id'];
    stayType = json['stayType'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['thumbnail'] = thumbnail;
    data['images'] = images;
    data['likedByUsers'] = likedByUsers;
    data['price'] = price;
    data['name'] = name;
    data['currencySymbol'] = currencySymbol;
    data['id'] = id;
    data['stayType'] = stayType;
    return data;
  }
}