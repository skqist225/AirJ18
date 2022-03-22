import 'package:equatable/equatable.dart';

abstract class LoginEvent extends Equatable {
  @override
  List<Object> get props => [];
}

class LoginEmailChange extends LoginEvent {
  final String email;

  LoginEmailChange({required this.email});

  @override
  List<Object> get props => [email];
}

class LoginPasswordChanged extends LoginEvent {
  final String password;

  LoginPasswordChanged({required this.password});

  @override
  List<Object> get props => [password];
}
//Press sign in with google
class LoginEventWithGooglePressed extends LoginEvent {}

class LoginWithCredentialsPressed extends LoginEvent {
  final String email;
  final String password;

  LoginWithCredentialsPressed({required this.email, required this.password});

  @override
  List<Object> get props => [email, password];
}
class LoginEventForgotPassWord extends LoginEvent {
  final String email;

  LoginEventForgotPassWord({required this.email});

  @override
  List<Object> get props => [email];
}
