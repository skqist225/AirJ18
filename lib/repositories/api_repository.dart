import 'package:book_hotel/model/category_model.dart';
import 'package:book_hotel/model/category_response.dart';
import 'package:book_hotel/model/room_detail_response.dart';
import 'package:book_hotel/model/room_response.dart';
import 'package:book_hotel/utils/api_provider.dart';

class ApiRepository {
  final _provider = ApiProvider();

  Future<CategoryResponse> fetchCategoryList() {
    return _provider.fetchCategoryList();
  }

  Future<RoomResponse> fetchRoomList(String id) {
    return _provider.fetchRoomList(id);
  }

   Future<RoomDetailResponse> fetchRoomDetailList(String id) {
    return _provider.fetchRoomDetail(id);
  }
}

class NetworkError extends Error {}