import 'package:dio/dio.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:get/get.dart' hide Response, MultipartFile, FormData;
import 'local_storage_service.dart';
import '../models/storage_key.dart';

class ApiService {
  static final ApiService _instance = ApiService._internal();

  factory ApiService() => _instance;

  late final Dio dio;

  String get backendUrl {
    final fromEnv = const String.fromEnvironment('BACKEND_URL');
    if (fromEnv.isNotEmpty) return fromEnv;
    try {
      final url_be = dotenv.env['BACKEND_URL'] ?? 'http://192.168.0.102:8080';
      print('Using backend URL: $url_be');
      return url_be;
    } catch (_) {
      return 'http://192.168.0.102:8080';
    }
  }

  ApiService._internal() {
    dio = Dio(
      BaseOptions(
        baseUrl: backendUrl,
        connectTimeout: const Duration(seconds: 10),
        receiveTimeout: const Duration(seconds: 10),
        headers: {'Content-Type': 'application/json'},
      ),
    );

    dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final token = await LocalStorageService.read(StorageKey.token);
          print('Token from storage: $token');
          if (token != null) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          print(
            "REQUEST => method: ${options.method}, path: ${options.baseUrl}${options.path} \n headers: ${options.headers}",
          );
          print("DATA => ${options.data}");
          return handler.next(options);
        },
        onResponse: (response, handler) {
          print(
            "RESPONSE => baseUrl: ${response.requestOptions.baseUrl} ${response.requestOptions.path}, statusCode: ${response.statusCode}",
          );
          print("BODY => ${response.data}");
          return handler.next(response);
        },
        onError: (DioException e, handler) async {
          print(
            "ERROR => baseUrl: ${e.requestOptions.baseUrl} ${e.requestOptions.path}\n message: ${e.message}",
          );
          if (e.response?.statusCode == 401 || e.response?.statusCode == 403) {
            print("Token expired or unauthorized (401/403). Clearing session and redirecting to login.");
            await LocalStorageService.clear();
            _instance.clearToken();
            Get.snackbar(
              'Sesi Berakhir',
              'Sesi Anda telah berakhir, silakan login kembali.',
              snackPosition: SnackPosition.BOTTOM,
            );
            Get.offAllNamed('/login');
          }
          return handler.next(e);
        },
      ),
    );
  }

  static Future<void> init() async {
    final token = await LocalStorageService.read(StorageKey.token);
    if (token != null) {
      _instance.setToken(token as String);
    }
  }

  Future<Response> get(
    String path, {
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    return await dio.get(
      path,
      queryParameters: queryParameters,
      options: options,
    );
  }

  Future<Response> post(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    return await dio.post(
      path,
      data: data,
      queryParameters: queryParameters,
      options: options,
    );
  }

  Future<Response> put(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    return await dio.put(
      path,
      data: data,
      queryParameters: queryParameters,
      options: options,
    );
  }

  Future<Response> delete(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    return await dio.delete(
      path,
      data: data,
      queryParameters: queryParameters,
      options: options,
    );
  }

  void setToken(String token) {
    dio.options.headers['Authorization'] = 'Bearer $token';
  }

  void clearToken() {
    dio.options.headers.remove('Authorization');
  }

  Future<Response> uploadFile(String path, String filePath) async {
    final formData = FormData.fromMap({
      'file': await MultipartFile.fromFile(filePath),
    });
    return await dio.post(path, data: formData);
  }
}
