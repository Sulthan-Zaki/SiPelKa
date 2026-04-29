import 'package:flutter/material.dart';
import 'login_screen.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile', style: TextStyle(fontWeight: FontWeight.bold)),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            const SizedBox(height: 20),
            // Avatar and Name
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
                          border: Border.all(color: theme.colorScheme.primary, width: 2),
                        ),
                        child: const Icon(Icons.person, size: 60, color: Color(0xFF7F080C)),
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
                          child: const Icon(Icons.edit, color: Colors.white, size: 16),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Dr. Sulthan Zaki',
                    style: theme.textTheme.headlineSmall,
                  ),
                  Text(
                    'Researcher | NIP: 199208222024011001',
                    style: theme.textTheme.labelMedium,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 40),
            // Menu Items
            _buildProfileMenu(
              context,
              'Account Settings',
              Icons.settings_outlined,
              () {},
            ),
            _buildProfileMenu(
              context,
              'Research Stats',
              Icons.bar_chart_outlined,
              () {},
            ),
            _buildProfileMenu(
              context,
              'My Certificates',
              Icons.workspace_premium_outlined,
              () {},
            ),
            _buildProfileMenu(
              context,
              'Notifications',
              Icons.notifications_outlined,
              () {},
            ),
            const Divider(height: 40, indent: 24, endIndent: 24),
            _buildProfileMenu(
              context,
              'Help & Support',
              Icons.help_outline,
              () {},
            ),
            _buildProfileMenu(
              context,
              'Logout',
              Icons.logout,
              () {
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

  Widget _buildProfileMenu(BuildContext context, String title, IconData icon, VoidCallback onTap, {bool isDestructive = false}) {
    final theme = Theme.of(context);
    return ListTile(
      onTap: onTap,
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: isDestructive ? Colors.red.withOpacity(0.05) : theme.colorScheme.surfaceContainerLow,
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
      contentPadding: const EdgeInsets.symmetric(horizontal: 24, vertical: 4),
    );
  }
}
