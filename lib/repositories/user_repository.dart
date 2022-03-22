import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';


class UserRepository {
  final FirebaseAuth _firebaseAuth;
  final GoogleSignIn _googleSignIn;

  UserRepository()
      : _firebaseAuth = FirebaseAuth.instance,
        _googleSignIn = GoogleSignIn();

  Future<User?> signInWithGoogle() async {
    final GoogleSignInAccount? googleSignInAccount =
        await _googleSignIn.signIn();
    final GoogleSignInAuthentication googleSignInAuthentication =
        await googleSignInAccount!.authentication;
    final AuthCredential credential = GoogleAuthProvider.credential(
      idToken: googleSignInAuthentication.idToken,
      accessToken: googleSignInAuthentication.accessToken,
    );

    await _firebaseAuth.signInWithCredential(credential);
  }

  Future<void> signInWithCredentials(String email, String password) {
    return _firebaseAuth.signInWithEmailAndPassword(
        email: email, password: password);
  }

  Future<UserCredential> signUp(String email, String password) async {
    return await _firebaseAuth.createUserWithEmailAndPassword(
      email: email,
      password: password,
    );
  }

  Future<void> signOut() async {
    return await _firebaseAuth.signOut();
  }

  Future<void> resetPassword(String email) async {
    return await _firebaseAuth.sendPasswordResetEmail(
      email: email,
    );
  }

  Future<bool> isSignedIn() async {
    final currentUser = await _firebaseAuth.currentUser;
    return currentUser != null;
  }

  Future<User?> getUser() async {
    return _firebaseAuth.currentUser;
  }

  // Future<String> uploadPhoto(File file, String path) async {
  //   try {
  //     final ref = firebase_storage.FirebaseStorage.instance.ref(path);
  //     final uploadTask = ref.putFile(file);
  //     await uploadTask;
  //     return await ref.getDownloadURL();
  //   } on FirebaseException catch (e) {
  //     print("Error: $e");
  //   }
  //   return null;
  // }

  // Future<String> getPhoto(String path) async {
  //   try {
  //     final ref = firebase_storage.FirebaseStorage.instance.ref(path);
  //     return await ref.getDownloadURL();
  //   } on FirebaseException catch (e) {
  //     print("Error: $e");
  //   }
  //   return null;
  // }

}
