import '../models/proposal.dart';
import '../models/dashboard_stats.dart';
import 'api_service.dart';

class ProposalService {
  final ApiService _apiService = ApiService();

  Future<Proposal> createProposal(Map<String, dynamic> data) async {
    final response = await _apiService.post('/api/proposals', data: data);
    return Proposal.fromJson(response.data as Map<String, dynamic>);
  }

  Future<Proposal> submitProposal(String id) async {
    final response = await _apiService.post('/api/proposals/$id/submit');
    return Proposal.fromJson(response.data as Map<String, dynamic>);
  }

  Future<List<Proposal>> getProposalsByResearcher(String penelitiId) async {
    final response = await _apiService.get(
      '/api/proposals/peneliti/$penelitiId',
    );
    return (response.data as List<dynamic>)
        .map((e) => Proposal.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<Proposal> getProposalById(String id) async {
    final response = await _apiService.get('/api/proposals/$id');
    return Proposal.fromJson(response.data as Map<String, dynamic>);
  }

  Future<void> deleteProposal(String id) async {
    await _apiService.delete('/api/proposals/$id');
  }

  Future<DashboardStats> getResearcherStats(String penelitiId) async {
    print('Fetching dashboard stats for penelitiId: $penelitiId');
    final response = await _apiService.get(
      '/api/proposals/stats/peneliti/$penelitiId',
    );
    return DashboardStats.fromJson(response.data as Map<String, dynamic>);
  }
}
