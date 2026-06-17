import 'package:dio/dio.dart';
import 'package:get/get.dart';
import 'package:path_provider/path_provider.dart';
import 'package:open_file/open_file.dart';
import 'api_service.dart';

class FileDownloadService {
  static final Dio _dio = ApiService().dio;

  static Future<void> downloadFile(String fileUrl) async {
    if (fileUrl.isEmpty) {
      Get.snackbar(
        'Error',
        'URL berkas tidak valid',
        snackPosition: SnackPosition.BOTTOM,
      );
      return;
    }

    // Parse the filename
    final fileName = fileUrl.split('/').last;

    // Build absolute URL if needed
    String fullUrl = fileUrl;
    if (fileUrl.startsWith('/')) {
      final baseUrl = ApiService().backendUrl;
      final cleanBaseUrl = baseUrl.endsWith('/') 
          ? baseUrl.substring(0, baseUrl.length - 1) 
          : baseUrl;
      fullUrl = '$cleanBaseUrl$fileUrl';
    }

    try {
      Get.snackbar(
        'Mengunduh',
        'Mengunduh $fileName...',
        snackPosition: SnackPosition.BOTTOM,
        showProgressIndicator: true,
        isDismissible: false,
        duration: const Duration(seconds: 2),
      );

      // Get the storage directory
      final directory = await getApplicationDocumentsDirectory();
      final savePath = '${directory.path}/$fileName';

      // Download using Dio
      await _dio.download(
        fullUrl,
        savePath,
        onReceiveProgress: (received, total) {
          if (total != -1) {
            print('Download progress: ${(received / total * 100).toStringAsFixed(0)}%');
          }
        },
      );

      Get.snackbar(
        'Unduh Selesai',
        'Ketuk di sini untuk membuka $fileName',
        snackPosition: SnackPosition.BOTTOM,
        duration: const Duration(seconds: 6),
        onTap: (_) {
          OpenFile.open(savePath);
        },
      );
    } catch (e) {
      print('Download error: $e');
      Get.snackbar(
        'Unduh Gagal',
        'Gagal mengunduh berkas: ${e.toString()}',
        snackPosition: SnackPosition.BOTTOM,
      );
    }
  }
}
