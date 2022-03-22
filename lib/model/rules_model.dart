class Rules {
  int? id;
  bool? status;
  int? createdDate;
  int? updatedDate;
  String? title;
  String? icon;
  String? iconPath;

  Rules(
      {this.id,
      this.status,
      this.createdDate,
      this.updatedDate,
      this.title,
      this.icon,
      this.iconPath});

  Rules.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    status = json['status'];
    createdDate = json['createdDate'];
    updatedDate = json['updatedDate'];
    title = json['title'];
    icon = json['icon'];
    iconPath = json['iconPath'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['id'] = id;
    data['status'] = status;
    data['createdDate'] = createdDate;
    data['updatedDate'] = updatedDate;
    data['title'] = title;
    data['icon'] = icon;
    data['iconPath'] = iconPath;
    return data;
  }
}