import '../models/notification.dart';
import 'api_service.dart';

class NotificationService {
  final ApiService _apiService = ApiService();

  Future<List<AppNotification>> getNotificationsByUser(String userId) async {
    final response =
        await _apiService.get('/api/notifikasi/user/$userId');
    return (response.data as List<dynamic>)
        .map((e) => AppNotification.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<AppNotification> markAsRead(String id) async {
    final response = await _apiService.put('/api/notifikasi/$id/read');
    return AppNotification.fromJson(response.data as Map<String, dynamic>);
  }
}
