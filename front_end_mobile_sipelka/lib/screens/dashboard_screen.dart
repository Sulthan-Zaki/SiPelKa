import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'daily_logbook_screen.dart';
import 'proposal_submission_screen.dart';
import 'proposal_list_screen.dart';
import 'active_grants_screen.dart';
import 'upcoming_deadlines_screen.dart';
import 'notification_screen.dart';
import 'package:front_end_mobile_sipelka/controllers/dashboard_controller.dart';
import 'package:front_end_mobile_sipelka/models/dashboard_stats.dart';
import 'package:front_end_mobile_sipelka/models/logbook.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(DashboardController(), permanent: true);
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: const Text('Dashboard',
            style: TextStyle(fontWeight: FontWeight.bold)),
        actions: [
          Obx(() => Stack(
                children: [
                  IconButton(
                    icon: const Icon(Icons.notifications_outlined),
                    onPressed: () => Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (_) => const NotificationScreen()),
                    ),
                  ),
                  if (controller.unreadNotifications.value > 0)
                    Positioned(
                      right: 6,
                      top: 6,
                      child: Container(
                        padding: const EdgeInsets.all(4),
                        decoration: const BoxDecoration(
                          color: Colors.red,
                          shape: BoxShape.circle,
                        ),
                        child: Text(
                          '${controller.unreadNotifications.value}',
                          style: const TextStyle(
                              color: Colors.white, fontSize: 10),
                        ),
                      ),
                    ),
                ],
              )),
        ],
      ),
      body: Obx(() {
        if (controller.isLoading.value) {
          return const Center(child: CircularProgressIndicator());
        }

        return RefreshIndicator(
          onRefresh: () async {
            await controller.loadDashboard();
            await controller.loadNotifications();
          },
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.all(24.0),
            child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Welcome back,',
                style: theme.textTheme.labelMedium,
              ),
              Text(
                controller.userName.value,
                style: theme.textTheme.displayMedium?.copyWith(fontSize: 24),
              ),
              const SizedBox(height: 32),
              Row(
                children: [
                  Expanded(
                    child: InkWell(
                      onTap: () => Get.to(() => const ActiveGrantsScreen()),
                      child: _buildStatCard(
                        context,
                        'Active Grants',
                        controller.activeGrants.value.toString(),
                        Icons.assignment_turned_in_outlined,
                        theme.colorScheme.primary,
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: InkWell(
                      onTap: () => Get.to(() => const ProposalListScreen()),
                      child: _buildStatCard(
                        context,
                        'Proposals',
                        controller.totalProposals.value.toString(),
                        Icons.description_outlined,
                        theme.colorScheme.tertiary,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 32),
              _buildSectionHeader(theme, 'Recent Logbooks', () => Get.to(() => const DailyLogbookScreen())),
              const SizedBox(height: 16),
              if (controller.recentLogbooks.isEmpty)
                _buildEmptyState(theme, 'No recent logbooks')
              else
                ...controller.recentLogbooks.take(3).map(
                    (logbook) => _buildLogbookItem(theme, logbook)),
              const SizedBox(height: 32),
              _buildSectionHeader(theme, 'Upcoming Deadlines', () => Get.to(() => const UpcomingDeadlinesScreen())),
              const SizedBox(height: 16),
              if (controller.upcomingDeadlines.isEmpty)
                _buildEmptyState(theme, 'No upcoming deadlines')
              else
                ...controller.upcomingDeadlines.take(3).map(
                    (deadline) => _buildDeadlineItem(theme, deadline)),
            ],
          ),
        )
      );
    }),
    );
  }

  Widget _buildEmptyState(ThemeData theme, String message) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: theme.colorScheme.surfaceContainerLow,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(
        message,
        textAlign: TextAlign.center,
        style: theme.textTheme.labelMedium?.copyWith(
          color: theme.colorScheme.onSurfaceVariant.withOpacity(0.6),
        ),
      ),
    );
  }

  Widget _buildStatCard(BuildContext context, String title, String value,
      IconData icon, Color color) {
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
          Text(value,
              style:
                  theme.textTheme.displayMedium?.copyWith(fontSize: 28)),
          Text(title, style: theme.textTheme.labelMedium),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(
      ThemeData theme, String title, VoidCallback onTap) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(title, style: theme.textTheme.headlineSmall),
        TextButton(
          onPressed: onTap,
          child: Text('See All',
              style: TextStyle(color: theme.colorScheme.primary)),
        ),
      ],
    );
  }

  Widget _buildLogbookItem(ThemeData theme, Logbook logbook) {
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
            child: Icon(Icons.history_edu,
                color: theme.colorScheme.primary, size: 20),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  logbook.deskripsiProgress,
                  style: theme.textTheme.bodyLarge?.copyWith(
                      fontWeight: FontWeight.bold, fontSize: 14),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                Text(
                  logbook.formattedMonthDay,
                  style: theme.textTheme.labelMedium?.copyWith(fontSize: 12),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDeadlineItem(ThemeData theme, Deadline deadline) {
    final dateStr =
        '${deadline.deadline.day} ${_months[deadline.deadline.month - 1]} ${deadline.deadline.year}';
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        border: Border.all(
            color: theme.colorScheme.outlineVariant.withOpacity(0.3)),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          Container(
            width: 4,
            height: 40,
            decoration: BoxDecoration(
              color: deadline.isUrgent
                  ? theme.colorScheme.error
                  : theme.colorScheme.tertiary,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(deadline.task,
                    style: theme.textTheme.bodyLarge?.copyWith(
                        fontWeight: FontWeight.bold, fontSize: 14)),
                Text(deadline.grantName,
                    style:
                        theme.textTheme.labelMedium?.copyWith(fontSize: 12)),
              ],
            ),
          ),
          Text(
            dateStr,
            style: theme.textTheme.labelMedium?.copyWith(
              fontSize: 12,
              color: deadline.isUrgent
                  ? theme.colorScheme.error
                  : null,
              fontWeight: deadline.isUrgent ? FontWeight.bold : null,
            ),
          ),
        ],
      ),
    );
  }

  static const List<String> _months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
}
