package com.sipelka.backend.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import com.google.firebase.FirebaseApp;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class FcmService {

    private static final Logger logger = LoggerFactory.getLogger(FcmService.class);

    public void sendPushNotification(String fcmToken, String title, String body) {
        sendPushNotification(fcmToken, title, body, null);
    }

    public void sendPushNotification(String fcmToken, String title, String body, java.util.Map<String, String> data) {
        if (FirebaseApp.getApps().isEmpty()) {
            logger.warn("Skipping sending push notification because Firebase SDK is not initialized.");
            return;
        }

        if (fcmToken == null || fcmToken.trim().isEmpty()) {
            logger.warn("User has no registered FCM token. Skipping sending push notification.");
            return;
        }

        try {
            logger.info("Sending push notification to token: {}, Title: {}", fcmToken, title);
            
            Notification notification = Notification.builder()
                    .setTitle(title)
                    .setBody(body)
                    .build();

            com.google.firebase.messaging.AndroidNotification androidNotification = 
                    com.google.firebase.messaging.AndroidNotification.builder()
                    .setChannelId("high_importance_channel")
                    .setPriority(com.google.firebase.messaging.AndroidNotification.Priority.HIGH)
                    .build();

            com.google.firebase.messaging.AndroidConfig androidConfig = 
                    com.google.firebase.messaging.AndroidConfig.builder()
                    .setNotification(androidNotification)
                    .setPriority(com.google.firebase.messaging.AndroidConfig.Priority.HIGH)
                    .build();

            com.google.firebase.messaging.Message.Builder builder = Message.builder()
                    .setToken(fcmToken)
                    .setNotification(notification)
                    .setAndroidConfig(androidConfig);

            if (data != null && !data.isEmpty()) {
                builder.putAllData(data);
            }

            Message message = builder.build();

            String response = FirebaseMessaging.getInstance().send(message);
            logger.info("Push notification sent successfully, response code: {}", response);
        } catch (Exception e) {
            logger.error("Failed to send push notification via FCM: {}", e.getMessage());
        }
    }
}
