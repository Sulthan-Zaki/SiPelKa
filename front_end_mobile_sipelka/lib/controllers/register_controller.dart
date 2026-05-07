import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:front_end_mobile_sipelka/services/api_service.dart';
import 'package:front_end_mobile_sipelka/services/local_storage_service.dart';
import 'package:front_end_mobile_sipelka/models/storage_key.dart';

class RegisterController extends GetxController {
  final name = ''.obs;
  final email = ''.obs;
  final nip = ''.obs;
  final role = ''.obs;
  final password = ''.obs;
  final isLoading = false.obs;

  final ApiService apiService = ApiService();

  Future<void> register() async {
    if (name.value.isEmpty ||
        email.value.isEmpty ||
        nip.value.isEmpty ||
        role.value.isEmpty ||
        password.value.isEmpty) {
      Get.snackbar(
        'Error',
        'All fields are required',
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Get.theme.colorScheme.error,
      );
      return;
    }

    isLoading.value = true;

    try {
      final response = await apiService.post(
        '/api/users/register/user',
        data: {
          'name': name.value,
          'email': email.value,
          'nip': nip.value,
          'role': role.value.toUpperCase(),
          'password': password.value,
        },
      );
      if (response.statusCode != 200) {
        throw Exception('Failed to register ${response.statusCode}');
      }

      if (response.statusCode == 200) {
        Get.snackbar(
          'Success',
          'Registered successfully. Please wait for admin activation.',
          snackPosition: SnackPosition.BOTTOM,
          backgroundColor: Color(0xFF1B5E20),
          duration: const Duration(seconds: 4),
        );
        Future.delayed(const Duration(seconds: 1), () {
          isLoading.value = false;
          Get.toNamed('/login');
        });
      }
    } catch (e) {
      Get.snackbar(
        'Error',
        'Failed to register. Please try again.}',
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Get.theme.colorScheme.error,
      );
    } finally {
      isLoading.value = false;
    }
  }
}
