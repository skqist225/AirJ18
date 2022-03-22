import 'package:book_hotel/app_theme.dart';
import 'package:book_hotel/blocs/authentication_bloc/authentication_bloc.dart';
import 'package:book_hotel/blocs/authentication_bloc/authentication_event.dart';
import 'package:book_hotel/blocs/login_bloc/login_bloc.dart';
import 'package:book_hotel/blocs/login_bloc/login_event.dart';
import 'package:book_hotel/blocs/register_bloc/register_bloc.dart';
import 'package:book_hotel/blocs/register_bloc/register_event.dart';
import 'package:book_hotel/blocs/register_bloc/register_state.dart';
import 'package:book_hotel/navigation_home_screen.dart';
import 'package:book_hotel/src/auth/components/verify_email.dart';
import 'package:flutter/material.dart';
import 'package:flutter_animated_dialog/flutter_animated_dialog.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class SignUpForm extends StatefulWidget {
  const SignUpForm({Key? key}) : super(key: key);

  @override
  State<SignUpForm> createState() => _SignUpFormState();
}

class _SignUpFormState extends State<SignUpForm> {
  TextEditingController emailController = TextEditingController();

  TextEditingController passwordController = TextEditingController();

  TextEditingController usernameController = TextEditingController();

  late RegisterBloc _registerBloc;
  late bool _obscureText;

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

  void _onEmailChange() {
    _registerBloc.add(RegisterEmailChanged(email: emailController.text));
  }

  void _onPasswordChange() {
    _registerBloc
        .add(RegisterPasswordChanged(password: passwordController.text));
  }

  void _onFormSubmitted() {
    _registerBloc.add(RegisterSubmitted(
        email: emailController.text, password: passwordController.text));
  }

  bool get isPopulated =>
      emailController.text.isNotEmpty && passwordController.text.isNotEmpty;

  bool isButtonEnabled(RegisterState state) {
    return state.isFormValid && isPopulated && !state.isSubmitting;
  }

  Future<void> verifyDialog() async {
    String? result = await showAnimatedDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        //return const VerifyScreen();
        return Center(
          child: SizedBox(
            width: 250,
            height: 200,
            child: Material(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
              ),
              child: SingleChildScrollView(
                  child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Padding(
                      padding:
                          EdgeInsets.symmetric(vertical: 15, horizontal: 8),
                      child: VerifyScreen()),
                  GestureDetector(
                    onTap: () => Navigator.pop(context, 'success'),
                    child: const Padding(
                      padding:
                          EdgeInsets.symmetric(vertical: 15, horizontal: 8),
                      child: Text(
                        "OK",
                        style: AppTheme.body1,
                      ),
                    ),
                  ),
                ],
              )),
            ),
          ),
        );
      },
      animationType: DialogTransitionType.slideFromLeftFade,
      curve: Curves.fastOutSlowIn,
      duration: const Duration(seconds: 1),
    );

    if (result == 'success') {
      Navigator.of(context).pushReplacement(MaterialPageRoute(
          builder: (context) => NavigationHomeScreen()));
    }
  }

  @override
  void initState() {
    super.initState();
    _registerBloc = BlocProvider.of<RegisterBloc>(context);
    emailController.addListener(_onEmailChange);
    passwordController.addListener(_onPasswordChange);
    _obscureText = true;
  }

  @override
  void dispose() {
    emailController.dispose();
    passwordController.dispose();
    usernameController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener<RegisterBloc, RegisterState>(
      listener: (context, state) {
        if (state.isFailure) {
          buildSnackBar(context, "Sign up fail!");
        }

        if (state.isSubmitting) {
          buildSnackBar(context, "Processing...");
        }

        if (state.isSuccess) {
          BlocProvider.of<AuthenticationBloc>(context).add(
            AuthenticationLoggedIn(),
          );
          verifyDialog();
        }
      },
      child:
          BlocBuilder<RegisterBloc, RegisterState>(builder: (context, state) {
        return Padding(
          padding: EdgeInsets.symmetric(
              horizontal: MediaQuery.of(context).size.width * 0.13,
              vertical: MediaQuery.of(context).size.width * 0.13),
          child: Form(
            child: Column(
              children: [
                const Spacer(),
                Padding(
                  padding: const EdgeInsets.symmetric(
                      vertical: AppTheme.defaultPadding),
                  child: TextFormField(
                    controller: usernameController,
                    decoration: InputDecoration(
                      contentPadding: const EdgeInsets.symmetric(
                          horizontal: 8, vertical: 4),
                      labelText: "Username",
                      labelStyle: AppTheme.body1,
                      fillColor: Colors.white,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10),
                        borderSide: const BorderSide(),
                      ),
                    ),
                    autovalidateMode: AutovalidateMode.onUserInteraction,
                    autocorrect: false,
                    validator: (_) {
                      return usernameController.text.length <= 6
                          ? 'Tên đăng nhập nhiều hơn 6 kí tự!'
                          : null;
                    },
                  ),
                ),
                TextFormField(
                  controller: emailController,
                  decoration: InputDecoration(
                    contentPadding:
                        const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    labelText: "Email",
                    labelStyle: AppTheme.body1,
                    fillColor: Colors.white,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                      borderSide: const BorderSide(),
                    ),
                  ),
                  autovalidateMode: AutovalidateMode.onUserInteraction,
                  autocorrect: false,
                  validator: (_) {
                    return !state.isEmailValid ? 'Email không hợp lệ!' : null;
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
                      labelStyle: AppTheme.body1,
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
                    autovalidateMode: AutovalidateMode.onUserInteraction,
                    autocorrect: false,
                    validator: (_) {
                      return !state.isPasswordValid
                          ? 'Ít nhất 8 ký tự, ít nhất một chữ và một số!'
                          : null;
                    },
                  ),
                ),
                const SizedBox(
                  height: 10,
                ),
                Container(
                  decoration: const BoxDecoration(
                    shape: BoxShape.circle,
                    color: AppTheme.grey,
                  ),
                  child: IconButton(
                    onPressed: () {
                      print(isButtonEnabled(state));
                      if (isButtonEnabled(state)) {
                        FocusScope.of(context).requestFocus(FocusNode());
                        _onFormSubmitted();
                      }
                    },
                    icon: const Icon(
                      Icons.arrow_forward_ios,
                      color: AppTheme.notWhite,
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
                      color: Colors.black,
                    ),
                    const Text(
                      "  Or  ",
                      style: AppTheme.title,
                    ),
                    Container(
                      height: 1.5,
                      width: 70,
                      color: Colors.black,
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
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Row(
                      children: [
                        Center(
                            child: Image.asset(
                          "assets/images/google_logo.png",
                          height: 60,
                        )),
                        const Text(
                          "Login with google",
                          style: AppTheme.title,
                        )
                      ],
                    ),
                  ),
                ),
                const Spacer(flex: 1),
              ],
            ),
          ),
        );
      }),
    );
  }
}
