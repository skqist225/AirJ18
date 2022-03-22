part of 'room_detail_bloc.dart';


abstract class RoomDetailEvent extends Equatable {
  const RoomDetailEvent();

  @override
  List<Object> get props => [];
}

class GetDetailRoomList extends RoomDetailEvent {
  final String id;

  const GetDetailRoomList(this.id);
}