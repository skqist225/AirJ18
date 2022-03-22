import 'package:book_hotel/model/category_response.dart';
import 'package:book_hotel/model/room_detail_response.dart';
import 'package:book_hotel/model/room_response.dart';
import 'package:dio/dio.dart';

class ApiProvider {
  final Dio _dio = Dio();
  final String baseUrl = 'https://airj18.skqist225.xyz/';
  final String tagCategory = "api/categories";
  final String tagRoom = "api/rooms?categoryId=";
  final String tagRoomDetail = "api/room/";

  Future<CategoryResponse> fetchCategoryList() async {
    try {
      Response response = await _dio.get(baseUrl + tagCategory);
      return CategoryResponse.fromJson(response.data);
    } catch (error, stacktrace) {
      print("Exception occured: $error stackTrace: $stacktrace");
      return CategoryResponse.withError("Data not found / Connection issue");
    }
  }

  Future<RoomResponse> fetchRoomList(String id) async {
    try {
      print(" Id category: $id");
      Response response = await _dio.get(baseUrl + tagRoom + id);
      return RoomResponse.fromJson(response.data);
    } catch (error, stacktrace) {
      print("Exception occured: $error stackTrace: $stacktrace");
      return RoomResponse.withError("Data not found / Connection issue");
    }
  }

  Future<RoomDetailResponse> fetchRoomDetail(String id) async {
    try {
      print(" Id room detail: $id");
      Response response = await _dio.get(baseUrl + tagRoomDetail + id);

      return RoomDetailResponse.fromJson(response.data);
    } catch (error, stacktrace) {
      print("Exception occured: $error stackTrace: $stacktrace");
      return RoomDetailResponse.withError("Data not found / Connection issue");
    }
  }
}