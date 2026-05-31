import 'package:flutter_test/flutter_test.dart';
import 'package:front_end_mobile_sipelka/services/local_storage_service.dart';
import 'package:front_end_mobile_sipelka/models/storage_key.dart';

void main() {
  group('LocalStorageService', () {
    test('write and read string value', () async {
      await LocalStorageService.write(StorageKey.token, 'test-token');
      final value = await LocalStorageService.read(StorageKey.token);

      expect(value, 'test-token');
    });

    test('write and read map value', () async {
      final userData = {
        'name': 'Dr. Test',
        'email': 'test@sipelka.ac.id',
        'role': 'RESEARCHER',
      };

      await LocalStorageService.write(StorageKey.user, userData);
      final value = await LocalStorageService.read(StorageKey.user);

      expect(value, isA<Map>());
      expect((value as Map)['name'], 'Dr. Test');
      expect(value['email'], 'test@sipelka.ac.id');
    });

    test('write and read boolean value', () async {
      await LocalStorageService.write(StorageKey.isLoggedIn, true);
      final value = await LocalStorageService.read(StorageKey.isLoggedIn);

      expect(value, true);
    });

    test('remove removes value', () async {
      await LocalStorageService.write(StorageKey.token, 'to-remove');
      await LocalStorageService.remove(StorageKey.token);
      final value = await LocalStorageService.read(StorageKey.token);

      expect(value, isNull);
    });

    test('contains returns correct existence', () async {
      await LocalStorageService.write(StorageKey.token, 'exists');
      await LocalStorageService.remove(StorageKey.isLoggedIn);

      expect(await LocalStorageService.contains(StorageKey.token), true);
      expect(await LocalStorageService.contains(StorageKey.isLoggedIn), false);
    });

    test('clear removes all values', () async {
      await LocalStorageService.write('key1', 'value1');
      await LocalStorageService.write('key2', 'value2');
      await LocalStorageService.clear();

      expect(await LocalStorageService.read('key1'), isNull);
      expect(await LocalStorageService.read('key2'), isNull);
    });

    test('read returns null for non-existent key', () async {
      final value = await LocalStorageService.read('non-existent-key');
      expect(value, isNull);
    });
  });
}
