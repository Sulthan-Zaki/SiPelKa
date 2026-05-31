import 'package:get/get.dart';
import 'package:front_end_mobile_sipelka/models/grant.dart';
import 'package:front_end_mobile_sipelka/services/grant_service.dart';

class DiscoveryController extends GetxController {
  final grants = <Grant>[].obs;
  final isLoading = false.obs;
  final searchQuery = ''.obs;
  final selectedFilter = 'All'.obs;

  List<Grant> get filteredGrants {
    var result = grants.toList();
    if (searchQuery.value.isNotEmpty) {
      result = result
          .where((g) => g.namaProgram
              .toLowerCase()
              .contains(searchQuery.value.toLowerCase()))
          .toList();
    }
    if (selectedFilter.value != 'All') {
      result = result
          .where((g) =>
              g.bidangFokus?.toLowerCase() ==
              selectedFilter.value.toLowerCase())
          .toList();
    }
    return result;
  }

  @override
  void onInit() {
    super.onInit();
    loadGrants();
  }

  Future<void> loadGrants() async {
    isLoading.value = true;
    try {
      grants.value = await GrantService().getOpenGrants();
    } catch (e) {
      Get.snackbar('Error', 'Failed to load grants');
    } finally {
      isLoading.value = false;
    }
  }

  void setFilter(String filter) {
    selectedFilter.value = filter;
  }

  void setSearchQuery(String query) {
    searchQuery.value = query;
  }
}
