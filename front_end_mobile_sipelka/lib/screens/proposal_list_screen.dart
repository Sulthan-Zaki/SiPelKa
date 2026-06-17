import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:front_end_mobile_sipelka/controllers/proposal_controller.dart';
import 'package:front_end_mobile_sipelka/services/file_download_service.dart';

class ProposalListScreen extends StatelessWidget {
  const ProposalListScreen({super.key});

  String _formatDate(DateTime? date) {
    if (date == null) return '-';
    final months = [
      '', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return '${date.day} ${months[date.month]} ${date.year}';
  }

  Color _getStatusColor(String status) {
    switch (status.toUpperCase()) {
      case 'APPROVED':
        return Colors.green;
      case 'REJECTED':
        return Colors.red;
      case 'UNDER_REVIEW':
        return Colors.orange;
      case 'SUBMITTED':
        return Colors.blue;
      case 'DRAFT':
      default:
        return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(ProposalController());
    final theme = Theme.of(context);

    // Trigger load on build if not already loaded or to refresh
    WidgetsBinding.instance.addPostFrameCallback((_) {
      controller.loadProposals();
    });

    return Scaffold(
      appBar: AppBar(
        title: const Text('My Proposals',
            style: TextStyle(fontWeight: FontWeight.bold)),
        centerTitle: true,
        // Allow going back to dashboard
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Get.back(),
        ),
      ),
      body: Column(
        children: [
          Obx(() => Container(
                padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 12.0),
                child: SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: controller.availableStatusFilters.map((filter) {
                      final isSelected =
                          controller.selectedStatusFilter.value == filter;
                      return Padding(
                        padding: const EdgeInsets.only(right: 8.0),
                        child: FilterChip(
                          label: Text(filter),
                          selected: isSelected,
                          onSelected: (_) =>
                              controller.selectedStatusFilter.value = filter,
                          backgroundColor: Colors.white,
                          selectedColor:
                              theme.colorScheme.primary.withOpacity(0.1),
                          checkmarkColor: theme.colorScheme.primary,
                          labelStyle: TextStyle(
                            color: isSelected
                                ? theme.colorScheme.primary
                                : theme.colorScheme.onSurface,
                            fontWeight: isSelected
                                ? FontWeight.bold
                                : FontWeight.normal,
                          ),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(20),
                            side: BorderSide(
                              color: isSelected
                                  ? theme.colorScheme.primary
                                  : theme.colorScheme.outlineVariant,
                            ),
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                ),
              )),
          Expanded(
            child: RefreshIndicator(
              onRefresh: () => controller.loadProposals(),
              child: Obx(() {
                if (controller.isLoadingProposals.value) {
                  return const Center(child: CircularProgressIndicator());
                }

                final displayProposals = controller.filteredProposals;

                if (displayProposals.isEmpty) {
                  return SingleChildScrollView(
                    physics: const AlwaysScrollableScrollPhysics(),
                    child: Container(
                      height: MediaQuery.of(context).size.height - 200,
                      alignment: Alignment.center,
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.description_outlined,
                            size: 72,
                            color: theme.colorScheme.onSurfaceVariant.withOpacity(0.4),
                          ),
                          const SizedBox(height: 16),
                          Text(
                            'No proposals found',
                            style: theme.textTheme.titleMedium?.copyWith(
                              color: theme.colorScheme.onSurfaceVariant,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Try changing your status filter.',
                            style: theme.textTheme.bodyMedium?.copyWith(
                              color: theme.colorScheme.onSurfaceVariant.withOpacity(0.6),
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                }

                return ListView.builder(
                  padding: const EdgeInsets.all(24.0),
                  itemCount: displayProposals.length,
                  itemBuilder: (context, index) {
                    final proposal = displayProposals[index];
                    final statusColor = _getStatusColor(proposal.statusProposal);

                    return Card(
                      elevation: 0,
                      margin: const EdgeInsets.only(bottom: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                        side: BorderSide(
                          color: theme.colorScheme.outlineVariant.withOpacity(0.3),
                        ),
                      ),
                      child: Theme(
                        data: theme.copyWith(
                          splashColor: Colors.transparent,
                          highlightColor: Colors.transparent,
                        ),
                        child: ExpansionTile(
                          key: ValueKey(proposal.id),
                          shape: const Border(),
                          collapsedShape: const Border(),
                          tilePadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                          childrenPadding: const EdgeInsets.all(20),
                          title: Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                decoration: BoxDecoration(
                                  color: statusColor.withOpacity(0.1),
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: Text(
                                  proposal.statusProposal
                                      .split('_')
                                      .map((w) => w.isEmpty
                                          ? ''
                                          : w[0].toUpperCase() +
                                              w.substring(1).toLowerCase())
                                      .join(' '),
                                  style: TextStyle(
                                    color: statusColor,
                                    fontSize: 10,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                              const SizedBox(width: 8),
                              if (proposal.skorRuleBased != null)
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: theme.colorScheme.primary.withOpacity(0.1),
                                    borderRadius: BorderRadius.circular(6),
                                  ),
                                  child: Text(
                                    'Skor: ${proposal.skorRuleBased}',
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
                                  proposal.judulPenelitian,
                                  style: theme.textTheme.titleMedium?.copyWith(
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(height: 6),
                                Text(
                                  proposal.hibahName ?? 'Funding Scheme',
                                  style: theme.textTheme.bodyMedium?.copyWith(
                                    color: theme.colorScheme.primary,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  'Submitted on: ${_formatDate(proposal.createdAt)}',
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
                            _buildDetailRow(context, 'Scheme Fokus', proposal.bidangPenelitian),
                            const SizedBox(height: 12),
                            _buildDetailRow(context, 'Abstract', proposal.ringkasan ?? '-'),
                            if (proposal.dokumenUrl != null && proposal.dokumenUrl!.isNotEmpty) ...[
                              const SizedBox(height: 12),
                              _buildDetailRow(
                                context,
                                'Dokumen Pendukung',
                                proposal.dokumenUrl!.split('/').last,
                                isLink: true,
                                onTap: () {
                                  FileDownloadService.downloadFile(proposal.dokumenUrl!);
                                },
                              ),
                            ],
                          ],
                        ),
                      ),
                    );
                  },
                );
              }),
            ),
          ),
        ],
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
