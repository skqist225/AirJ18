import 'package:bloc/bloc.dart';
import 'package:book_hotel/model/room_response.dart';
import 'package:book_hotel/repositories/api_repository.dart';
import 'package:equatable/equatable.dart';

part 'room_event.dart';
part 'room_state.dart';

class RoomBloc extends Bloc<RoomEvent, RoomState> {
  RoomBloc() : super(RoomInitial()) {
    final ApiRepository _apiRepository = ApiRepository();

    on<GetRoomList>((event, emit) async {
      try {
        if (event is GetRoomList) {
          emit(RoomLoading());
          final mList = await _apiRepository.fetchRoomList(event.id);
          emit(RoomLoaded(mList));
          if (mList.error.isNotEmpty) {
            emit(RoomError(mList.error));
          }
        }
      } on NetworkError {
        emit(const RoomError("Failed to fetch data. is your device online?"));
      }
    });
  }
}
