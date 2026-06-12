import '../models/logbook.dart';
import 'api_service.dart';

class LogbookService {
  final ApiService _apiService = ApiService();

  Future<List<Logbook>> getLogbooksByProposal(String proposalId) async {
    final response = await _apiService.get(
      '/api/logbooks/proposal/$proposalId',
    );
    return (response.data as List<dynamic>)
        .map((e) => Logbook.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<Logbook> createLogbook(Map<String, dynamic> data) async {
    final response = await _apiService.post('/api/logbooks', data: data);
    return Logbook.fromJson(response.data as Map<String, dynamic>);
  }

  Future<Logbook> updateLogbook(String id, Map<String, dynamic> data) async {
    final response = await _apiService.put('/api/logbooks/$id', data: data);
    return Logbook.fromJson(response.data as Map<String, dynamic>);
  }

  Future<void> deleteLogbook(String id) async {
    await _apiService.delete('/api/logbooks/$id');
  }
}
