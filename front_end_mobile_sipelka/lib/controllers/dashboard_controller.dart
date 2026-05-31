import 'package:get/get.dart';
import 'package:front_end_mobile_sipelka/services/local_storage_service.dart';
import 'package:front_end_mobile_sipelka/models/storage_key.dart';
import 'package:front_end_mobile_sipelka/models/dashboard_stats.dart';
import 'package:front_end_mobile_sipelka/models/logbook.dart';
import 'package:front_end_mobile_sipelka/services/proposal_service.dart';
import 'package:front_end_mobile_sipelka/services/notification_service.dart';

class DashboardController extends GetxController {
  final userName = ''.obs;
  final userNip = ''.obs;
  final activeGrants = 0.obs;
  final totalProposals = 0.obs;
  final isLoading = false.obs;
  final recentLogbooks = <Logbook>[].obs;
  final upcomingDeadlines = <Deadline>[].obs;
  final unreadNotifications = 0.obs;

  @override
  void onInit() {
    super.onInit();
    _loadUserData();
    loadDashboard();
    loadNotifications();
  }

  Future<void> _loadUserData() async {
    final userData = await LocalStorageService.read(StorageKey.user);
    if (userData is Map) {
      userName.value = userData['name'] as String? ?? '';
      userNip.value = userData['nip'] as String? ?? '';
    }
  }

  Future<void> loadDashboard() async {
    isLoading.value = true;
    try {
      final userData = await LocalStorageService.read(StorageKey.user);
      final penelitiId = userData is Map ? userData['id'] as String? : null;
      if (penelitiId == null) {
        isLoading.value = false;
        return;
      }

      final stats = await ProposalService().getResearcherStats(penelitiId);
      activeGrants.value = stats.activeGrants;
      totalProposals.value = stats.totalProposals;
      recentLogbooks.value = stats.recentLogbooks;
      upcomingDeadlines.value = stats.upcomingDeadlines;
    } catch (e) {
      Get.snackbar('Error', 'Failed to load dashboard data');
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> loadNotifications() async {
    try {
      final userData = await LocalStorageService.read(StorageKey.user);
      final userId = userData is Map ? userData['id'] as String? : null;
      if (userId == null) return;

      final notifications =
          await NotificationService().getNotificationsByUser(userId);
      unreadNotifications.value =
          notifications.where((n) => n.isRead == false).length;
    } catch (e) {
      // Silently fail
    }
  }
}
