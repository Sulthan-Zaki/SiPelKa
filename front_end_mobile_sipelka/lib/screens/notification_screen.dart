import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:front_end_mobile_sipelka/models/notification.dart';
import 'package:front_end_mobile_sipelka/services/notification_service.dart';
import 'package:front_end_mobile_sipelka/services/local_storage_service.dart';
import 'package:front_end_mobile_sipelka/models/storage_key.dart';
import 'package:front_end_mobile_sipelka/controllers/dashboard_controller.dart';


class NotificationScreen extends StatefulWidget {
  const NotificationScreen({super.key});

  @override
  State<NotificationScreen> createState() => _NotificationScreenState();
}

class _NotificationScreenState extends State<NotificationScreen> {
  final List<AppNotification> _notifications = [];
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _loadNotifications();
  }

  Future<void> _loadNotifications() async {
    setState(() => _isLoading = true);
    try {
      final userData = await LocalStorageService.read(StorageKey.user);
      final userId = userData is Map ? userData['id'] as String? : null;
      if (userId != null) {
        final notifications =
            await NotificationService().getNotificationsByUser(userId);
        notifications.sort((a, b) {
          final aTime = a.createdAt ?? DateTime(2000);
          final bTime = b.createdAt ?? DateTime(2000);
          return bTime.compareTo(aTime);
        });

        // Automatically mark all loaded unread notifications as read
        for (var notification in notifications) {
          if (notification.isRead != true) {
            NotificationService()
                .markAsRead(notification.id)
                .catchError((_) => notification);
          }
        }

        // Reset the unread badge count in DashboardController
        if (Get.isRegistered<DashboardController>()) {
          Get.find<DashboardController>().unreadNotifications.value = 0;
        }

        setState(() => _notifications
          ..clear()
          ..addAll(notifications));
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to load notifications')),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _markAsRead(AppNotification notification) async {
    if (notification.isRead == true) return;
    try {
      await NotificationService().markAsRead(notification.id);
      setState(() {
        final index = _notifications.indexWhere((n) => n.id == notification.id);
        if (index != -1) {
          _notifications[index] = AppNotification(
            id: notification.id,
            userId: notification.userId,
            judulNotifikasi: notification.judulNotifikasi,
            pesan: notification.pesan,
            isRead: true,
            tipeNotifikasi: notification.tipeNotifikasi,
            createdAt: notification.createdAt,
          );
        }
      });
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to mark as read')),
        );
      }
    }
  }

  String _formatDate(DateTime? date) {
    if (date == null) return '';
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
    return '${months[date.month - 1]} ${date.day}, ${date.year}';
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Notifications',
            style: TextStyle(fontWeight: FontWeight.bold)),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadNotifications,
              child: _notifications.isEmpty
                  ? ListView(
                      children: [
                        SizedBox(
                          height: MediaQuery.of(context).size.height * 0.6,
                          child: Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(Icons.notifications_none,
                                    size: 64,
                                    color: theme.colorScheme.onSurfaceVariant
                                        .withOpacity(0.4)),
                                const SizedBox(height: 16),
                                Text('No notifications yet',
                                    style: theme.textTheme.bodyLarge),
                              ],
                            ),
                          ),
                        ),
                      ],
                    )
                  : ListView.separated(
                      padding: const EdgeInsets.all(16),
                      itemCount: _notifications.length,
                      separatorBuilder: (_, __) => const Divider(height: 1),
                      itemBuilder: (context, index) {
                        final notification = _notifications[index];
                        return InkWell(
                          onTap: () => _markAsRead(notification),
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 12, vertical: 16),
                            decoration: BoxDecoration(
                              color: notification.isRead == true
                                  ? Colors.transparent
                                  : theme.colorScheme.primary.withOpacity(0.05),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Container(
                                  padding: const EdgeInsets.all(8),
                                  decoration: BoxDecoration(
                                    color: notification.isRead == true
                                        ? theme.colorScheme.surfaceContainerLow
                                        : theme.colorScheme.primary
                                            .withOpacity(0.1),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Icon(
                                    Icons.notifications_outlined,
                                    color: notification.isRead == true
                                        ? theme.colorScheme.onSurfaceVariant
                                        : theme.colorScheme.primary,
                                    size: 20,
                                  ),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        notification.judulNotifikasi,
                                        style: theme.textTheme.bodyLarge
                                            ?.copyWith(
                                          fontWeight: notification.isRead == true
                                              ? FontWeight.normal
                                              : FontWeight.bold,
                                          fontSize: 14,
                                        ),
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        notification.pesan,
                                        style: theme.textTheme.labelMedium
                                            ?.copyWith(fontSize: 12),
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        _formatDate(notification.createdAt),
                                        style: const TextStyle(
                                            fontSize: 11, color: Colors.grey),
                                      ),
                                    ],
                                  ),
                                ),
                                if (notification.isRead != true)
                                  Container(
                                    width: 8,
                                    height: 8,
                                    decoration: BoxDecoration(
                                      color: theme.colorScheme.primary,
                                      shape: BoxShape.circle,
                                    ),
                                  ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
            ),
    );
  }
}
