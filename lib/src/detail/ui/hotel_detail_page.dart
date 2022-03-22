import 'dart:convert';

import 'package:book_hotel/blocs/room_detail_bloc/room_detail_bloc.dart';
import 'package:book_hotel/constants/api_path.dart';
import 'package:book_hotel/helpers/directions_handler.dart';
import 'package:book_hotel/main.dart';
import 'package:book_hotel/model/room_detail.dart';
import 'package:book_hotel/src/detail/ui/info/hotel_info_tab.dart';
import 'package:book_hotel/src/detail/ui/review/hotel_review_tab.dart';
import 'package:book_hotel/src/detail/ui/room/hotel_room_tab.dart';
import 'package:book_hotel/src/map/map_screen.dart';
import 'package:book_hotel/widgets/error_widget.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:location/location.dart';
import 'package:mapbox_gl/mapbox_gl.dart';

class HotelDetailPage extends StatefulWidget {
  final String id;

  const HotelDetailPage({Key? key, required this.id}) : super(key: key);

  @override
  State<HotelDetailPage> createState() => _HotelDetailPageState();
}

class _HotelDetailPageState extends State<HotelDetailPage> {
  final RoomDetailBloc _roomDetailBloc = RoomDetailBloc();

  @override
  void initState() {
    _roomDetailBloc.add(GetDetailRoomList(widget.id));
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: BlocProvider(
        create: (_) => _roomDetailBloc,
        child: BlocListener<RoomDetailBloc, RoomDetailState>(
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
          child: BlocBuilder<RoomDetailBloc, RoomDetailState>(
              builder: (context, snapshot) {
            if (snapshot is RoomInitial) {
              return _buildLoading();
            } else if (snapshot is RoomLoading) {
              return _buildLoading();
            } else if (snapshot is RoomLoaded) {
              print("Rooms id: ${snapshot.roomDetailResponse.roomDetail.id}");
              return buildRoomDetail(
                  context, snapshot.roomDetailResponse.roomDetail);
              // return buildListRoom(context, snapshot.roomResponse.rooms);
              // return CategoryList(
              //     categories: snapshot.categoryResponse.categories);
            } else if (snapshot is RoomError) {
              return const CustomErrorWidget();
            } else {
              return _buildLoading();
            }
          }),
        ),
      ),
    );
    // return buildRoomDetail(context);
  }

  Widget _buildLoading() => const Center(child: CircularProgressIndicator());

  Scaffold buildRoomDetail(BuildContext context, RoomDetail roomDetail) {
    return Scaffold(
      body: Container(
        color: Theme.of(context).canvasColor,
        child: Stack(
          children: <Widget>[
            HotelFeedBodyBackground(roomDetail: roomDetail),
            Positioned(
              left: 0,
              top: 0,
              bottom: 0,
              right: 0,
              child: Scaffold(
                appBar: AppBar(
                  iconTheme: const IconThemeData(
                    color: Colors.white,
                    size: 32,
                  ),
                  backgroundColor: Colors.transparent,
                  elevation: 0,
                ),
                backgroundColor: Colors.transparent,
                body: HotelFeedBody(roomDetail: roomDetail),
              ),
            ),
            Positioned(
              left: 20,
              bottom: MediaQuery.of(context).size.height * .62,
              child: Container(
                decoration: const BoxDecoration(
                    color: Color(0xfffd8c00), shape: BoxShape.circle),
                child: Transform.rotate(
                  angle: 25 * 3.1416 / 180,
                  child: IconButton(
                    icon: const Icon(Icons.navigation),
                    onPressed: () async {
                      initializeLocationAndSave([roomDetail]);
                      Navigator.of(context).push(MaterialPageRoute(
                          builder: (context) => MapScreen(room: roomDetail)));
                    },
                    color: Colors.white,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void initializeLocationAndSave(List<RoomDetail> rooms) async {
    // Ensure all permissions are collected for Locations
    Location _location = Location();
    bool? _serviceEnabled;
    PermissionStatus? _permissionGranted;

    _serviceEnabled = await _location.serviceEnabled();
    if (!_serviceEnabled) {
      _serviceEnabled = await _location.requestService();
    }

    _permissionGranted = await _location.hasPermission();
    if (_permissionGranted == PermissionStatus.denied) {
      _permissionGranted = await _location.requestPermission();
    }

    // Get capture the current user location
    LocationData _locationData = await _location.getLocation();
    LatLng currentLatLng =
        LatLng(_locationData.latitude!, _locationData.longitude!);

    // Store the user location in sharedPreferences
    sharedPreferences.setDouble('latitude', _locationData.latitude!);
    sharedPreferences.setDouble('longitude', _locationData.longitude!);

    // Get and store the directions API response in sharedPreferences
    for (int i = 0; i < rooms.length; i++) {
      Map modifiedResponse = await getDirectionsAPIResponse(currentLatLng, i, rooms[i]);
      saveDirectionsAPIResponse(i, json.encode(modifiedResponse));
    }

  }
}

class HotelFeedBodyBackground extends StatelessWidget {
  const HotelFeedBodyBackground({
    Key? key,
    required this.roomDetail,
  }) : super(key: key);

  final RoomDetail roomDetail;

  @override
  Widget build(BuildContext context) {
    return Positioned(
      top: 0,
      left: 0,
      right: 0,
      bottom: MediaQuery.of(context).size.height * .60,
      child: Hero(
        tag: Key(Constants.BASE_URL + roomDetail.images![0]),
        child: Container(
          height: MediaQuery.of(context).size.height * .25,
          width: double.infinity,
          decoration: BoxDecoration(
            image: DecorationImage(
                image: NetworkImage(Constants.BASE_URL + roomDetail.images![0]),
                fit: BoxFit.cover),
          ),
          child: Container(
            width: double.infinity,
            height: MediaQuery.of(context).size.height * .25,
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment(0, .8),
                end: Alignment.center,
                colors: [
                  Color(0xEE000000),
                  Color(0x33000000),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class HotelFeedBody extends StatelessWidget {
  const HotelFeedBody({Key? key, required this.roomDetail}) : super(key: key);
  final RoomDetail roomDetail;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.only(left: 32, right: 32, bottom: 60, top: 220),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: <Widget>[
          const SizedBox(height: 8),
          Expanded(
            child: Material(
              color: Colors.white,
              borderRadius: const BorderRadius.all(Radius.circular(16)),
              elevation: 8,
              child: DefaultTabController(
                length: 3,
                child: Column(
                  children: <Widget>[
                    Expanded(
                      child: Padding(
                        padding: const EdgeInsets.all(20),
                        child: TabBarView(
                          children: [
                            HotelInformationTab(roomDetail: roomDetail),
                            HotelRoomTab(images: roomDetail.images),
                            HotelReviewTab(reviews: roomDetail.reviews),
                          ],
                        ),
                      ),
                    ),
                    const TabBar(
                      indicator: UnderlineTabIndicator(
                        borderSide:
                            BorderSide(color: Color(0xDD613896), width: 4),
                        insets: EdgeInsets.fromLTRB(20, 0, 20, 40),
                      ),
                      tabs: [
                        Tab(
                          child: Text(
                            'INFO',
                            style: TextStyle(color: Colors.black),
                          ),
                        ),
                        Tab(
                          child: Text(
                            'ROOMS',
                            style: TextStyle(color: Colors.black),
                          ),
                        ),
                        Tab(
                          child: Text(
                            'REVIEW',
                            style: TextStyle(color: Colors.black),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          )
        ],
      ),
    );
  }
}
