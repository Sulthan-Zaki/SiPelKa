import 'package:flutter/material.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _nipController = TextEditingController();
  final _passwordController = TextEditingController();
  String _selectedRole = 'Researcher';

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
              Text(
                'Create Account',
                style: theme.textTheme.displayMedium,
              ),
              Text(
                'Join the research community',
                style: theme.textTheme.labelMedium,
              ),
              const SizedBox(height: 32),
              // Name Field
              _buildFieldLabel(theme, 'Full Name'),
              TextField(
                controller: _nameController,
                decoration: const InputDecoration(hintText: 'Enter your full name'),
              ),
              const SizedBox(height: 20),
              // Email Field
              _buildFieldLabel(theme, 'Email Address'),
              TextField(
                controller: _emailController,
                decoration: const InputDecoration(hintText: 'Enter your email'),
              ),
              const SizedBox(height: 20),
              // NIP Field
              _buildFieldLabel(theme, 'NIP / ID Number'),
              TextField(
                controller: _nipController,
                decoration: const InputDecoration(hintText: 'Enter your NIP'),
              ),
              const SizedBox(height: 20),
              // Role Dropdown
              _buildFieldLabel(theme, 'Role'),
              DropdownButtonFormField<String>(
                value: _selectedRole,
                decoration: const InputDecoration(),
                items: ['Researcher', 'Reviewer', 'Admin'].map((role) {
                  return DropdownMenuItem(value: role, child: Text(role));
                }).toList(),
                onChanged: (value) {
                  setState(() {
                    _selectedRole = value!;
                  });
                },
              ),
              const SizedBox(height: 20),
              // Password Field
              _buildFieldLabel(theme, 'Password'),
              TextField(
                controller: _passwordController,
                obscureText: true,
                decoration: const InputDecoration(hintText: 'Create a password'),
              ),
              const SizedBox(height: 40),
              // Register Button
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    // Navigate back to login or dashboard
                    Navigator.pop(context);
                  },
                  child: const Text('Register'),
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
        style: theme.textTheme.labelMedium?.copyWith(fontWeight: FontWeight.w600),
      ),
    );
  }
}
