import 'dart:convert';

import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class LocalStorageService {
  static const FlutterSecureStorage _storage = FlutterSecureStorage();

  // =========================
  // WRITE
  // =========================

  static Future<void> write(String key, dynamic value) async {
    if (value is Map || value is List) {
      await _storage.write(key: key, value: jsonEncode(value));
    } else {
      await _storage.write(key: key, value: value.toString());
    }
  }

  // =========================
  // READ
  // =========================

  static Future<dynamic> read(String key) async {
    final value = await _storage.read(key: key);

    if (value == null) return null;

    try {
      return jsonDecode(value);
    } catch (_) {
      return value;
    }
  }

  // =========================
  // DELETE
  // =========================

  static Future<void> remove(String key) async {
    await _storage.delete(key: key);
  }

  // =========================
  // CLEAR ALL
  // =========================

  static Future<void> clear() async {
    await _storage.deleteAll();
  }

  // =========================
  // CHECK EXIST
  // =========================

  static Future<bool> contains(String key) async {
    return await _storage.containsKey(key: key);
  }
}
