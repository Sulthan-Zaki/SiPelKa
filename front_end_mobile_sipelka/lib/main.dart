import 'package:flutter/material.dart';
import 'theme/app_theme.dart';
import 'screens/login_screen.dart';
import 'package:get/get.dart';
import 'services/local_storage_service.dart';
import 'models/storage_key.dart';
import 'routes/app_pages.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await dotenv.load(fileName: ".env");
  final token = await LocalStorageService.read(StorageKey.token);
  final isLoggedIn = await LocalStorageService.read(StorageKey.isLoggedIn);
  final initialRoute = (token != null && isLoggedIn == true)
      ? '/dashboard'
      : '/login';

  runApp(MyApp(initialRoute: initialRoute));
}

class MyApp extends StatelessWidget {
  final String initialRoute;
  const MyApp({super.key, required this.initialRoute});

  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      title: 'SiPelKa',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      initialRoute: initialRoute,
      getPages: AppPages.pages,
    );
  }
}
