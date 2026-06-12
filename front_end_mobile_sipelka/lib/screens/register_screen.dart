import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:front_end_mobile_sipelka/screens/login_screen.dart';
import 'package:front_end_mobile_sipelka/controllers/register_controller.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final registerController = Get.find<RegisterController>();

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: theme.colorScheme.onSurface),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Create Account', style: theme.textTheme.displayMedium),
              Text(
                'Join the research community',
                style: theme.textTheme.labelMedium,
              ),
              const SizedBox(height: 32),
              // Name Field
              _buildFieldLabel(theme, 'Full Name'),
              TextField(
                onChanged: (value) => registerController.name.value = value,
                decoration: const InputDecoration(
                  hintText: 'Enter your full name',
                ),
              ),
              const SizedBox(height: 20),
              // Email Field
              _buildFieldLabel(theme, 'Email Address'),
              TextField(
                onChanged: (value) => registerController.email.value = value,
                decoration: const InputDecoration(hintText: 'Enter your email'),
              ),
              const SizedBox(height: 20),
              // NIP Field
              _buildFieldLabel(theme, 'NIP / ID Number'),
              TextField(
                onChanged: (value) => registerController.nip.value = value,
                decoration: const InputDecoration(hintText: 'Enter your NIP'),
              ),
              const SizedBox(height: 20),
              // Role Dropdown
              _buildFieldLabel(theme, 'Role'),
              DropdownButtonFormField<String>(
                value: registerController.role.value.isEmpty
                    ? 'Researcher'
                    : registerController.role.value,
                decoration: const InputDecoration(),
                items: ['Researcher', 'Reviewer'].map((role) {
                  return DropdownMenuItem(value: role, child: Text(role));
                }).toList(),
                onChanged: (value) {
                  if (value != null) {
                    registerController.role.value = value;
                  }
                },
              ),
              const SizedBox(height: 20),
              // Password Field
              _buildFieldLabel(theme, 'Password'),
              TextField(
                onChanged: (value) => registerController.password.value = value,
                obscureText: true,
                decoration: const InputDecoration(
                  hintText: 'Create a password',
                ),
              ),
              const SizedBox(height: 40),
              // Register Button
              Obx(
                () => SizedBox(
                  width: double.infinity,
                  child: registerController.isLoading.value
                      ? const CircularProgressIndicator()
                      : ElevatedButton(
                          onPressed: () {
                            registerController.register();
                          },
                          child: const Text('Register'),
                        ),
                ),
              ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFieldLabel(ThemeData theme, String label) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0),
      child: Text(
        label,
        style: theme.textTheme.labelMedium?.copyWith(
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}
