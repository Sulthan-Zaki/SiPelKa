import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:front_end_mobile_sipelka/services/api_service.dart';
import 'package:front_end_mobile_sipelka/services/local_storage_service.dart';
import 'package:front_end_mobile_sipelka/models/storage_key.dart';

class AccountSettingsScreen extends StatefulWidget {
  const AccountSettingsScreen({super.key});

  @override
  State<AccountSettingsScreen> createState() => _AccountSettingsScreenState();
}

class _AccountSettingsScreenState extends State<AccountSettingsScreen> {
  final _currentPasswordController = TextEditingController();
  final _newPasswordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  bool _isLoading = false;
  bool _isSaving = false;

  String _name = '';
  String _email = '';
  String _nip = '';
  String _role = '';

  @override
  void initState() {
    super.initState();
    _loadUserData();
  }

  Future<void> _loadUserData() async {
    setState(() => _isLoading = true);
    final userData = await LocalStorageService.read(StorageKey.user);
    if (userData is Map) {
      setState(() {
        _name = userData['name'] as String? ?? '';
        _email = userData['email'] as String? ?? '';
        _nip = userData['nip'] as String? ?? '';
        _role = userData['role'] as String? ?? '';
      });
    }
    setState(() => _isLoading = false);
  }

  Future<void> _changePassword() async {
    final current = _currentPasswordController.text;
    final newPw = _newPasswordController.text;
    final confirm = _confirmPasswordController.text;

    if (current.isEmpty || newPw.isEmpty || confirm.isEmpty) {
      Get.snackbar('Error', 'All fields are required');
      return;
    }
    if (newPw != confirm) {
      Get.snackbar('Error', 'New passwords do not match');
      return;
    }
    if (newPw.length < 6) {
      Get.snackbar('Error', 'Password must be at least 6 characters');
      return;
    }

    setState(() => _isSaving = true);
    try {
      await ApiService().post('/api/users/change-password', data: {
        'currentPassword': current,
        'newPassword': newPw,
      });
      Get.snackbar('Success', 'Password changed successfully');
      _currentPasswordController.clear();
      _newPasswordController.clear();
      _confirmPasswordController.clear();
    } catch (e) {
      Get.snackbar('Error', 'Failed to change password. Check your current password.');
    } finally {
      setState(() => _isSaving = false);
    }
  }

  @override
  void dispose() {
    _currentPasswordController.dispose();
    _newPasswordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Account Settings',
            style: TextStyle(fontWeight: FontWeight.bold)),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Profile Information',
                      style: theme.textTheme.headlineSmall),
                  const SizedBox(height: 20),
                  _buildInfoRow(theme, 'Name', _name),
                  _buildInfoRow(theme, 'Email', _email),
                  _buildInfoRow(theme, 'NIP', _nip),
                  _buildInfoRow(theme, 'Role', _role),
                  const SizedBox(height: 40),
                  Text('Change Password',
                      style: theme.textTheme.headlineSmall),
                  const SizedBox(height: 20),
                  TextField(
                    controller: _currentPasswordController,
                    obscureText: true,
                    decoration: const InputDecoration(
                        labelText: 'Current Password'),
                  ),
                  const SizedBox(height: 16),
                  TextField(
                    controller: _newPasswordController,
                    obscureText: true,
                    decoration: const InputDecoration(
                        labelText: 'New Password'),
                  ),
                  const SizedBox(height: 16),
                  TextField(
                    controller: _confirmPasswordController,
                    obscureText: true,
                    decoration: const InputDecoration(
                        labelText: 'Confirm New Password'),
                  ),
                  const SizedBox(height: 24),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: _isSaving ? null : _changePassword,
                      child: _isSaving
                          ? const SizedBox(
                              width: 20,
                              height: 20,
                              child: CircularProgressIndicator(
                                  strokeWidth: 2, color: Colors.white))
                          : const Text('Save Password'),
                    ),
                  ),
                ],
              ),
            ),
    );
  }

  Widget _buildInfoRow(ThemeData theme, String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 80,
            child: Text(label,
                style: theme.textTheme.labelMedium
                    ?.copyWith(fontWeight: FontWeight.bold)),
          ),
          Expanded(
            child: Text(value, style: theme.textTheme.bodyLarge),
          ),
        ],
      ),
    );
  }
}
