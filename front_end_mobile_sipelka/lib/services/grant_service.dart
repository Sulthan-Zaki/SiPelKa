import '../models/grant.dart';
import 'api_service.dart';

class GrantService {
  final ApiService _apiService = ApiService();

  Future<List<Grant>> getOpenGrants() async {
    final response = await _apiService.get('/api/hibah/open');
    return (response.data as List<dynamic>)
        .map((e) => Grant.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<List<Grant>> getAllGrants() async {
    final response = await _apiService.get('/api/hibah');
    return (response.data as List<dynamic>)
        .map((e) => Grant.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<Grant> getGrantById(String id) async {
    final response = await _apiService.get('/api/hibah/$id');
    return Grant.fromJson(response.data as Map<String, dynamic>);
  }
}
