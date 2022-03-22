import 'package:book_hotel/model/category_model.dart';

class CategoryResponse {
  final bool success;
  final List<CategoryModel> data;
  final String error;

  CategoryResponse(
    this.data,
    this.error,
    this.success,
  );

  CategoryResponse.fromJson(dynamic json)
      : success = json['success'],
        data = List<CategoryModel>.from(
            json['data'].map((e) => CategoryModel.fromJson(e)).toList()),
        error = json['error'] ?? "";
  CategoryResponse.withError(this.error)
      : success = false,
        data = [];
}
