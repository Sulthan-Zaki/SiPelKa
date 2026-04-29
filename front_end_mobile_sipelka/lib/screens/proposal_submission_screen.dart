import 'package:flutter/material.dart';

class ProposalSubmissionScreen extends StatefulWidget {
  const ProposalSubmissionScreen({super.key});

  @override
  State<ProposalSubmissionScreen> createState() => _ProposalSubmissionScreenState();
}

class _ProposalSubmissionScreenState extends State<ProposalSubmissionScreen> {
  final _titleController = TextEditingController();
  final _abstractController = TextEditingController();
  String _selectedScheme = 'Internal Research';

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Submit Proposal'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'New Research Proposal',
              style: theme.textTheme.displayMedium?.copyWith(fontSize: 24),
            ),
            const SizedBox(height: 32),
            _buildLabel(theme, 'Research Title'),
            TextField(
              controller: _titleController,
              maxLines: 2,
              decoration: const InputDecoration(hintText: 'Enter the full title of your research'),
            ),
            const SizedBox(height: 24),
            _buildLabel(theme, 'Funding Scheme'),
            DropdownButtonFormField<String>(
              value: _selectedScheme,
              items: ['Internal Research', 'National Grant', 'International Collaboration'].map((s) {
                return DropdownMenuItem(value: s, child: Text(s));
              }).toList(),
              onChanged: (v) => setState(() => _selectedScheme = v!),
            ),
            const SizedBox(height: 24),
            _buildLabel(theme, 'Abstract'),
            TextField(
              controller: _abstractController,
              maxLines: 6,
              decoration: const InputDecoration(hintText: 'Summarize your research proposal...'),
            ),
            const SizedBox(height: 24),
            _buildLabel(theme, 'Supporting Documents'),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(32),
              decoration: BoxDecoration(
                color: theme.colorScheme.surfaceContainerLow,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: theme.colorScheme.outlineVariant, style: BorderStyle.none),
              ),
              child: Column(
                children: [
                  Icon(Icons.upload_file, color: theme.colorScheme.primary, size: 40),
                  const SizedBox(height: 12),
                  const Text('Upload PDF (Max 10MB)', style: TextStyle(fontWeight: FontWeight.bold)),
                  const Text('Drag & drop or tap to select', style: TextStyle(fontSize: 12, color: Colors.grey)),
                ],
              ),
            ),
            const SizedBox(height: 48),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Proposal submitted successfully!')),
                  );
                  Navigator.pop(context);
                },
                child: const Text('Submit Proposal'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLabel(ThemeData theme, String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0),
      child: Text(
        text,
        style: theme.textTheme.labelMedium?.copyWith(fontWeight: FontWeight.bold),
      ),
    );
  }
}
