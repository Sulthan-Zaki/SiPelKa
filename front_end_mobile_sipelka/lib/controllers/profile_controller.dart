import 'package:get/get.dart';
import 'package:front_end_mobile_sipelka/services/local_storage_service.dart';
import 'package:front_end_mobile_sipelka/models/storage_key.dart';

class ProfileController extends GetxController {
  final name = ''.obs;
  final nip = ''.obs;
  final role = ''.obs;

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
    }
  }
}
