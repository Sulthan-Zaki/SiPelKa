import 'package:get/get.dart';
import 'package:front_end_mobile_sipelka/models/logbook.dart';
import 'package:front_end_mobile_sipelka/models/proposal.dart';
import 'package:front_end_mobile_sipelka/services/logbook_service.dart';
import 'package:front_end_mobile_sipelka/services/proposal_service.dart';
import 'package:front_end_mobile_sipelka/services/local_storage_service.dart';
import 'package:front_end_mobile_sipelka/models/storage_key.dart';

class LogbookController extends GetxController {
  final logbooks = <Logbook>[].obs;
  final isLoading = false.obs;
  final proposalId = ''.obs;
  final proposals = <Proposal>[].obs;

  Map<String, List<Logbook>> get groupedLogbooks {
    final map = <String, List<Logbook>>{};
    for (final logbook in logbooks) {
      final monthYear = _formatMonthYear(logbook.tanggalKegiatan);
      map.putIfAbsent(monthYear, () => []);
      map[monthYear]!.add(logbook);
    }
    return map;
  }

  List<String> get sortedMonths {
    final keys = groupedLogbooks.keys.toList();
    keys.sort((a, b) {
      final aDate = _parseMonthYear(a);
      final bDate = _parseMonthYear(b);
      return bDate.compareTo(aDate);
    });
    return keys;
  }

  String _formatMonthYear(DateTime date) {
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
    ];
    return '${months[date.month - 1]} ${date.year}';
  }

  DateTime _parseMonthYear(String monthYear) {
    const months = {
      'Januari': 1, 'Februari': 2, 'Maret': 3, 'April': 4,
      'Mei': 5, 'Juni': 6, 'Juli': 7, 'Agustus': 8,
      'September': 9, 'Oktober': 10, 'November': 11, 'Desember': 12,
    };
    final parts = monthYear.split(' ');
    final month = months[parts[0]] ?? 1;
    final year = int.parse(parts[1]);
    return DateTime(year, month);
  }

  @override
  void onInit() {
    super.onInit();
    loadLogbooks();
  }

  Future<void> loadLogbooks() async {
    isLoading.value = true;
    try {
      final userData = await LocalStorageService.read(StorageKey.user);
      final userId = userData is Map ? userData['id'] as String? : null;
      if (userId == null) return;

      final userProposals =
          await ProposalService().getProposalsByResearcher(userId);
      proposals.value = userProposals;

      final allLogbooks = <Logbook>[];
      for (final proposal in userProposals) {
        final proposalLogbooks =
            await LogbookService().getLogbooksByProposal(proposal.id);
        allLogbooks.addAll(proposalLogbooks);
      }
      allLogbooks.sort(
          (a, b) => b.tanggalKegiatan.compareTo(a.tanggalKegiatan));
      logbooks.value = allLogbooks;
    } catch (e) {
      Get.snackbar('Error', 'Failed to load logbooks');
    } finally {
      isLoading.value = false;
    }
  }

  @override
  Future<void> refresh() async {
    await loadLogbooks();
  }

  Future<void> addLogbook(Map<String, dynamic> data) async {
    try {
      await LogbookService().createLogbook(data);
      await refresh();
      Get.snackbar('Success', 'Logbook entry added');
    } catch (e) {
      Get.snackbar('Error', 'Failed to add logbook entry');
    }
  }

  Future<void> deleteLogbook(String id) async {
    try {
      await LogbookService().deleteLogbook(id);
      await refresh();
      Get.snackbar('Success', 'Logbook entry deleted');
    } catch (e) {
      Get.snackbar('Error', 'Failed to delete logbook entry');
    }
  }
}
