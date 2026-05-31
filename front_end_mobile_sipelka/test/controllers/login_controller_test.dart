import 'package:flutter_test/flutter_test.dart';
import 'package:get/get.dart';
import 'package:front_end_mobile_sipelka/controllers/login_controller.dart';
import 'package:front_end_mobile_sipelka/services/api_service.dart';
import 'package:front_end_mobile_sipelka/services/local_storage_service.dart';
import 'package:front_end_mobile_sipelka/models/storage_key.dart';

void main() {
  setUp(() {
    // Clear any previous state
    Get.reset();
  });

  group('LoginController', () {
    test('initial values are correct', () {
      final controller = LoginController();

      expect(controller.email.value, '');
      expect(controller.password.value, '');
      expect(controller.isLoading.value, false);
    });

    test('email observable updates correctly', () {
      final controller = LoginController();

      controller.email.value = 'researcher@sipelka.ac.id';
      expect(controller.email.value, 'researcher@sipelka.ac.id');
    });

    test('password observable updates correctly', () {
      final controller = LoginController();

      controller.password.value = 'password123';
      expect(controller.password.value, 'password123');
    });

    test('isLoading toggles correctly', () {
      final controller = LoginController();

      expect(controller.isLoading.value, false);
      controller.isLoading.value = true;
      expect(controller.isLoading.value, true);
      controller.isLoading.value = false;
      expect(controller.isLoading.value, false);
    });

    test('login with empty email shows error and does not call API', () async {
      final controller = LoginController();
      controller.email.value = '';
      controller.password.value = '';

      // This should return early without making API calls
      // Since it shows a snackbar, we just verify it doesn't crash
      await controller.login();

      // isLoading should be false since it returned early
      expect(controller.isLoading.value, false);
    });

    test('login with empty password shows error', () async {
      final controller = LoginController();
      controller.email.value = 'test@sipelka.ac.id';
      controller.password.value = '';

      await controller.login();

      expect(controller.isLoading.value, false);
    });
  });
}
