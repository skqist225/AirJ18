import 'package:bloc/bloc.dart';
import 'package:book_hotel/model/category_response.dart';
import 'package:book_hotel/repositories/api_repository.dart';
import 'package:equatable/equatable.dart';

part 'category_event.dart';
part 'category_state.dart';

class CategoryBloc extends Bloc<CategoryEvent, CategoryState> {
  CategoryBloc() : super(CategoryInitial()) {
    final ApiRepository _apiRepository = ApiRepository();

    on<GetCategoryList>((event, emit) async {
      try {
        emit(CategoryLoading());
        final mList = await _apiRepository.fetchCategoryList();
        emit(CategoryLoaded(mList));
        if (mList.error.isNotEmpty) {
          emit(CategoryError(mList.error));
        }
      } on NetworkError {
        emit(const CategoryError("Failed to fetch data. is your device online?"));
      }
    });
  }
}