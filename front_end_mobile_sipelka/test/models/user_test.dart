import 'package:flutter_test/flutter_test.dart';
import 'package:front_end_mobile_sipelka/models/user.dart';

void main() {
  group('User Model', () {
    const testJson = {
      'id': '550e8400-e29b-41d4-a716-446655440000',
      'name': 'Dr. Budi Santoso',
      'email': 'researcher1@sipelka.ac.id',
      'nip': '199102022011022002',
      'role': 'RESEARCHER',
      'isActivated': true,
    };

    test('fromJson creates User correctly', () {
      final user = User.fromJson(testJson);

      expect(user.id, testJson['id']);
      expect(user.name, testJson['name']);
      expect(user.email, testJson['email']);
      expect(user.nip, testJson['nip']);
      expect(user.role, testJson['role']);
      expect(user.isActivated, true);
    });

    test('fromJson defaults isActivated to false when null', () {
      final json = Map<String, dynamic>.from(testJson)..remove('isActivated');
      final user = User.fromJson(json);

      expect(user.isActivated, false);
    });

    test('toJson produces correct map', () {
      final user = User.fromJson(testJson);
      final json = user.toJson();

      expect(json['id'], testJson['id']);
      expect(json['name'], testJson['name']);
      expect(json['email'], testJson['email']);
      expect(json['nip'], testJson['nip']);
      expect(json['role'], testJson['role']);
      expect(json['isActivated'], true);
    });

    test('fromJson handles empty strings', () {
      final json = {
        'id': '',
        'name': '',
        'email': '',
        'nip': '',
        'role': '',
      };
      final user = User.fromJson(json);

      expect(user.id, '');
      expect(user.name, '');
      expect(user.isActivated, false);
    });
  });
}
