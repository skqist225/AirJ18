import 'package:book_hotel/model/room_model.dart';

class RoomResponse {
  final List<RoomModel> rooms;
  final String error;

  RoomResponse(
    this.rooms,
    this.error,
  );

  RoomResponse.fromJson(dynamic json)
      : rooms = List<RoomModel>.from(
            json['data'].map((e) => RoomModel.fromJson(e)).toList()),
        error = "";
  RoomResponse.withError(this.error) : rooms = [];
}
