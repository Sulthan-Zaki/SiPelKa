import 'package:get/get.dart';

import 'package:front_end_mobile_sipelka/controllers/login_controller.dart';

class LoginBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<LoginController>(() => LoginController());
  }
}
