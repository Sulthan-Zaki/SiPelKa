import 'logbook.dart';

class DashboardStats {
  final int activeGrants;
  final int totalProposals;
  final int draftProposals;
  final int submittedProposals;
  final int approvedProposals;
  final int rejectedProposals;
  final List<Logbook> recentLogbooks;
  final List<Deadline> upcomingDeadlines;

  DashboardStats({
    required this.activeGrants,
    required this.totalProposals,
    required this.draftProposals,
    required this.submittedProposals,
    required this.approvedProposals,
    required this.rejectedProposals,
    required this.recentLogbooks,
    required this.upcomingDeadlines,
  });

  factory DashboardStats.fromJson(Map<String, dynamic> json) {
    return DashboardStats(
      activeGrants: json['activeGrants'] as int? ?? 0,
      totalProposals: json['totalProposals'] as int? ?? 0,
      draftProposals: json['draftProposals'] as int? ?? 0,
      submittedProposals: json['submittedProposals'] as int? ?? 0,
      approvedProposals: json['approvedProposals'] as int? ?? 0,
      rejectedProposals: json['rejectedProposals'] as int? ?? 0,
      recentLogbooks: (json['recentLogbooks'] as List<dynamic>?)
              ?.map((e) => Logbook.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
      upcomingDeadlines: (json['upcomingDeadlines'] as List<dynamic>?)
              ?.map((e) => Deadline.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
    );
  }
}

class Deadline {
  final String task;
  final String grantName;
  final DateTime deadline;
  final bool isUrgent;

  Deadline({
    required this.task,
    required this.grantName,
    required this.deadline,
    required this.isUrgent,
  });

  factory Deadline.fromJson(Map<String, dynamic> json) {
    return Deadline(
      task: json['task'] as String,
      grantName: json['grantName'] as String,
      deadline: DateTime.parse(json['deadline'] as String),
      isUrgent: json['isUrgent'] as bool? ?? false,
    );
  }
}
