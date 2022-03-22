import 'dart:io';

import 'package:book_hotel/app_theme.dart';
import 'package:book_hotel/blocs/authentication_bloc/authentication_bloc.dart';
import 'package:book_hotel/blocs/authentication_bloc/authentication_event.dart';
import 'package:book_hotel/blocs/login_bloc/login_bloc.dart';
import 'package:book_hotel/blocs/register_bloc/register_bloc.dart';
import 'package:book_hotel/blocs/simple_bloc_observer.dart';
import 'package:book_hotel/navigation_home_screen.dart';
import 'package:book_hotel/repositories/user_repository.dart';
import 'package:book_hotel/src/auth/splash_screen.dart';
import 'package:book_hotel/src/introduction_animation/introduction_animation_screen.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:shared_preferences/shared_preferences.dart';

int? initScreen = 0;
late SharedPreferences sharedPreferences;
void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  Bloc.observer = SimpleBlocObserver();
  await Firebase.initializeApp();
  final UserRepository userRepository = UserRepository();

  await dotenv.load(fileName: "assets/config/.env");

  sharedPreferences = await SharedPreferences.getInstance();
  initScreen = sharedPreferences.getInt("initScreen");
  await sharedPreferences.setInt("initScreen", 1);
  await SystemChrome.setPreferredOrientations(<DeviceOrientation>[
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown
  ]).then((_) => runApp(
        MultiBlocProvider(
          providers: [
            BlocProvider(
              create: (context) =>
                  AuthenticationBloc(userRepository: userRepository)
                    ..add(AuthenticationStarted()),
            ),
            BlocProvider<LoginBloc>(
              create: (context) => LoginBloc(userRepository: userRepository),
            ),
            BlocProvider<RegisterBloc>(
              create: (context) => RegisterBloc(userRepository: userRepository),
            ),
          ],
          child: const MyApp(),
        ),
      ));
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.dark,
      statusBarBrightness:
          !kIsWeb && Platform.isAndroid ? Brightness.dark : Brightness.light,
      systemNavigationBarColor: Colors.white,
      systemNavigationBarDividerColor: Colors.transparent,
      systemNavigationBarIconBrightness: Brightness.dark,
    ));
    return BlocProvider(
      create: (context) => LoginBloc(userRepository: UserRepository()),
      child: MaterialApp(
        title: 'Flutter UI',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          primarySwatch: Colors.blue,
          textTheme: AppTheme.textTheme,
          platform: TargetPlatform.iOS,
        ),
        initialRoute: initScreen == 0 || initScreen == null ? "first" : "/",
        routes: {
          '/': (context) => const SplashScreen(),
          "first": (context) => const IntroductionAnimationScreen(),
        },
      ),
    );
  }
}
