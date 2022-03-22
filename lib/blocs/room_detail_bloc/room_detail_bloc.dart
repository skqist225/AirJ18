import 'package:bloc/bloc.dart';
import 'package:book_hotel/model/room_detail_response.dart';
import 'package:book_hotel/repositories/api_repository.dart';
import 'package:equatable/equatable.dart';

part 'room_detail_event.dart';
part 'room_detail_state.dart';

class RoomDetailBloc extends Bloc<RoomDetailEvent, RoomDetailState> {
  RoomDetailBloc() : super(RoomInitial()) {
    final ApiRepository _apiRepository = ApiRepository();

    on<GetDetailRoomList>((event, emit) async {
      try {
        // ignore: unnecessary_type_check
        if (event is GetDetailRoomList) {
          emit(RoomLoading());
          final mList = await _apiRepository.fetchRoomDetailList(event.id);
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
