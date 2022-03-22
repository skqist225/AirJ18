part of 'room_detail_bloc.dart';


abstract class RoomDetailState extends Equatable {
  const RoomDetailState();

  @override
  List<Object?> get props => [];
}

class RoomInitial extends RoomDetailState {}

class RoomLoading extends RoomDetailState {}

class RoomLoaded extends RoomDetailState {
  final RoomDetailResponse roomDetailResponse;
  const RoomLoaded(this.roomDetailResponse);
}

class RoomError extends RoomDetailState {
  final String? message;
  const RoomError(this.message);
}