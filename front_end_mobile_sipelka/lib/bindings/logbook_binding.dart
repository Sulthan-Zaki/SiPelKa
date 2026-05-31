import 'package:get/get.dart';
import 'package:front_end_mobile_sipelka/controllers/logbook_controller.dart';

class LogbookBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<LogbookController>(() => LogbookController());
  }
}
