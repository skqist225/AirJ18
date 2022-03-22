import 'dart:math';

import 'package:book_hotel/app_theme.dart';
import 'package:book_hotel/src/auth/components/login_form.dart';
import 'package:book_hotel/src/auth/components/sign_up_form.dart';
import 'package:flutter/material.dart';

class AuthScreen extends StatefulWidget {
   AuthScreen({Key? key}) : super(key: key);

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen>
    with SingleTickerProviderStateMixin {
  bool isShowSignUp = false;

  late AnimationController animationController;
  late Animation<double> animationTextRotate;

  void setUpAnimation() {
    animationController =
        AnimationController(vsync: this, duration: AppTheme.defaultDuration);

    animationTextRotate =
        Tween<double>(begin: 0, end: 90).animate(animationController);
  }

  void updateView() {
    setState(() {
      isShowSignUp = !isShowSignUp;
    });
    isShowSignUp
        ? animationController.forward()
        : animationController.reverse();
  }

  @override
  void initState() {
    setUpAnimation();
    super.initState();
  }

  @override
  void dispose() {
    animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    return Scaffold(
      extendBody: true,
      body: AnimatedBuilder(
          animation: animationController,
          builder: (context, snapshot) {
            return Stack(
              children: [
                //Login form
                AnimatedPositioned(
                  duration: AppTheme.defaultDuration,
                  width: size.width * 0.88,
                  height: size.height,
                  left: isShowSignUp ? -size.width * 0.76 : size.width * 0,
                  child: Container(
                    color: Color.fromARGB(255, 84, 162, 252),
                    child: const LoginForm(),
                  ),
                ),
                //SignUp form
                AnimatedPositioned(
                  duration: AppTheme.defaultDuration,
                  width: size.width * 0.88,
                  height: size.height,
                  left: isShowSignUp ? size.width * 0.12 : size.width * 0.88,
                  child: Container(
                    color: const Color(0xffF7EBE1),
                    child: const SignUpForm(),
                  ),
                ),
                AnimatedPositioned(
                  top: size.height * 0.1,
                  left: 0,
                  right: isShowSignUp ? -size.width * 0.06 : size.width * 0.06,
                  child: Column(
                    children: [
                      CircleAvatar(
                        radius: 25,
                        backgroundColor:
                            isShowSignUp ? Colors.black12 : Colors.white10,
                        child: AnimatedSwitcher(
                          duration: AppTheme.defaultDuration,
                          child: Image.asset("assets/images/logo.png"),
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.all(10.0),
                        child: Text(
                          "Air J18",
                          style: AppTheme.headline.copyWith(
                              color: isShowSignUp
                                  ? Colors.black87
                                  : Colors.white70),
                        ),
                      )
                    ],
                  ),
                  duration: AppTheme.defaultDuration,
                ),

                //Login text
                AnimatedPositioned(
                  duration: AppTheme.defaultDuration,
                  bottom:
                      isShowSignUp ? size.height / 2 - 80 : size.height * 0.05,
                  left: isShowSignUp ? 0 : size.width * 0.44 - 80,
                  child: AnimatedDefaultTextStyle(
                    duration: AppTheme.defaultDuration,
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: isShowSignUp ? 20 : 30,
                      fontWeight: FontWeight.bold,
                      color: isShowSignUp ? Colors.white : Colors.white70,
                      fontFamily: 'Roboto-Bold',
                    ),
                    child: Transform.rotate(
                      angle: -animationTextRotate.value * pi / 180,
                      alignment: Alignment.topLeft,
                      child: InkWell(
                        onTap: () {
                          if (isShowSignUp) {
                            updateView();
                          }
                        },
                        child: const Padding(
                          padding: EdgeInsets.symmetric(
                              vertical: AppTheme.defaultPadding * 0.75),
                          child: SizedBox(
                            width: 160,
                            child: Text(
                              "Đăng nhập",
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),

                //Sign up text
                AnimatedPositioned(
                  duration: AppTheme.defaultDuration,
                  bottom:
                      !isShowSignUp ? size.height / 2 - 80 : size.height * 0.02,
                  right: isShowSignUp ? size.width * 0.44 - 80 : 0,
                  child: AnimatedDefaultTextStyle(
                    duration: AppTheme.defaultDuration,
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: !isShowSignUp ? 20 : 30,
                      fontWeight: FontWeight.bold,
                      color: !isShowSignUp ? Colors.black : Colors.black87,
                      fontFamily: 'WorkSans',
                    ),
                    child: Transform.rotate(
                      angle: (90 - animationTextRotate.value) * pi / 180,
                      alignment: Alignment.topRight,
                      child: InkWell(
                        onTap: () {
                          if (!isShowSignUp) {
                            updateView();
                          }
                        },
                        child: const Padding(
                          padding: EdgeInsets.symmetric(
                              vertical: AppTheme.defaultPadding * 0.75),
                          child: SizedBox(
                            width: 160,
                            child: Text(
                              "Đăng ký",
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            );
          }),
    );
  }
}
