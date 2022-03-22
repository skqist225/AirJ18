import 'package:book_hotel/commons/validators.dart';
import 'package:book_hotel/repositories/user_repository.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'login_event.dart';
import 'login_state.dart';

class LoginBloc extends Bloc<LoginEvent, LoginState> {
  final UserRepository _userRepository;

  LoginBloc({required UserRepository userRepository})
      : _userRepository = userRepository,
        super(LoginState.initial());

  @override
  Stream<LoginState> mapEventToState(LoginEvent event) async* {
    if (event is LoginEmailChange) {
      yield* _mapLoginEmailChangeToState(event.email);
    } else if (event is LoginPasswordChanged) {
      yield* _mapLoginPasswordChangeToState(event.password);
    } else if (event is LoginEventWithGooglePressed) {
      yield* _mapLoginWithGooglePressedToState();
    } else if (event is LoginWithCredentialsPressed) {
      yield* _mapLoginWithCredentialsPressedToState(
          email: event.email, password: event.password);
    }else if (event is LoginEventForgotPassWord){
      yield* _mapResetPasswordPressedToState(
                email: event.email);
          }
        }
      
        Stream<LoginState> _mapLoginEmailChangeToState(String email) async* {
          yield state.update(isEmailValid: Validators.isValidEmail(email));
        }
      
        Stream<LoginState> _mapLoginPasswordChangeToState(String password) async* {
          yield state.update(isPasswordValid: Validators.isValidPassword(password));
        }
      
        Stream<LoginState> _mapLoginWithCredentialsPressedToState(
            {required String email, required String password}) async* {
          yield LoginState.loading();
          try {
            await _userRepository.signInWithCredentials(email, password);
            yield LoginState.success();
          } catch (_) {
            yield LoginState.failure();
          }
        }
      
        Stream<LoginState> _mapLoginWithGooglePressedToState() async* {
          yield LoginState.loading();
          try {
              await _userRepository.signInWithGoogle();
              yield LoginState.success();
          } catch (_) {
              yield LoginState.failure();
            }
        }
      
        Stream<LoginState> _mapResetPasswordPressedToState({required String email}) async* {
          yield LoginState.loading();
          await _userRepository.resetPassword(email);
        }
}
