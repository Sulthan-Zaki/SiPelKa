import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:front_end_mobile_sipelka/controllers/proposal_controller.dart';
import 'package:front_end_mobile_sipelka/models/proposal.dart';
import 'package:front_end_mobile_sipelka/services/file_download_service.dart';

class ActiveGrantsScreen extends StatelessWidget {
  const ActiveGrantsScreen({super.key});

  String _formatDate(DateTime? date) {
    if (date == null) return '-';
    final months = [
      '', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return '${date.day} ${months[date.month]} ${date.year}';
  }

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(ProposalController());
    final theme = Theme.of(context);

    // Trigger load on build
    WidgetsBinding.instance.addPostFrameCallback((_) {
      controller.loadProposals();
    });

    return Scaffold(
      appBar: AppBar(
        title: const Text('Active Grants',
            style: TextStyle(fontWeight: FontWeight.bold)),
        centerTitle: true,
      ),
      body: RefreshIndicator(
        onRefresh: () => controller.loadProposals(),
        child: Obx(() {
          if (controller.isLoadingProposals.value) {
            return const Center(child: CircularProgressIndicator());
          }

          final activeGrants = controller.proposals
              .where((p) => p.statusProposal.toUpperCase() == 'APPROVED')
              .toList();

          if (activeGrants.isEmpty) {
            return SingleChildScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              child: Container(
                height: MediaQuery.of(context).size.height - 100,
                alignment: Alignment.center,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.assignment_turned_in_outlined,
                      size: 72,
                      color: theme.colorScheme.onSurfaceVariant.withOpacity(0.4),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'No active grants found',
                      style: theme.textTheme.titleMedium?.copyWith(
                        color: theme.colorScheme.onSurfaceVariant,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Approved proposals will appear here as active grants.',
                      style: theme.textTheme.bodyMedium?.copyWith(
                        color: theme.colorScheme.onSurfaceVariant.withOpacity(0.6),
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
            );
          }

          return ListView.builder(
            padding: const EdgeInsets.all(24.0),
            itemCount: activeGrants.length,
            itemBuilder: (context, index) {
              final grantProposal = activeGrants[index];

              return Card(
                elevation: 0,
                margin: const EdgeInsets.only(bottom: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                  side: BorderSide(
                    color: theme.colorScheme.outlineVariant.withOpacity(0.3),
                  ),
                ),
                child: ExpansionTile(
                  key: ValueKey(grantProposal.id),
                  shape: const Border(),
                  collapsedShape: const Border(),
                  tilePadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                  childrenPadding: const EdgeInsets.all(20),
                  title: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.green.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: const Text(
                          'ACTIVE',
                          style: TextStyle(
                            color: Colors.green,
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      if (grantProposal.skorRuleBased != null)
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: theme.colorScheme.primary.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            'Skor: ${grantProposal.skorRuleBased}',
                            style: TextStyle(
                              color: theme.colorScheme.primary,
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                    ],
                  ),
                  subtitle: Padding(
                    padding: const EdgeInsets.only(top: 8.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          grantProposal.judulPenelitian,
                          style: theme.textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          grantProposal.hibahName ?? 'Funding Scheme',
                          style: theme.textTheme.bodyMedium?.copyWith(
                            color: theme.colorScheme.primary,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Approved on: ${_formatDate(grantProposal.updatedAt ?? grantProposal.createdAt)}',
                          style: theme.textTheme.labelMedium?.copyWith(
                            color: theme.colorScheme.onSurfaceVariant.withOpacity(0.6),
                          ),
                        ),
                      ],
                    ),
                  ),
                  children: [
                    const Divider(),
                    const SizedBox(height: 8),
                    _buildDetailRow(context, 'Scheme Fokus', grantProposal.bidangPenelitian),
                    const SizedBox(height: 12),
                    _buildDetailRow(context, 'Abstract', grantProposal.ringkasan ?? '-'),
                    if (grantProposal.dokumenUrl != null && grantProposal.dokumenUrl!.isNotEmpty) ...[
                      const SizedBox(height: 12),
                      _buildDetailRow(
                        context,
                        'Dokumen Proposal',
                        grantProposal.dokumenUrl!.split('/').last,
                        isLink: true,
                        onTap: () {
                          FileDownloadService.downloadFile(grantProposal.dokumenUrl!);
                        },
                      ),
                    ],
                  ],
                ),
              );
            },
          );
        }),
      ),
    );
  }

  Widget _buildDetailRow(
    BuildContext context,
    String label,
    String value, {
    bool isLink = false,
    VoidCallback? onTap,
  }) {
    final theme = Theme.of(context);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: theme.textTheme.labelMedium?.copyWith(color: Colors.grey),
        ),
        const SizedBox(height: 4),
        isLink
            ? InkWell(
                onTap: onTap,
                child: Row(
                  children: [
                    Icon(Icons.picture_as_pdf, color: theme.colorScheme.primary, size: 18),
                    const SizedBox(width: 6),
                    Expanded(
                      child: Text(
                        value,
                        style: TextStyle(
                          color: theme.colorScheme.primary,
                          decoration: TextDecoration.underline,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
              )
            : Text(
                value,
                style: theme.textTheme.bodyMedium?.copyWith(
                  height: 1.4,
                  color: theme.colorScheme.onSurface,
                ),
              ),
      ],
    );
  }
}
