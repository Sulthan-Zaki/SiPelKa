import 'package:flutter_test/flutter_test.dart';
import 'package:front_end_mobile_sipelka/models/grant.dart';

void main() {
  group('Grant Model', () {
    final now = DateTime.now();
    final futureDate = now.add(const Duration(days: 30));

    final testJson = {
      'id': '550e8400-e29b-41d4-a716-446655440001',
      'adminId': '550e8400-e29b-41d4-a716-446655440002',
      'namaProgram': 'Hibah Riset Dasar 2026',
      'deskripsi': 'Program hibah untuk penelitian dasar.',
      'bidangFokus': 'Sains dan Teknologi',
      'tanggalBuka': now.subtract(const Duration(days: 10)).toIso8601String(),
      'tanggalTutup': futureDate.toIso8601String(),
      'totalDanaMaksimal': 50000000.0,
      'createdAt': now.subtract(const Duration(days: 10)).toIso8601String(),
    };

    test('fromJson creates Grant correctly', () {
      final grant = Grant.fromJson(testJson);

      expect(grant.id, testJson['id']);
      expect(grant.namaProgram, testJson['namaProgram']);
      expect(grant.deskripsi, testJson['deskripsi']);
      expect(grant.bidangFokus, testJson['bidangFokus']);
      expect(grant.totalDanaMaksimal, 50000000.0);
    });

    test('isOpen returns true when within open period', () {
      final grant = Grant.fromJson(testJson);
      expect(grant.isOpen, true);
    });

    test('isOpen returns false when before open date', () {
      final json = Map<String, dynamic>.from(testJson);
      json['tanggalBuka'] = now.add(const Duration(days: 5)).toIso8601String();
      json['tanggalTutup'] = now.add(const Duration(days: 35)).toIso8601String();
      final grant = Grant.fromJson(json);
      expect(grant.isOpen, false);
    });

    test('isOpen returns false when after close date', () {
      final json = Map<String, dynamic>.from(testJson);
      json['tanggalBuka'] = now.subtract(const Duration(days: 60)).toIso8601String();
      json['tanggalTutup'] = now.subtract(const Duration(days: 30)).toIso8601String();
      final grant = Grant.fromJson(json);
      expect(grant.isOpen, false);
    });

    test('daysRemaining returns positive when within open period', () {
      final grant = Grant.fromJson(testJson);
      expect(grant.daysRemaining, greaterThan(0));
    });

    test('daysRemaining returns null when no tanggalTutup', () {
      final json = Map<String, dynamic>.from(testJson)..remove('tanggalTutup');
      final grant = Grant.fromJson(json);
      expect(grant.daysRemaining, isNull);
    });

    test('toJson produces correct map', () {
      final grant = Grant.fromJson(testJson);
      final json = grant.toJson();

      expect(json['id'], testJson['id']);
      expect(json['namaProgram'], testJson['namaProgram']);
    });
  });
}
