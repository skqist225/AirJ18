import 'package:book_hotel/app_theme.dart';
import 'package:book_hotel/blocs/login_bloc/login_bloc.dart';
import 'package:book_hotel/blocs/login_bloc/login_event.dart';
import 'package:book_hotel/blocs/login_bloc/login_state.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class ResetPasswordDialog extends StatefulWidget {
  const ResetPasswordDialog({Key? key}) : super(key: key);

  @override
  _ResetPasswordDialogState createState() => _ResetPasswordDialogState();
}

class _ResetPasswordDialogState extends State<ResetPasswordDialog> {
  final TextEditingController _emailController = TextEditingController();

  late LoginBloc _loginBloc;

  void _onEmailChange() {
    _loginBloc.add(LoginEmailChange(email: _emailController.text));
  }

  bool get isPopulated => _emailController.text.isNotEmpty;

  bool isButtonEnabled(LoginState state) {
    return state.isFormValid && isPopulated && !state.isSubmitting;
  }

  @override
  void initState() {
    super.initState();
    _loginBloc = BlocProvider.of<LoginBloc>(context);
    _emailController.addListener(_onEmailChange);
  }

  @override
  void dispose() {
    super.dispose();
    _emailController.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener<LoginBloc, LoginState>(
      listener: (context, state) {
        if (state.isSubmitting) {
          ScaffoldMessenger.of(context)
            ..removeCurrentSnackBar()
            ..showSnackBar(
              SnackBar(
                content: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: const [
                    Text(
                      'Sending request... ',
                      style: AppTheme.body1,
                    ),
                    CircularProgressIndicator(
                      valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                    )
                  ],
                ),
                backgroundColor: AppTheme.dark.withOpacity(0.2),
              ),
            );
        }
        if (state.isSuccess) {
          ScaffoldMessenger.of(context)
            ..removeCurrentSnackBar()
            ..showSnackBar(
              SnackBar(
                content: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Sent!',
                      style: AppTheme.body1.copyWith(color: Colors.white),
                    ),
                  ],
                ),
                backgroundColor: AppTheme.dark.withOpacity(0.2),
              ),
            );
        }
      },
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Padding(
            padding: EdgeInsets.all(10.0),
            child: Text(
              'Đặt lại mật khẩu?',
              style: AppTheme.title,
            ),
          ),
          const SizedBox(
            height: 20,
          ),
          BlocBuilder<LoginBloc, LoginState>(
            builder: (context, state) {
              return Padding(
                padding: const EdgeInsets.all(8.0),
                child: Form(
                  child: Column(
                    children: <Widget>[
                      TextFormField(
                        controller: _emailController,
                        style: AppTheme.body1,
                        decoration: InputDecoration(
                          labelText: "Email",
                          labelStyle: AppTheme.body1,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(10),
                            borderSide: const BorderSide(),
                          ),
                        ),
                        keyboardType: TextInputType.emailAddress,
                        autovalidateMode: AutovalidateMode.always,
                        autocorrect: false,
                        validator: (_) {
                          return !state.isEmailValid
                              ? 'Email không hợp lệ!'
                              : null;
                        },
                      ),
                      const SizedBox(
                        height: 20,
                      ),
                      IconButton(
                        onPressed: () {
                          if (isButtonEnabled(state)) {
                            _loginBloc.add(LoginEventForgotPassWord(
                                email: _emailController.text));
                            Navigator.pop(context);
                          }
                        },
                        icon: const Icon(
                          Icons.send_and_archive_outlined,
                          color: Colors.black,
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}
