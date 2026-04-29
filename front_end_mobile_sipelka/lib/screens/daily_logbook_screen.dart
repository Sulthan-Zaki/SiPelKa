import 'package:flutter/material.dart';

class DailyLogbookScreen extends StatelessWidget {
  const DailyLogbookScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Daily Logbook'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add_circle_outline),
            onPressed: () {},
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(24.0),
        children: [
          _buildMonthHeader(theme, 'April 2026'),
          _buildLogEntry(
            theme,
            '29',
            'Wed',
            'Field Data Collection',
            'Collected soil samples from Zone A and Zone B. Temperature recorded at 28°C.',
            true,
          ),
          _buildLogEntry(
            theme,
            '28',
            'Tue',
            'Laboratory Analysis',
            'Initial analysis of chemical properties for samples collected on April 25.',
            false,
          ),
          const SizedBox(height: 24),
          _buildMonthHeader(theme, 'March 2026'),
          _buildLogEntry(
            theme,
            '31',
            'Tue',
            'Literature Review',
            'Read 5 papers related to AI applications in sustainable agriculture.',
            false,
          ),
        ],
      ),
    );
  }

  Widget _buildMonthHeader(ThemeData theme, String month) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0, top: 8.0),
      child: Text(
        month,
        style: theme.textTheme.headlineSmall?.copyWith(color: theme.colorScheme.primary),
      ),
    );
  }

  Widget _buildLogEntry(ThemeData theme, String date, String day, String title, String description, bool isLast) {
    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Column(
            children: [
              Text(date, style: theme.textTheme.displayMedium?.copyWith(fontSize: 20)),
              Text(day, style: theme.textTheme.labelMedium?.copyWith(fontSize: 12)),
              if (!isLast)
                Expanded(
                  child: Container(
                    width: 1,
                    color: theme.colorScheme.outlineVariant,
                    margin: const EdgeInsets.symmetric(vertical: 8),
                  ),
                ),
            ],
          ),
          const SizedBox(width: 24),
          Expanded(
            child: Container(
              margin: const EdgeInsets.only(bottom: 24),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: theme.colorScheme.outlineVariant.withOpacity(0.3)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: theme.textTheme.bodyLarge?.copyWith(fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  Text(description, style: theme.textTheme.bodyMedium?.copyWith(color: Colors.grey[700], height: 1.4)),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
