import 'package:flutter/material.dart';
import 'theme/app_theme.dart';
import 'package:get/get.dart';
import 'services/local_storage_service.dart';
import 'models/storage_key.dart';
import 'routes/app_pages.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'services/api_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  try {
    await dotenv.load(fileName: ".env");
  } catch (_) {
    // .env file is optional; BACKEND_URL defaults to compile-time define
  }

  await ApiService.init();
  final token = await LocalStorageService.read(StorageKey.token);
  final isLoggedIn = await LocalStorageService.read(StorageKey.isLoggedIn);
  final initialRoute = (token != null && isLoggedIn == true)
      ? '/main'
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
