import 'dart:async';
import 'dart:convert';

import 'package:book_hotel/app_theme.dart';
import 'package:book_hotel/blocs/authentication_bloc/authentication_bloc.dart';
import 'package:book_hotel/blocs/authentication_bloc/authentication_state.dart';
import 'package:book_hotel/helpers/directions_handler.dart';
import 'package:book_hotel/main.dart';
import 'package:book_hotel/navigation_home_screen.dart';
import 'package:book_hotel/src/auth/auth_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:location/location.dart';
import 'package:mapbox_gl/mapbox_gl.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({Key? key}) : super(key: key);

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    // Funtion delay không được để trong hàm build()
    //vì because this is causing a cyclic behaviour,
    //every time you call setState() the build() is called again,
    initializeLocationAndSave();
    // Timer(
    //   const Duration(seconds: 3),
    //   () => Navigator.of(context).pushReplacement(
    //     MaterialPageRoute(
    //       builder: (BuildContext context) =>
    //           BlocBuilder<AuthenticationBloc, AuthenticationState>(
    //         builder: (context, state) {
    //           if (state is AuthenticationFailure) {
    //             return AuthScreen();
    //           }
    //           if (state is AuthenticationSuccess) {
    //             return NavigationHomeScreen();
    //           }
    //           return Container(
    //             color: Colors.cyanAccent,
    //             child: Center(child: Image.asset("assets/images/logo.png")),
    //           );
    //         },
    //       ),
    //     ),
    //   ),
    // );
    super.initState();
  }

  void initializeLocationAndSave() async {
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

    

    Navigator.of(context).pushReplacement(
        MaterialPageRoute(
          builder: (BuildContext context) =>
              BlocBuilder<AuthenticationBloc, AuthenticationState>(
            builder: (context, state) {
              if (state is AuthenticationFailure) {
                return AuthScreen();
              }
              if (state is AuthenticationSuccess) {
                return NavigationHomeScreen();
              }
              return Container(
                color: Colors.cyanAccent,
                child: Center(child: Image.asset("assets/images/logo.png")),
              );
            },
          ),
        ),
      );

    // Navigator.pushAndRemoveUntil(
    //     context,
    //     MaterialPageRoute(builder: (_) => const HomeManagement()),
    //     (route) => false);
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        home: Scaffold(
            backgroundColor: const Color(0xffF7EBE1),
            body: Padding(
              padding: const EdgeInsets.all(50.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    height: 400,
                    child: Image.asset("assets/images/splash.gif"),
                  ),
                ],
              ),
            )));
  }
}
