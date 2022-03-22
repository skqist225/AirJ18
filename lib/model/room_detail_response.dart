import 'package:book_hotel/model/room_detail.dart';

class RoomDetailResponse {
  final RoomDetail roomDetail;
  final String error;

  RoomDetailResponse(
    this.roomDetail,
    this.error,
  );

  RoomDetailResponse.fromJson(dynamic json)
      : roomDetail =  RoomDetail.fromJson(json['data']),
        error = "";
  RoomDetailResponse.withError(this.error)
      : roomDetail = RoomDetail();
}
