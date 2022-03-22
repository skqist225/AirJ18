part of 'room_bloc.dart';

abstract class RoomState extends Equatable {
  const RoomState();

  @override
  List<Object?> get props => [];
}

class RoomInitial extends RoomState {}

class RoomLoading extends RoomState {}

class RoomLoaded extends RoomState {
  final RoomResponse roomResponse;
  const RoomLoaded(this.roomResponse);
}

class RoomError extends RoomState {
  final String? message;
  const RoomError(this.message);
}