import 'package:get/get.dart';
import 'package:file_picker/file_picker.dart';
import 'package:front_end_mobile_sipelka/services/api_service.dart';
import 'package:front_end_mobile_sipelka/services/local_storage_service.dart';
import 'package:front_end_mobile_sipelka/models/storage_key.dart';

class ProfileController extends GetxController {
  final name = ''.obs;
  final nip = ''.obs;
  final role = ''.obs;
  final profilePhotoUrl = ''.obs;
  final isLoading = false.obs;

  @override
  void onInit() {
    super.onInit();
    _loadUserData();
  }

  Future<void> _loadUserData() async {
    final userData = await LocalStorageService.read(StorageKey.user);
    if (userData is Map) {
      name.value = userData['name'] as String? ?? '';
      nip.value = userData['nip'] as String? ?? '';
      role.value = userData['role'] as String? ?? '';
      profilePhotoUrl.value = userData['profilePhotoUrl'] as String? ?? '';
    }
  }

  Future<void> uploadProfilePhoto() async {
    try {
      final result = await FilePicker.platform.pickFiles(
        type: FileType.image,
      );

      if (result == null || result.files.single.path == null) return;

      isLoading.value = true;
      Get.snackbar(
        'Mengunggah',
        'Mengunggah foto profil baru...',
        snackPosition: SnackPosition.BOTTOM,
        showProgressIndicator: true,
        isDismissible: false,
      );

      final filePath = result.files.single.path!;
      
      // 1. Upload file
      final uploadResponse = await ApiService().uploadFile('/api/upload', filePath);
      if (uploadResponse.statusCode != 200) {
        throw Exception('Gagal mengunggah gambar');
      }

      final uploadedUrl = uploadResponse.data['url'] as String;

      // 2. Update user profile photo
      final userData = await LocalStorageService.read(StorageKey.user);
      final userId = userData is Map ? userData['id'] as String? : null;
      if (userId == null) {
        throw Exception('ID pengguna tidak ditemukan');
      }

      final updateResponse = await ApiService().put(
        '/api/users/$userId/profile-photo',
        queryParameters: {'profilePhotoUrl': uploadedUrl},
      );

      if (updateResponse.statusCode != 200) {
        throw Exception('Gagal memperbarui foto profil');
      }

      // 3. Save to local storage
      final updatedUser = Map<String, dynamic>.from(userData as Map);
      updatedUser['profilePhotoUrl'] = uploadedUrl;
      await LocalStorageService.write(StorageKey.user, updatedUser);

      // 4. Update state
      profilePhotoUrl.value = uploadedUrl;

      Get.snackbar(
        'Sukses',
        'Foto profil berhasil diperbarui!',
        snackPosition: SnackPosition.BOTTOM,
      );
    } catch (e) {
      print('Profile photo upload error: $e');
      Get.snackbar(
        'Gagal',
        'Gagal memperbarui foto profil: ${e.toString()}',
        snackPosition: SnackPosition.BOTTOM,
      );
    } finally {
      isLoading.value = false;
    }
  }
}
