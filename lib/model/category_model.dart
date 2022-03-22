class CategoryModel {
  int? id;
  bool? status;
  Null? createdDate;
  Null? updatedDate;
  String? name;
  String? iconPath;

  CategoryModel(
      {this.id,
      this.status,
      this.createdDate,
      this.updatedDate,
      this.name,
      this.iconPath});


  CategoryModel.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    status = json['status'];
    createdDate = json['createdDate'];
    updatedDate = json['updatedDate'];
    name = json['name'];
    iconPath = json['iconPath'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['id'] = id;
    data['status'] = status;
    data['createdDate'] = createdDate;
    data['updatedDate'] = updatedDate;
    data['name'] = name;
    data['iconPath'] = iconPath;
    return data;
  }
}
