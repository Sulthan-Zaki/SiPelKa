import 'package:flutter/material.dart';

class DiscoveryScreen extends StatelessWidget {
  const DiscoveryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Grant Discovery', style: TextStyle(fontWeight: FontWeight.bold)),
      ),
      body: Column(
        children: [
          // Search and Filters
          Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              children: [
                TextField(
                  decoration: InputDecoration(
                    hintText: 'Search grants...',
                    prefixIcon: const Icon(Icons.search),
                    fillColor: theme.colorScheme.surfaceContainerLow,
                  ),
                ),
                const SizedBox(height: 16),
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: [
                      _buildFilterChip(context, 'All', true),
                      _buildFilterChip(context, 'Internal', false),
                      _buildFilterChip(context, 'National', false),
                      _buildFilterChip(context, 'International', false),
                      _buildFilterChip(context, 'Science', false),
                    ],
                  ),
                ),
              ],
            ),
          ),
          // Grant List
          Expanded(
            child: ListView(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              children: [
                _buildGrantCard(
                  context,
                  'Hibah Penelitian Internal Dasar 2026',
                  'Universitas Gadjah Mada',
                  'Rp 50.000.000',
                  'May 30, 2026',
                  'Fundamental',
                ),
                _buildGrantCard(
                  context,
                  'Skema Penelitian Terapan Nasional',
                  'Kemendikbudristek',
                  'Rp 150.000.000',
                  'June 15, 2026',
                  'Applied',
                ),
                _buildGrantCard(
                  context,
                  'Global Health Innovation Grant',
                  'World Health Organization',
                  '\$10,000',
                  'July 10, 2026',
                  'Health',
                ),
                _buildGrantCard(
                  context,
                  'Sustainable Energy Fellowship',
                  'Clean Energy Fund',
                  'Rp 75.000.000',
                  'June 20, 2026',
                  'Energy',
                ),
                const SizedBox(height: 24),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterChip(BuildContext context, String label, bool isSelected) {
    final theme = Theme.of(context);
    return Padding(
      padding: const EdgeInsets.only(right: 8.0),
      child: FilterChip(
        label: Text(label),
        selected: isSelected,
        onSelected: (val) {},
        backgroundColor: Colors.white,
        selectedColor: theme.colorScheme.primary.withOpacity(0.1),
        checkmarkColor: theme.colorScheme.primary,
        labelStyle: TextStyle(
          color: isSelected ? theme.colorScheme.primary : theme.colorScheme.onSurface,
          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: BorderSide(
            color: isSelected ? theme.colorScheme.primary : theme.colorScheme.outlineVariant,
          ),
        ),
      ),
    );
  }

  Widget _buildGrantCard(BuildContext context, String title, String institution, String amount, String deadline, String category) {
    final theme = Theme.of(context);
    return Container(
      margin: const EdgeInsets.only(bottom: 20),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: theme.colorScheme.outlineVariant.withOpacity(0.2)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.02),
            blurRadius: 20,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: theme.colorScheme.tertiary.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(4),
                ),
                child: Text(
                  category.toUpperCase(),
                  style: TextStyle(
                    color: theme.colorScheme.tertiary,
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              Icon(Icons.bookmark_border, color: theme.colorScheme.onSurfaceVariant),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            title,
            style: theme.textTheme.headlineSmall?.copyWith(fontSize: 18),
          ),
          const SizedBox(height: 4),
          Text(
            institution,
            style: theme.textTheme.labelMedium,
          ),
          const SizedBox(height: 20),
          Row(
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Amount', style: TextStyle(fontSize: 10, color: Colors.grey)),
                  Text(amount, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                ],
              ),
              const Spacer(),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  const Text('Deadline', style: TextStyle(fontSize: 10, color: Colors.grey)),
                  Text(deadline, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                ],
              ),
            ],
          ),
          const SizedBox(height: 20),
          SizedBox(
            width: double.infinity,
            child: OutlinedButton(
              onPressed: () {},
              style: OutlinedButton.styleFrom(
                side: BorderSide(color: theme.colorScheme.primary),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
              ),
              child: const Text('View Details'),
            ),
          ),
        ],
      ),
    );
  }
}
