import 'package:get/get.dart';
import 'package:front_end_mobile_sipelka/controllers/register_controller.dart';

class RegisterBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut(() => RegisterController());
  }
}
