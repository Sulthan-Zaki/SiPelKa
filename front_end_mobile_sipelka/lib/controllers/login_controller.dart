import 'package:get/get.dart';
import 'package:flutter/material.dart';
import 'package:front_end_mobile_sipelka/services/api_service.dart';
import 'package:front_end_mobile_sipelka/services/local_storage_service.dart';
import 'package:front_end_mobile_sipelka/models/storage_key.dart';
import 'package:front_end_mobile_sipelka/screens/main_navigation.dart';
import 'package:front_end_mobile_sipelka/services/fcm_handler.dart';

class LoginController extends GetxController {
  final email = ''.obs;
  final password = ''.obs;
  final isLoading = false.obs;

  final ApiService apiService = ApiService();

  Future<void> login() async {
    if (email.value.isEmpty || password.value.isEmpty) {
      Get.snackbar(
        'Error',
        'Email and password cannot be empty',
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Get.theme.colorScheme.error,
      );
      return;
    }

    isLoading.value = true;

    try {
      final fcmToken = await FcmHandler.instance.getFcmToken();
      final response = await apiService.post(
        '/api/users/login',
        data: {
          'email': email.value,
          'password': password.value,
          'fcmToken': fcmToken,
        },
      );
      if (response.statusCode != 200) {
        throw Exception('Failed to login');
      }
      final token = response.data['token'];
      final user = response.data['user'];
      await LocalStorageService.write(StorageKey.token, token);
      await LocalStorageService.write(StorageKey.user, user);
      await LocalStorageService.write(StorageKey.isLoggedIn, true);
      apiService.setToken(token);

      Get.snackbar(
        'Success',
        'Logged in successfully',
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Get.theme.colorScheme.primary,
        duration: const Duration(seconds: 1),
      );
      Get.to(() => const MainNavigation());
    } catch (e) {
      Get.snackbar(
        'Error',
        'Failed to login. Please check your credentials and try again.',
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Get.theme.colorScheme.error,
      );
    } finally {
      isLoading.value = false;
    }
  }
}
