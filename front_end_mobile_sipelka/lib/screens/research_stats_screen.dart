import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:front_end_mobile_sipelka/services/proposal_service.dart';
import 'package:front_end_mobile_sipelka/services/local_storage_service.dart';
import 'package:front_end_mobile_sipelka/models/storage_key.dart';
import 'package:front_end_mobile_sipelka/models/dashboard_stats.dart';

class ResearchStatsScreen extends StatefulWidget {
  const ResearchStatsScreen({super.key});

  @override
  State<ResearchStatsScreen> createState() => _ResearchStatsScreenState();
}

class _ResearchStatsScreenState extends State<ResearchStatsScreen> {
  DashboardStats? _stats;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _loadStats();
  }

  Future<void> _loadStats() async {
    setState(() => _isLoading = true);
    try {
      final userData = await LocalStorageService.read(StorageKey.user);
      final penelitiId = userData is Map ? userData['id'] as String? : null;
      if (penelitiId != null) {
        final stats = await ProposalService().getResearcherStats(penelitiId);
        setState(() => _stats = stats);
      }
    } catch (e) {
      Get.snackbar('Error', 'Failed to load research statistics');
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Research Stats',
            style: TextStyle(fontWeight: FontWeight.bold)),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadStats,
              child: ListView(
                padding: const EdgeInsets.all(24),
                children: [
                  Text('Overview',
                      style: theme.textTheme.headlineSmall),
                  const SizedBox(height: 20),
                  Row(
                    children: [
                      Expanded(
                        child: _buildStatCard(
                          theme,
                          'Active Grants',
                          '${_stats?.activeGrants ?? 0}',
                          Icons.assignment_turned_in_outlined,
                          theme.colorScheme.primary,
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: _buildStatCard(
                          theme,
                          'Total Proposals',
                          '${_stats?.totalProposals ?? 0}',
                          Icons.description_outlined,
                          theme.colorScheme.tertiary,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 32),
                  Text('By Status',
                      style: theme.textTheme.headlineSmall),
                  const SizedBox(height: 20),
                  _buildStatusRow(theme, 'Draft', _stats?.draftProposals ?? 0,
                      theme.colorScheme.surfaceVariant),
                  _buildStatusRow(theme, 'Submitted',
                      _stats?.submittedProposals ?? 0, Colors.orange),
                  _buildStatusRow(
                      theme, 'Approved', _stats?.approvedProposals ?? 0,
                      Colors.green),
                  _buildStatusRow(theme, 'Rejected',
                      _stats?.rejectedProposals ?? 0, Colors.red),
                ],
              ),
            ),
    );
  }

  Widget _buildStatCard(
      ThemeData theme, String title, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 24,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: color, size: 28),
          const SizedBox(height: 16),
          Text(value,
              style: theme.textTheme.displayMedium
                  ?.copyWith(fontSize: 28)),
          Text(title, style: theme.textTheme.labelMedium),
        ],
      ),
    );
  }

  Widget _buildStatusRow(
      ThemeData theme, String label, int count, Color color) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        children: [
          Container(
            width: 12,
            height: 12,
            decoration: BoxDecoration(color: color, shape: BoxShape.circle),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(label, style: theme.textTheme.bodyLarge),
          ),
          Text('$count',
              style: theme.textTheme.bodyLarge
                  ?.copyWith(fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}
