part of 'room_bloc.dart';


abstract class RoomEvent extends Equatable {
  const RoomEvent();

  @override
  List<Object> get props => [];
}

class GetRoomList extends RoomEvent {
  final String id;

  const GetRoomList(this.id);
}