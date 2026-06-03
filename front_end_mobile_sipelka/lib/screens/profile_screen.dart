import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:front_end_mobile_sipelka/services/api_service.dart';
import 'package:front_end_mobile_sipelka/services/local_storage_service.dart';
import 'package:front_end_mobile_sipelka/controllers/profile_controller.dart';
import 'package:front_end_mobile_sipelka/routes/app_route.dart';
import 'login_screen.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(ProfileController(), permanent: true);
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title:
            const Text('Profile', style: TextStyle(fontWeight: FontWeight.bold)),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            const SizedBox(height: 20),
            Center(
              child: Column(
                children: [
                  Stack(
                    children: [
                      Container(
                        width: 100,
                        height: 100,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: theme.colorScheme.primary.withOpacity(0.1),
                          border: Border.all(
                              color: theme.colorScheme.primary, width: 2),
                        ),
                        child: const Icon(Icons.person,
                            size: 60, color: Color(0xFF7F080C)),
                      ),
                      Positioned(
                        bottom: 0,
                        right: 0,
                        child: Container(
                          padding: const EdgeInsets.all(4),
                          decoration: BoxDecoration(
                            color: theme.colorScheme.primary,
                            shape: BoxShape.circle,
                          ),
                          child:
                              const Icon(Icons.edit, color: Colors.white, size: 16),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Obx(() => Text(
                        controller.name.value,
                        style: theme.textTheme.headlineSmall,
                      )),
                  Obx(() => Text(
                        '${controller.role.value} | NIP: ${controller.nip.value}',
                        style: theme.textTheme.labelMedium,
                      )),
                ],
              ),
            ),
            const SizedBox(height: 40),
            _buildProfileMenu(
              context,
              'Account Settings',
              Icons.settings_outlined,
              () => Get.toNamed(AppRoutes.accountSettings),
            ),
            _buildProfileMenu(
              context,
              'Research Stats',
              Icons.bar_chart_outlined,
              () => Get.toNamed(AppRoutes.researchStats),
            ),
            _buildProfileMenu(
              context,
              'Notifications',
              Icons.notifications_outlined,
              () => Get.toNamed(AppRoutes.notifications),
            ),
            const Divider(height: 40, indent: 24, endIndent: 24),
            _buildProfileMenu(
              context,
              'Help & Support',
              Icons.help_outline,
              () => showDialog(
                context: context,
                builder: (ctx) => AlertDialog(
                  title: const Text('Help & Support'),
                  content: const Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('For assistance, contact:'),
                      SizedBox(height: 12),
                      Text('Email: support@sipelka.ac.id'),
                      SizedBox(height: 4),
                      Text('Phone: (0274) 123-4567'),
                    ],
                  ),
                  actions: [
                    TextButton(
                      onPressed: () => Navigator.pop(ctx),
                      child: const Text('Close'),
                    ),
                  ],
                ),
              ),
            ),
            _buildProfileMenu(
              context,
              'Logout',
              Icons.logout,
              () async {
                await LocalStorageService.clear();
                ApiService().clearToken();
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(builder: (context) => const LoginScreen()),
                );
              },
              isDestructive: true,
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  Widget _buildProfileMenu(BuildContext context, String title, IconData icon,
      VoidCallback onTap,
      {bool isDestructive = false}) {
    final theme = Theme.of(context);
    return ListTile(
      onTap: onTap,
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: isDestructive
              ? Colors.red.withOpacity(0.05)
              : theme.colorScheme.surfaceContainerLow,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Icon(
          icon,
          color: isDestructive ? Colors.red : theme.colorScheme.primary,
          size: 20,
        ),
      ),
      title: Text(
        title,
        style: TextStyle(
          fontWeight: FontWeight.w500,
          color: isDestructive ? Colors.red : theme.colorScheme.onSurface,
        ),
      ),
      trailing: const Icon(Icons.chevron_right, size: 20),
      contentPadding:
          const EdgeInsets.symmetric(horizontal: 24, vertical: 4),
    );
  }
}
