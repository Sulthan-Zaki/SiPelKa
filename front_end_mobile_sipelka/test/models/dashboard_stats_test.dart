import 'package:flutter_test/flutter_test.dart';
import 'package:front_end_mobile_sipelka/models/dashboard_stats.dart';
import 'package:front_end_mobile_sipelka/models/logbook.dart';

void main() {
  group('DashboardStats Model', () {
    final testJson = {
      'activeGrants': 3,
      'totalProposals': 8,
      'draftProposals': 1,
      'submittedProposals': 2,
      'approvedProposals': 2,
      'rejectedProposals': 1,
      'recentLogbooks': [
        {
          'id': '550e8400-e29b-41d4-a716-446655440006',
          'proposalId': '550e8400-e29b-41d4-a716-446655440003',
          'tanggalKegiatan': '2026-04-29',
          'deskripsiProgress': 'Test progress.',
        },
      ],
      'upcomingDeadlines': [
        {
          'task': 'Mid-term Report',
          'grantName': 'Hibah Internal 2026',
          'deadline': '2026-05-15',
          'isUrgent': true,
        },
      ],
    };

    test('fromJson creates DashboardStats correctly', () {
      final stats = DashboardStats.fromJson(testJson);

      expect(stats.activeGrants, 3);
      expect(stats.totalProposals, 8);
      expect(stats.draftProposals, 1);
      expect(stats.submittedProposals, 2);
      expect(stats.approvedProposals, 2);
      expect(stats.rejectedProposals, 1);
      expect(stats.recentLogbooks.length, 1);
      expect(stats.recentLogbooks[0], isA<Logbook>());
      expect(stats.upcomingDeadlines.length, 1);
    });

    test('fromJson parses Deadline correctly', () {
      final stats = DashboardStats.fromJson(testJson);
      final deadline = stats.upcomingDeadlines[0];

      expect(deadline.task, 'Mid-term Report');
      expect(deadline.grantName, 'Hibah Internal 2026');
      expect(deadline.deadline, '2026-05-15');
      expect(deadline.isUrgent, true);
    });

    test('fromJson handles empty lists', () {
      final json = Map<String, dynamic>.from(testJson);
      json['recentLogbooks'] = [];
      json['upcomingDeadlines'] = [];
      final stats = DashboardStats.fromJson(json);

      expect(stats.recentLogbooks, isEmpty);
      expect(stats.upcomingDeadlines, isEmpty);
    });

    test('fromJson defaults numeric fields to 0 when missing', () {
      final json = {
        'recentLogbooks': [],
        'upcomingDeadlines': [],
      };
      final stats = DashboardStats.fromJson(json);

      expect(stats.activeGrants, 0);
      expect(stats.totalProposals, 0);
    });
  });

  group('Deadline Model', () {
    test('fromJson creates Deadline correctly', () {
      const json = {
        'task': 'Final Submission',
        'grantName': 'Hibah Nasional 2026',
        'deadline': '2026-06-01',
        'isUrgent': false,
      };

      final deadline = Deadline.fromJson(json);

      expect(deadline.task, 'Final Submission');
      expect(deadline.grantName, 'Hibah Nasional 2026');
      expect(deadline.deadline, '2026-06-01');
      expect(deadline.isUrgent, false);
    });
  });
}
