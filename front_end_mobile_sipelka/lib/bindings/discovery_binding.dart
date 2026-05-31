import 'package:get/get.dart';
import 'package:front_end_mobile_sipelka/controllers/discovery_controller.dart';

class DiscoveryBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<DiscoveryController>(() => DiscoveryController());
  }
}
