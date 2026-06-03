import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:front_end_mobile_sipelka/controllers/logbook_controller.dart';

class DailyLogbookScreen extends StatelessWidget {
  const DailyLogbookScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(LogbookController());
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Daily Logbook'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add_circle_outline),
            onPressed: () => _showAddLogbookDialog(context, controller),
          ),
        ],
      ),
      body: Obx(() {
        if (controller.isLoading.value) {
          return const Center(child: CircularProgressIndicator());
        }

        if (controller.logbooks.isEmpty) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.book_outlined,
                    size: 64,
                    color: theme.colorScheme.onSurfaceVariant.withOpacity(0.4)),
                const SizedBox(height: 16),
                Text('No logbook entries yet',
                    style: theme.textTheme.bodyLarge),
                const SizedBox(height: 8),
                Text('Tap + to add your first entry',
                    style: theme.textTheme.labelMedium),
              ],
            ),
          );
        }

        return RefreshIndicator(
          onRefresh: () => controller.refresh(),
          child: ListView(
            padding: const EdgeInsets.all(24.0),
            children: [
              for (final month in controller.sortedMonths)
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildMonthHeader(theme, month),
                    ...controller.groupedLogbooks[month]!.asMap().entries.map(
                          (entry) => _buildLogEntry(
                            theme,
                            '${entry.value.tanggalKegiatan.day}',
                            _getDayName(
                                entry.value.tanggalKegiatan.weekday),
                            entry.value.deskripsiProgress,
                            entry.value.kendala ?? '',
                            entry.key ==
                                controller.groupedLogbooks[month]!.length -
                                    1,
                            entry.value.id,
                            controller,
                          ),
                        ),
                    const SizedBox(height: 8),
                  ],
                ),
            ],
          ),
        );
      }),
    );
  }

  String _getDayName(int weekday) {
    const days = ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days[weekday];
  }

  void _showAddLogbookDialog(
      BuildContext context, LogbookController controller) {
    final dateController = TextEditingController();
    final descController = TextEditingController();
    final kendalaController = TextEditingController();
    DateTime selectedDate = DateTime.now();
    String? selectedProposalId;

    showDialog(
      context: context,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setDialogState) {
            return AlertDialog(
              title: const Text('Add Logbook Entry'),
              content: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Date picker
                    InkWell(
                      onTap: () async {
                        final date = await showDatePicker(
                          context: context,
                          initialDate: selectedDate,
                          firstDate: DateTime(2020),
                          lastDate: DateTime(2030),
                        );
                        if (date != null) {
                          setDialogState(() {
                            selectedDate = date;
                            dateController.text =
                                '${date.day}/${date.month}/${date.year}';
                          });
                        }
                      },
                      child: InputDecorator(
                        decoration: const InputDecoration(
                          labelText: 'Activity Date',
                          hintText: 'Tap to select date',
                        ),
                        child: Text(
                          dateController.text.isEmpty
                              ? 'Tap to select date'
                              : dateController.text,
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    // Proposal selector
                    DropdownButtonFormField<String>(
                      value: selectedProposalId,
                      decoration: const InputDecoration(
                        labelText: 'Related Proposal',
                      ),
                      items: controller.proposals.map((p) {
                        return DropdownMenuItem(
                          value: p.id,
                          child: Text(
                            p.judulPenelitian,
                            overflow: TextOverflow.ellipsis,
                          ),
                        );
                      }).toList(),
                      onChanged: (v) {
                        setDialogState(() => selectedProposalId = v);
                      },
                    ),
                    const SizedBox(height: 16),
                    TextField(
                      controller: descController,
                      maxLines: 3,
                      decoration: const InputDecoration(
                        labelText: 'Progress Description',
                        hintText: 'Describe your progress...',
                      ),
                    ),
                    const SizedBox(height: 16),
                    TextField(
                      controller: kendalaController,
                      maxLines: 2,
                      decoration: const InputDecoration(
                        labelText: 'Obstacles (optional)',
                        hintText: 'Any challenges faced...',
                      ),
                    ),
                  ],
                ),
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(ctx),
                  child: const Text('Cancel'),
                ),
                ElevatedButton(
                  onPressed: () {
                    if (descController.text.isEmpty) {
                      Get.snackbar('Error', 'Description is required');
                      return;
                    }
                    if (selectedProposalId == null) {
                      Get.snackbar('Error', 'Please select a proposal');
                      return;
                    }
                    final formattedDate =
                        '${selectedDate.year}-${selectedDate.month.toString().padLeft(2, '0')}-${selectedDate.day.toString().padLeft(2, '0')}';
                    controller.addLogbook({
                      'proposalId': selectedProposalId,
                      'tanggalKegiatan': formattedDate,
                      'deskripsiProgress': descController.text,
                      'kendala': kendalaController.text.isEmpty
                          ? null
                          : kendalaController.text,
                    });
                    Navigator.pop(ctx);
                  },
                  child: const Text('Submit'),
                ),
              ],
            );
          },
        );
      },
    );
  }

  Widget _buildMonthHeader(ThemeData theme, String month) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0, top: 8.0),
      child: Text(
        month,
        style: theme.textTheme.headlineSmall
            ?.copyWith(color: theme.colorScheme.primary),
      ),
    );
  }

  Widget _buildLogEntry(
    ThemeData theme,
    String date,
    String day,
    String title,
    String description,
    bool isLast,
    String logbookId,
    LogbookController controller,
  ) {
    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Column(
            children: [
              Text(date,
                  style: theme.textTheme.displayMedium
                      ?.copyWith(fontSize: 20)),
              Text(day,
                  style: theme.textTheme.labelMedium
                      ?.copyWith(fontSize: 12)),
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
                border: Border.all(
                    color: theme.colorScheme.outlineVariant.withOpacity(0.3)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(title,
                            style: theme.textTheme.bodyLarge?.copyWith(
                                fontWeight: FontWeight.bold)),
                      ),
                      InkWell(
                        onTap: () {
                          Get.defaultDialog(
                            title: 'Delete Logbook',
                            middleText:
                                'Are you sure you want to delete this entry?',
                            textCancel: 'Cancel',
                            textConfirm: 'Delete',
                            confirmTextColor: Colors.white,
                            onConfirm: () {
                              controller.deleteLogbook(logbookId);
                              Get.back();
                            },
                          );
                        },
                        child: Icon(Icons.delete_outline,
                            size: 18,
                            color: theme.colorScheme.error),
                      ),
                    ],
                  ),
                  if (description.isNotEmpty) ...[
                    const SizedBox(height: 8),
                    Text(description,
                        style: theme.textTheme.bodyMedium?.copyWith(
                            color: Colors.grey[700], height: 1.4)),
                  ],
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
