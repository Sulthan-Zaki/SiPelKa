import 'package:get/get.dart';
import 'package:front_end_mobile_sipelka/models/grant.dart';
import 'package:front_end_mobile_sipelka/services/grant_service.dart';
import 'package:front_end_mobile_sipelka/services/proposal_service.dart';
import 'package:front_end_mobile_sipelka/services/api_service.dart';

class ProposalController extends GetxController {
  final grants = <Grant>[].obs;
  final isLoading = false.obs;
  final isUploading = false.obs;
  final selectedGrant = Rx<Grant?>(null);
  final selectedFileName = ''.obs;

  @override
  void onInit() {
    super.onInit();
    loadGrants();
  }

  Future<void> loadGrants() async {
    try {
      grants.value = await GrantService().getOpenGrants();
    } catch (e) {
      Get.snackbar('Error', 'Failed to load grants');
    }
  }

  void selectGrant(Grant grant) {
    selectedGrant.value = grant;
  }

  Future<void> submitProposal(
      String title, String abstrak, String? filePath) async {
    if (title.isEmpty) {
      Get.snackbar('Error', 'Research title is required');
      return;
    }
    if (selectedGrant.value == null) {
      Get.snackbar('Error', 'Please select a funding scheme');
      return;
    }

    isLoading.value = true;

    try {
      String? dokumenUrl;
      if (filePath != null && filePath.isNotEmpty) {
        isUploading.value = true;
        final uploadResponse =
            await ApiService().uploadFile('/api/upload', filePath);
        isUploading.value = false;
        dokumenUrl = uploadResponse.data['url'] as String?;
      }

      final proposal = await ProposalService().createProposal({
        'hibahId': selectedGrant.value!.id,
        'judulPenelitian': title,
        'ringkasan': abstrak,
        'bidangPenelitian': selectedGrant.value!.bidangFokus ?? '',
        'dokumenUrl': dokumenUrl,
      });

      await ProposalService().submitProposal(proposal.id);

      Get.snackbar('Success', 'Proposal submitted successfully!');
      Get.back();
    } catch (e) {
      Get.snackbar('Error', 'Failed to submit proposal');
    } finally {
      isLoading.value = false;
      isUploading.value = false;
    }
  }
}
