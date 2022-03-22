class Host {
  String? name;
  String? avatar;
  Null? id;
  String? createdDate;

  Host({this.name, this.avatar, this.id, this.createdDate});

  Host.fromJson(Map<String, dynamic> json) {
    name = json['name'];
    avatar = json['avatar'];
    id = json['id'];
    createdDate = json['createdDate'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['name'] = name;
    data['avatar'] = avatar;
    data['id'] = id;
    data['createdDate'] = createdDate;
    return data;
  }
}