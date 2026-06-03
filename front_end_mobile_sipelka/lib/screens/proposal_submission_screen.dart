import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:file_picker/file_picker.dart';
import 'package:front_end_mobile_sipelka/controllers/proposal_controller.dart';

class ProposalSubmissionScreen extends StatefulWidget {
  const ProposalSubmissionScreen({super.key});

  @override
  State<ProposalSubmissionScreen> createState() =>
      _ProposalSubmissionScreenState();
}

class _ProposalSubmissionScreenState extends State<ProposalSubmissionScreen> {
  final _titleController = TextEditingController();
  final _abstractController = TextEditingController();
  String? _selectedFilePath;

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(ProposalController());
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
              decoration: const InputDecoration(
                  hintText: 'Enter the full title of your research'),
            ),
            const SizedBox(height: 24),
            _buildLabel(theme, 'Funding Scheme'),
            Obx(() {
              if (controller.grants.isEmpty) {
                return const Text('No grants available');
              }
              return DropdownButtonFormField<String>(
                value: controller.selectedGrant.value?.id,
                items: controller.grants.map((grant) {
                  return DropdownMenuItem(
                    value: grant.id,
                    child: Text(grant.namaProgram),
                  );
                }).toList(),
                onChanged: (v) {
                  final grant =
                      controller.grants.firstWhere((g) => g.id == v);
                  controller.selectGrant(grant);
                },
              );
            }),
            const SizedBox(height: 24),
            _buildLabel(theme, 'Abstract'),
            TextField(
              controller: _abstractController,
              maxLines: 6,
              decoration: const InputDecoration(
                  hintText: 'Summarize your research proposal...'),
            ),
            const SizedBox(height: 24),
            _buildLabel(theme, 'Supporting Documents'),
            GestureDetector(
              onTap: () async {
                final result = await FilePicker.platform.pickFiles(
                  type: FileType.custom,
                  allowedExtensions: ['pdf'],
                );
                if (result != null) {
                  controller.selectedFileName.value =
                      result.files.single.name;
                  _selectedFilePath = result.files.single.path;
                  setState(() {});
                }
              },
              child: Obx(() => Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(32),
                    decoration: BoxDecoration(
                      color: theme.colorScheme.surfaceContainerLow,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: controller.selectedFileName.value.isNotEmpty
                            ? theme.colorScheme.primary
                            : theme.colorScheme.outlineVariant,
                        style: controller.selectedFileName.value.isNotEmpty
                            ? BorderStyle.solid
                            : BorderStyle.none,
                      ),
                    ),
                    child: controller.selectedFileName.value.isNotEmpty
                        ? Column(
                            children: [
                              Icon(Icons.check_circle,
                                  color: theme.colorScheme.primary, size: 40),
                              const SizedBox(height: 12),
                              Text(
                                controller.selectedFileName.value,
                                style: const TextStyle(
                                    fontWeight: FontWeight.bold),
                                textAlign: TextAlign.center,
                              ),
                              const SizedBox(height: 4),
                              const Text('Tap to change file',
                                  style: TextStyle(
                                      fontSize: 12, color: Colors.grey)),
                            ],
                          )
                        : Column(
                            children: [
                              Icon(Icons.upload_file,
                                  color: theme.colorScheme.primary, size: 40),
                              const SizedBox(height: 12),
                              const Text('Upload PDF (Max 10MB)',
                                  style:
                                      TextStyle(fontWeight: FontWeight.bold)),
                              const Text('Drag & drop or tap to select',
                                  style: TextStyle(
                                      fontSize: 12, color: Colors.grey)),
                            ],
                          ),
                  )),
            ),
            const SizedBox(height: 48),
            Obx(
              () => SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: controller.isLoading.value
                      ? null
                      : () {
                          controller.submitProposal(
                            _titleController.text,
                            _abstractController.text,
                            _selectedFilePath,
                          );
                        },
                  child: controller.isLoading.value
                      ? const SizedBox(
                          width: 24,
                          height: 24,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            valueColor:
                                AlwaysStoppedAnimation<Color>(Colors.white),
                          ),
                        )
                      : const Text('Submit Proposal'),
                ),
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
        style:
            theme.textTheme.labelMedium?.copyWith(fontWeight: FontWeight.bold),
      ),
    );
  }
}
