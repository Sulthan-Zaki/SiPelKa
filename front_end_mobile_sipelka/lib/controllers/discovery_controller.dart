import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:front_end_mobile_sipelka/models/grant.dart';
import 'package:front_end_mobile_sipelka/services/grant_service.dart';

import 'package:front_end_mobile_sipelka/services/local_storage_service.dart';
import 'package:front_end_mobile_sipelka/models/storage_key.dart';

class DiscoveryController extends GetxController {
  final grants = <Grant>[].obs;
  final isLoading = false.obs;
  final searchQuery = ''.obs;
  final selectedFilter = 'All'.obs;
  final bookmarkedGrantIds = <String>[].obs;
  final searchController = TextEditingController();

  List<Grant> get filteredGrants {
    var result = grants.toList();
    if (selectedFilter.value == 'Bookmarked') {
      result = result
          .where((g) => bookmarkedGrantIds.contains(g.id))
          .toList();
    } else if (selectedFilter.value != 'All') {
      result = result
          .where((g) =>
              g.bidangFokus?.toLowerCase() ==
              selectedFilter.value.toLowerCase())
          .toList();
    }

    if (searchQuery.value.isNotEmpty) {
      result = result
          .where((g) => g.namaProgram
              .toLowerCase()
              .contains(searchQuery.value.toLowerCase()))
          .toList();
    }
    return result;
  }

  List<String> get availableFilters {
    final categories = grants
        .map((g) => g.bidangFokus)
        .where((c) => c != null && c.trim().isNotEmpty)
        .map((c) => _capitalize(c!.trim()))
        .toSet()
        .toList();
    categories.sort();
    return ['All', 'Bookmarked', ...categories];
  }

  String _capitalize(String s) {
    if (s.isEmpty) return s;
    return s[0].toUpperCase() + s.substring(1);
  }

  @override
  void onInit() {
    super.onInit();
    loadBookmarks();
    loadGrants();
  }

  Future<void> loadBookmarks() async {
    try {
      final list = await LocalStorageService.read(StorageKey.bookmarks);
      if (list is List) {
        bookmarkedGrantIds.value = list.map((e) => e.toString()).toList();
      }
    } catch (_) {}
  }

  Future<void> toggleBookmark(String grantId) async {
    try {
      if (bookmarkedGrantIds.contains(grantId)) {
        bookmarkedGrantIds.remove(grantId);
      } else {
        bookmarkedGrantIds.add(grantId);
      }
      await LocalStorageService.write(StorageKey.bookmarks, bookmarkedGrantIds.toList());
    } catch (_) {}
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

  void clearSearchQuery() {
    searchQuery.value = '';
    searchController.clear();
  }

  @override
  void onClose() {
    searchController.dispose();
    super.onClose();
  }
}
