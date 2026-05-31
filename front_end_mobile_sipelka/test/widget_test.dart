import 'package:flutter_test/flutter_test.dart';
import 'package:front_end_mobile_sipelka/models/user.dart';
import 'package:front_end_mobile_sipelka/models/grant.dart';
import 'package:front_end_mobile_sipelka/models/proposal.dart';
import 'package:front_end_mobile_sipelka/models/logbook.dart';
import 'package:front_end_mobile_sipelka/models/notification.dart';
import 'package:front_end_mobile_sipelka/models/dashboard_stats.dart';
import 'package:front_end_mobile_sipelka/models/storage_key.dart';

void main() {
  group('App Initialization', () {
    test('StorageKey constants are defined', () {
      expect(StorageKey.token, 'token');
      expect(StorageKey.refreshToken, 'refresh_token');
      expect(StorageKey.user, 'user');
      expect(StorageKey.isLoggedIn, 'is_logged_in');
    });
  });

  group('Model Instantiation', () {
    test('User model can be instantiated', () {
      final user = User(
        id: 'test-id',
        name: 'Test User',
        email: 'test@test.com',
        nip: '123456',
        role: 'RESEARCHER',
        isActivated: true,
      );

      expect(user.name, 'Test User');
      expect(user.role, 'RESEARCHER');
    });

    test('Grant model can be instantiated', () {
      final now = DateTime.now();
      final grant = Grant(
        id: 'test-id',
        namaProgram: 'Test Grant',
        tanggalBuka: now.subtract(const Duration(days: 10)),
        tanggalTutup: now.add(const Duration(days: 30)),
      );

      expect(grant.namaProgram, 'Test Grant');
      expect(grant.isOpen, true);
    });

    test('Proposal model can be instantiated', () {
      final proposal = Proposal(
        id: 'test-id',
        penelitiId: 'peneliti-id',
        hibahId: 'hibah-id',
        judulPenelitian: 'Test Research',
        bidangPenelitian: 'Technology',
        statusProposal: 'DRAFT',
      );

      expect(proposal.judulPenelitian, 'Test Research');
      expect(proposal.statusProposal, 'DRAFT');
    });

    test('Logbook model can be instantiated', () {
      final logbook = Logbook(
        id: 'test-id',
        proposalId: 'proposal-id',
        tanggalKegiatan: DateTime(2026, 4, 29),
        deskripsiProgress: 'Test progress',
      );

      expect(logbook.deskripsiProgress, 'Test progress');
    });

    test('AppNotification model can be instantiated', () {
      final notification = AppNotification(
        id: 'test-id',
        userId: 'user-id',
        judulNotifikasi: 'Test Notification',
        pesan: 'Test message',
      );

      expect(notification.judulNotifikasi, 'Test Notification');
      expect(notification.pesan, 'Test message');
    });

    test('DashboardStats model can be instantiated', () {
      final stats = DashboardStats(
        activeGrants: 3,
        totalProposals: 8,
        draftProposals: 1,
        submittedProposals: 2,
        approvedProposals: 2,
        rejectedProposals: 1,
        recentLogbooks: [],
        upcomingDeadlines: [],
      );

      expect(stats.activeGrants, 3);
      expect(stats.totalProposals, 8);
    });

    test('Deadline model can be instantiated', () {
      final deadline = Deadline(
        task: 'Final Report',
        grantName: 'Test Grant',
        deadline: '2026-06-01',
        isUrgent: true,
      );

      expect(deadline.task, 'Final Report');
      expect(deadline.isUrgent, true);
    });
  });
}
