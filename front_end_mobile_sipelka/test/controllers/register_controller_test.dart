import 'package:flutter_test/flutter_test.dart';
import 'package:get/get.dart';
import 'package:front_end_mobile_sipelka/controllers/register_controller.dart';

void main() {
  setUp(() {
    Get.reset();
  });

  group('RegisterController', () {
    test('initial values are correct', () {
      final controller = RegisterController();

      expect(controller.name.value, '');
      expect(controller.email.value, '');
      expect(controller.nip.value, '');
      expect(controller.role.value, '');
      expect(controller.password.value, '');
      expect(controller.isLoading.value, false);
    });

    test('observables update correctly', () {
      final controller = RegisterController();

      controller.name.value = 'Dr. Test User';
      controller.email.value = 'test@sipelka.ac.id';
      controller.nip.value = '199001012010011001';
      controller.role.value = 'RESEARCHER';
      controller.password.value = 'password123';

      expect(controller.name.value, 'Dr. Test User');
      expect(controller.email.value, 'test@sipelka.ac.id');
      expect(controller.nip.value, '199001012010011001');
      expect(controller.role.value, 'RESEARCHER');
      expect(controller.password.value, 'password123');
    });

    test('register with empty fields shows error', () async {
      final controller = RegisterController();

      await controller.register();

      expect(controller.isLoading.value, false);
    });

    test('register with partial fields shows error', () async {
      final controller = RegisterController();
      controller.name.value = 'Dr. Test';
      controller.email.value = 'test@sipelka.ac.id';

      await controller.register();

      expect(controller.isLoading.value, false);
    });
  });
}
