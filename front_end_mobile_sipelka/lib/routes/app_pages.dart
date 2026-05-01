import 'package:get/get.dart';
import 'package:front_end_mobile_sipelka/bindings/bindings.dart';
import 'package:front_end_mobile_sipelka/screens/screens.dart';

import 'package:front_end_mobile_sipelka/routes/app_route.dart';

class AppPages {
  static final pages = [
    GetPage(
      name: AppRoutes.login,
      page: () => LoginScreen(),
      binding: LoginBinding(),
    ),

    GetPage(name: AppRoutes.dashboard, page: () => DashboardScreen()),

    GetPage(
      name: AppRoutes.register,
      page: () => const RegisterScreen(),
      binding: RegisterBinding(),
    ),
  ];
}
