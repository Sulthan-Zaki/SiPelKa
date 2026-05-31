import 'package:get/get.dart';
import 'package:front_end_mobile_sipelka/controllers/proposal_controller.dart';

class ProposalBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<ProposalController>(() => ProposalController());
  }
}
