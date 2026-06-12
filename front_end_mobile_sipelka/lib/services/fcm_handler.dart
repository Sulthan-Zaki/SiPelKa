import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';
import 'package:get/get.dart';
import '../models/storage_key.dart';
import '../screens/grant_detail_screen.dart';
import 'local_storage_service.dart';
import 'grant_service.dart';

// Background message handler
@pragma('vm:entry-point')
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp();
  if (kDebugMode) {
    print('Handling background message: ${message.messageId}');
  }
}

class FcmHandler {
  static final FcmHandler instance = FcmHandler._internal();

  FcmHandler._internal();

  factory FcmHandler() => instance;

  FirebaseMessaging get _fcm => FirebaseMessaging.instance;

  Future<void> initialize() async {
    try {
      if (Firebase.apps.isEmpty) {
        await Firebase.initializeApp();
      }

      FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);

      NotificationSettings settings = await _fcm.requestPermission(
        alert: true,
        announcement: false,
        badge: true,
        carPlay: false,
        criticalAlert: false,
        provisional: false,
        sound: true,
      );

      if (kDebugMode) {
        print('User granted notification permission: ${settings.authorizationStatus}');
      }

      FirebaseMessaging.onMessage.listen((RemoteMessage message) {
        if (message.notification != null) {
          Get.snackbar(
            message.notification!.title ?? 'Notification',
            message.notification!.body ?? '',
            snackPosition: SnackPosition.TOP,
            duration: const Duration(seconds: 4),
            onTap: (snack) {
              _handleNotificationClick(message);
            },
          );
        }
      });

      FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
        if (kDebugMode) {
          print('Notification clicked while app was in background: ${message.messageId}');
        }
        _handleNotificationClick(message);
      });

      RemoteMessage? initialMessage = await _fcm.getInitialMessage();
      if (initialMessage != null) {
        if (kDebugMode) {
          print('Notification clicked while app was terminated: ${initialMessage.messageId}');
        }
        Future.delayed(const Duration(milliseconds: 1500), () {
          _handleNotificationClick(initialMessage);
        });
      }
    } catch (e) {
      if (kDebugMode) {
        print('Error during FCM initialization: $e');
      }
    }
  }

  Future<void> _handleNotificationClick(RemoteMessage message) async {
    try {
      final token = await LocalStorageService.read(StorageKey.token);
      final isLoggedIn = await LocalStorageService.read(StorageKey.isLoggedIn);
      if (token == null || isLoggedIn != true) {
        if (kDebugMode) {
          print('User is not logged in. Aborting notification navigation.');
        }
        return;
      }

      final data = message.data;
      if (data['type'] == 'grant' && data['id'] != null) {
        final grantId = data['id'];
        if (kDebugMode) {
          print('Navigating to GrantDetailScreen for ID: $grantId');
        }
        final grantService = GrantService();
        final grant = await grantService.getGrantById(grantId.toString());
        Get.to(() => GrantDetailScreen(grant: grant));
      }
    } catch (e) {
      if (kDebugMode) {
        print('Error navigating from notification: $e');
      }
    }
  }

  Future<String?> getFcmToken() async {
    try {
      String? token = await _fcm.getToken();
      return token;
    } catch (e) {
      return null;
    }
  }
}
