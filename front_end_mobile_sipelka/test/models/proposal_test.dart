import 'package:flutter_test/flutter_test.dart';
import 'package:front_end_mobile_sipelka/models/proposal.dart';

void main() {
  group('Proposal Model', () {
    const testJson = {
      'id': '550e8400-e29b-41d4-a716-446655440003',
      'penelitiId': '550e8400-e29b-41d4-a716-446655440004',
      'penelitiName': 'Dr. Budi Santoso',
      'hibahId': '550e8400-e29b-41d4-a716-446655440005',
      'hibahName': 'Hibah Riset Dasar 2026',
      'judulPenelitian': 'Implementasi Machine Learning untuk Deteksi Dini Penyakit Tropis',
      'bidangPenelitian': 'Sains dan Teknologi',
      'ringkasan': 'Penelitian ini bertujuan mengembangkan model machine learning.',
      'dokumenUrl': '/uploads/proposals/ml-tropis.pdf',
      'statusProposal': 'APPROVED',
      'kriteriaKelengkapanDokumen': true,
      'kesesuaianBidang': true,
      'skorRuleBased': 85,
    };

    test('fromJson creates Proposal correctly', () {
      final proposal = Proposal.fromJson(testJson);

      expect(proposal.id, testJson['id']);
      expect(proposal.judulPenelitian, testJson['judulPenelitian']);
      expect(proposal.statusProposal, 'APPROVED');
      expect(proposal.skorRuleBased, 85);
    });

    test('fromJson handles null optional fields', () {
      final json = {
        'id': '550e8400-e29b-41d4-a716-446655440003',
        'penelitiId': '550e8400-e29b-41d4-a716-446655440004',
        'hibahId': '550e8400-e29b-41d4-a716-446655440005',
        'judulPenelitian': 'Test',
        'bidangPenelitian': 'Test',
        'statusProposal': 'DRAFT',
      };
      final proposal = Proposal.fromJson(json);

      expect(proposal.penelitiName, isNull);
      expect(proposal.ringkasan, isNull);
      expect(proposal.dokumenUrl, isNull);
      expect(proposal.skorRuleBased, isNull);
    });

    test('fromJson handles all proposal statuses', () {
      const statuses = [
        'DRAFT', 'SUBMITTED', 'RULE_FAILED',
        'UNDER_REVIEW', 'APPROVED', 'REJECTED',
      ];

      for (final status in statuses) {
        final json = Map<String, dynamic>.from(testJson);
        json['statusProposal'] = status;
        final proposal = Proposal.fromJson(json);
        expect(proposal.statusProposal, status);
      }
    });

    test('toJson produces correct map', () {
      final proposal = Proposal.fromJson(testJson);
      final json = proposal.toJson();

      expect(json['judulPenelitian'], testJson['judulPenelitian']);
      expect(json['statusProposal'], 'APPROVED');
    });
  });
}
