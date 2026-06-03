import 'package:flutter_test/flutter_test.dart';
import 'package:front_end_mobile_sipelka/models/logbook.dart';

void main() {
  group('Logbook Model', () {
    const testJson = {
      'id': '550e8400-e29b-41d4-a716-446655440006',
      'proposalId': '550e8400-e29b-41d4-a716-446655440003',
      'tanggalKegiatan': '2026-04-29',
      'deskripsiProgress': 'Collected soil samples from Zone A.',
      'kendala': 'Weather conditions were challenging.',
      'lampiranUrl': '/uploads/logbooks/sample.pdf',
      'createdAt': '2026-04-29T10:00:00',
    };

    test('fromJson creates Logbook correctly', () {
      final logbook = Logbook.fromJson(testJson);

      expect(logbook.id, testJson['id']);
      expect(logbook.proposalId, testJson['proposalId']);
      expect(logbook.deskripsiProgress, testJson['deskripsiProgress']);
      expect(logbook.kendala, testJson['kendala']);
      expect(logbook.lampiranUrl, testJson['lampiranUrl']);
    });

    test('fromJson parses tanggalKegiatan as DateTime', () {
      final logbook = Logbook.fromJson(testJson);

      expect(logbook.tanggalKegiatan.year, 2026);
      expect(logbook.tanggalKegiatan.month, 4);
      expect(logbook.tanggalKegiatan.day, 29);
    });

    test('fromJson handles null kendala and lampiranUrl', () {
      final json = {
        'id': '550e8400-e29b-41d4-a716-446655440006',
        'proposalId': '550e8400-e29b-41d4-a716-446655440003',
        'tanggalKegiatan': '2026-04-29',
        'deskripsiProgress': 'Test progress.',
      };
      final logbook = Logbook.fromJson(json);

      expect(logbook.kendala, isNull);
      expect(logbook.lampiranUrl, isNull);
    });

    test('toJson produces correct map', () {
      final logbook = Logbook.fromJson(testJson);
      final json = logbook.toJson();

      expect(json['deskripsiProgress'], testJson['deskripsiProgress']);
      expect(json['kendala'], testJson['kendala']);
    });
  });
}
