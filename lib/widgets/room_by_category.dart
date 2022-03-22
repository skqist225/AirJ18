import 'package:book_hotel/blocs/room_bloc/room_bloc.dart';
import 'package:book_hotel/model/room_model.dart';
import 'package:book_hotel/src/home/ui/room_item.dart';
import 'package:book_hotel/src/hotel_app_theme.dart';
import 'package:book_hotel/widgets/error_widget.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class CategoryRooms extends StatefulWidget {
  final String categoryId;
  const CategoryRooms({Key? key, required this.categoryId}) : super(key: key);

  @override
  State<CategoryRooms> createState() => _CategoryRoomsState();
}

class _CategoryRoomsState extends State<CategoryRooms> with TickerProviderStateMixin {

  final RoomBloc _roomBloc = RoomBloc();

  AnimationController? animationController;
  

  @override
  void initState() {
    _roomBloc.add(GetRoomList(widget.categoryId));
    animationController = AnimationController(
        duration: const Duration(milliseconds: 1000), vsync: this);
    super.initState();
  }

  @override
  void dispose() {
    animationController?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    //Call API

    return Scaffold(
      body: BlocProvider(
        create: (_) => _roomBloc,
        child: BlocListener<RoomBloc, RoomState>(
          listener: (context, state) {
            if (state is RoomError) {
              print("Error: ${state.message}");
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(state.message!),
                ),
              );
            }
          },
          child: BlocBuilder<RoomBloc, RoomState>(
              builder: (context, snapshot) {
            if (snapshot is RoomInitial) {
              return _buildLoading();
            } else if (snapshot is RoomLoading) {
              return _buildLoading();
            } else if (snapshot is RoomLoaded) {

              print("Rooms ${snapshot.roomResponse.rooms.length}");
              return buildListRoom(context, snapshot.roomResponse.rooms);
            } else if (snapshot is RoomError) {
              return const CustomErrorWidget();
            } else {
              return _buildLoading();
            }
          }),
        ),
      ),
    );
  }

  Widget _buildLoading() => const Center(child: CircularProgressIndicator());


  Container buildListRoom(
      BuildContext context, List<RoomModel> rooms
) {
    return Container(
      color: HotelAppTheme.buildLightTheme().backgroundColor,
      child: ListView.builder(
        itemCount: rooms.length,
        padding: const EdgeInsets.only(top: 8),
        scrollDirection: Axis.vertical,
        itemBuilder: (BuildContext context, int index) {
          animationController?.forward();
          return RoomItem(
            room: rooms[index],
            key: UniqueKey(),
          );
        },
      ),
    );
  }
}
