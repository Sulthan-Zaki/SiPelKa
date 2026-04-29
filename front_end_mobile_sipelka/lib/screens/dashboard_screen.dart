import 'package:flutter/material.dart';
import 'daily_logbook_screen.dart';
import 'proposal_submission_screen.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard', style: TextStyle(fontWeight: FontWeight.bold)),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_outlined),
            onPressed: () {},
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Welcome back,',
              style: theme.textTheme.labelMedium,
            ),
            Text(
              'Dr. Sulthan Zaki',
              style: theme.textTheme.displayMedium?.copyWith(fontSize: 24),
            ),
            const SizedBox(height: 32),
            // Stats Cards
            Row(
              children: [
                Expanded(
                  child: InkWell(
                    onTap: () => Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => const DailyLogbookScreen()),
                    ),
                    child: _buildStatCard(
                      context,
                      'Active Grants',
                      '3',
                      Icons.assignment_turned_in_outlined,
                      theme.colorScheme.primary,
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: InkWell(
                    onTap: () => Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => const ProposalSubmissionScreen()),
                    ),
                    child: _buildStatCard(
                      context,
                      'Proposals',
                      '12',
                      Icons.description_outlined,
                      theme.colorScheme.tertiary,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 32),
            // Recent Logbooks Section
            _buildSectionHeader(theme, 'Recent Logbooks', () {}),
            const SizedBox(height: 16),
            _buildLogbookItem(
              theme,
              'Smart Farming AI',
              'Field Data Collection - Phase 1',
              '2 hours ago',
            ),
            _buildLogbookItem(
              theme,
              'Renewable Energy',
              'Solar Panel Efficiency Test',
              'Yesterday',
            ),
            const SizedBox(height: 32),
            // Deadlines Section
            _buildSectionHeader(theme, 'Upcoming Deadlines', () {}),
            const SizedBox(height: 16),
            _buildDeadlineItem(
              theme,
              'Mid-term Report',
              'Hibah Internal 2026',
              'May 15, 2026',
              true,
            ),
            _buildDeadlineItem(
              theme,
              'Final Submission',
              'International Research Grant',
              'June 01, 2026',
              false,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatCard(BuildContext context, String title, String value, IconData icon, Color color) {
    final theme = Theme.of(context);
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
          Text(value, style: theme.textTheme.displayMedium?.copyWith(fontSize: 28)),
          Text(title, style: theme.textTheme.labelMedium),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(ThemeData theme, String title, VoidCallback onTap) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(title, style: theme.textTheme.headlineSmall),
        TextButton(
          onPressed: onTap,
          child: Text('See All', style: TextStyle(color: theme.colorScheme.primary)),
        ),
      ],
    );
  }

  Widget _buildLogbookItem(ThemeData theme, String project, String activity, String time) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: theme.colorScheme.surfaceContainerLow,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(Icons.history_edu, color: theme.colorScheme.primary, size: 20),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(project, style: theme.textTheme.bodyLarge?.copyWith(fontWeight: FontWeight.bold, fontSize: 14)),
                Text(activity, style: theme.textTheme.labelMedium?.copyWith(fontSize: 12)),
              ],
            ),
          ),
          Text(time, style: theme.textTheme.labelMedium?.copyWith(fontSize: 10)),
        ],
      ),
    );
  }

  Widget _buildDeadlineItem(ThemeData theme, String task, String grant, String date, bool isUrgent) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        border: Border.all(color: theme.colorScheme.outlineVariant.withOpacity(0.3)),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          Container(
            width: 4,
            height: 40,
            decoration: BoxDecoration(
              color: isUrgent ? theme.colorScheme.error : theme.colorScheme.tertiary,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(task, style: theme.textTheme.bodyLarge?.copyWith(fontWeight: FontWeight.bold, fontSize: 14)),
                Text(grant, style: theme.textTheme.labelMedium?.copyWith(fontSize: 12)),
              ],
            ),
          ),
          Text(date, style: theme.textTheme.labelMedium?.copyWith(
            fontSize: 12,
            color: isUrgent ? theme.colorScheme.error : null,
            fontWeight: isUrgent ? FontWeight.bold : null,
          )),
        ],
      ),
    );
  }
}
