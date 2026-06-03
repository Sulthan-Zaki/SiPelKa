import 'package:flutter_test/flutter_test.dart';
import 'package:front_end_mobile_sipelka/models/notification.dart';

void main() {
  group('AppNotification Model', () {
    const testJson = {
      'id': '550e8400-e29b-41d4-a716-446655440007',
      'userId': '550e8400-e29b-41d4-a716-446655440004',
      'judulNotifikasi': 'Proposal Disetujui',
      'pesan': 'Selamat! Proposal Anda telah disetujui.',
      'isRead': false,
      'tipeNotifikasi': 'STATUS_UPDATE',
      'createdAt': '2026-04-28T10:00:00',
    };

    test('fromJson creates AppNotification correctly', () {
      final notification = AppNotification.fromJson(testJson);

      expect(notification.id, testJson['id']);
      expect(notification.judulNotifikasi, testJson['judulNotifikasi']);
      expect(notification.pesan, testJson['pesan']);
      expect(notification.isRead, false);
      expect(notification.tipeNotifikasi, 'STATUS_UPDATE');
    });

    test('fromJson handles null isRead', () {
      final json = Map<String, dynamic>.from(testJson)..remove('isRead');
      final notification = AppNotification.fromJson(json);

      expect(notification.isRead, isNull);
    });

    test('fromJson handles null tipeNotifikasi', () {
      final json = Map<String, dynamic>.from(testJson)..remove('tipeNotifikasi');
      final notification = AppNotification.fromJson(json);

      expect(notification.tipeNotifikasi, isNull);
    });

    test('toJson produces correct map', () {
      final notification = AppNotification.fromJson(testJson);
      final json = notification.toJson();

      expect(json['judulNotifikasi'], testJson['judulNotifikasi']);
      expect(json['isRead'], false);
    });
  });
}
