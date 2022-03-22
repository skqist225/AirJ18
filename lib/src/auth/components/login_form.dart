import 'package:book_hotel/app_theme.dart';
import 'package:book_hotel/blocs/authentication_bloc/authentication_bloc.dart';
import 'package:book_hotel/blocs/authentication_bloc/authentication_event.dart';
import 'package:book_hotel/blocs/login_bloc/login_bloc.dart';
import 'package:book_hotel/blocs/login_bloc/login_event.dart';
import 'package:book_hotel/blocs/login_bloc/login_state.dart';
import 'package:book_hotel/navigation_home_screen.dart';
import 'package:book_hotel/src/auth/components/reset_password_dialog.dart';
import 'package:flutter/material.dart';
import 'package:flutter_animated_dialog/flutter_animated_dialog.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class LoginForm extends StatefulWidget {
  const LoginForm({Key? key}) : super(key: key);
  @override
  State<LoginForm> createState() => _LoginFormState();
}

class _LoginFormState extends State<LoginForm> {
  TextEditingController emailController = TextEditingController();

  TextEditingController passwordController = TextEditingController();

  buildSnackBar(BuildContext context, String message) {
    return ScaffoldMessenger.of(context)
      ..removeCurrentSnackBar()
      ..showSnackBar(
        SnackBar(
          content: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: <Widget>[
              Text(message),
              const CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
              )
            ],
          ),
          backgroundColor: AppTheme.darkGrey.withOpacity(0.3),
        ),
      );
  }

  late LoginBloc _loginBloc;
  late bool _obscureText;

  void _onEmailChange() {
    _loginBloc.add(LoginEmailChange(email: emailController.text));
  }

  void _onPasswordChange() {
    _loginBloc.add(LoginPasswordChanged(password: passwordController.text));
  }

  void _onFormSubmitted() {
    _loginBloc.add(LoginWithCredentialsPressed(
        email: emailController.text, password: passwordController.text));
  }

  bool get isPopulated =>
      emailController.text.isNotEmpty && passwordController.text.isNotEmpty;

  bool isButtonEnabled(LoginState state) {
    return state.isFormValid && isPopulated && !state.isSubmitting;
  }

  dialogPlaylist(BuildContext context) async {
    var size = MediaQuery.of(context).size;
    return showAnimatedDialog(
        context: context,
        barrierDismissible: true,
        builder: (BuildContext context) {
          return Center(
            child: SizedBox(
              width: size.width * .8,
              height: size.height * .4,
              child: Material(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20),
                ),
                child: const ResetPasswordDialog(),
              ),
            ),
          );
        },
        animationType: DialogTransitionType.slideFromTopFade,
        curve: Curves.linear);
  }

  @override
  void initState() {
    super.initState();
    _loginBloc = BlocProvider.of<LoginBloc>(context);
    emailController.addListener(_onEmailChange);
    passwordController.addListener(_onPasswordChange);
    _obscureText = true;
  }

  @override
  void dispose() {
    super.dispose();
    emailController.dispose();
    passwordController.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener<LoginBloc, LoginState>(
      listener: (context, state) {
        if (state.isFailure) {
          buildSnackBar(context, "Login fail!");
        }

        if (state.isSubmitting) {
          buildSnackBar(context, "Processing!");
        }

        if (state.isSuccess) {
          BlocProvider.of<AuthenticationBloc>(context).add(
            AuthenticationLoggedIn(),
          );
          Navigator.of(context).pushReplacement(MaterialPageRoute(
              builder: (BuildContext context) => NavigationHomeScreen()));
        }
      },
      child: Padding(
        padding: EdgeInsets.symmetric(
            horizontal: MediaQuery.of(context).size.width * 0.13),
        child: BlocBuilder<LoginBloc, LoginState>(builder: (context, state) {
          print("object ${state.isEmailValid}");
          return Form(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Spacer(),
                TextFormField(
                  controller: emailController,
                  decoration: InputDecoration(
                    contentPadding:
                        const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    labelText: "Email",
                    labelStyle: AppTheme.body1.copyWith(color: Colors.white),
                    fillColor: Colors.white,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                      borderSide: const BorderSide(),
                    ),
                  ),
                  style: AppTheme.body1.copyWith(color: Colors.white),
                  keyboardType: TextInputType.emailAddress,
                  autovalidateMode: AutovalidateMode.onUserInteraction,
                  autocorrect: false,
                  validator: (_) {
                    return !state.isEmailValid ? 'Invalid email!' : null;
                  },
                ),
                Padding(
                  padding: const EdgeInsets.symmetric(
                      vertical: AppTheme.defaultPadding),
                  child: TextFormField(
                    controller: passwordController,
                    obscureText: _obscureText,
                    decoration: InputDecoration(
                      contentPadding: const EdgeInsets.symmetric(
                          horizontal: 8, vertical: 4),
                      labelText: "Password",
                      labelStyle: AppTheme.body1.copyWith(color: Colors.white),
                      fillColor: Colors.white,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10),
                        borderSide: const BorderSide(),
                      ),
                      suffixIcon: IconButton(
                          icon: !_obscureText
                              ? const Icon(Icons.visibility)
                              : const Icon(Icons.visibility_off),
                          onPressed: () {
                            setState(
                              () {
                                _obscureText = !_obscureText;
                              },
                            );
                          }),
                    ),
                    style: AppTheme.body1.copyWith(color: Colors.white),
                    keyboardType: TextInputType.text,
                    autovalidateMode: AutovalidateMode.onUserInteraction,
                    autocorrect: false,
                    validator: (_) {
                      return !state.isPasswordValid
                          ? 'Ít nhất 8 ký tự, ít nhất một chữ và một số!'
                          : null;
                    },
                  ),
                ),
                GestureDetector(
                  onTap: () => dialogPlaylist(context),
                  child: Align(
                    alignment: Alignment.topRight,
                    child: Padding(
                      padding: const EdgeInsets.all(4.0),
                      child: Text(
                        "Forgot password?",
                        style: AppTheme.body2.copyWith(color: Colors.white),
                      ),
                    ),
                  ),
                ),
                const SizedBox(
                  height: 20,
                ),
                Container(
                  decoration: const BoxDecoration(
                    shape: BoxShape.circle,
                    color: AppTheme.notWhite,
                  ),
                  child: IconButton(
                    onPressed: () {
                      if (isButtonEnabled(state)) {
                        _onFormSubmitted();
                      }
                    },
                    icon: const Icon(
                      Icons.arrow_forward_ios,
                      color: AppTheme.dark,
                    ),
                  ),
                ),
                const SizedBox(
                  height: 20,
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      height: 1.5,
                      width: 70,
                      color: Colors.white70,
                    ),
                    Text(
                      "  Or  ",
                      style: AppTheme.title.copyWith(color: Colors.white70),
                    ),
                    Container(
                      height: 1.5,
                      width: 70,
                      color: Colors.white70,
                    ),
                  ],
                ),
                const SizedBox(
                  height: 10,
                ),
                GestureDetector(
                  onTap: () {
                    BlocProvider.of<LoginBloc>(context)
                        .add(LoginEventWithGooglePressed());
                  },
                  child: Container(
                    height: 60,
                    width: 250,
                    decoration: BoxDecoration(
                      color: Colors.black45,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Row(
                      children: [
                        Center(
                            child: Image.asset(
                          "assets/images/google_logo.png",
                          height: 60,
                        )),
                        Text(
                          "Login with google",
                          style: AppTheme.title.copyWith(color: Colors.white70),
                        )
                      ],
                    ),
                  ),
                ),
                const Spacer(flex: 1),
              ],
            ),
          );
        }),
      ),
    );
  }
}
