package com.sipelka.backend.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import jakarta.annotation.PostConstruct;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;

@Configuration
public class FirebaseConfig {

    private static final Logger logger = LoggerFactory.getLogger(FirebaseConfig.class);

    @PostConstruct
    public void initialize() {
        try {
            logger.info("Initializing Firebase SDK...");
            InputStream serviceAccount = null;

            // 1. Try reading from external root folder first (for docker/external mounts)
            if (Files.exists(Paths.get("firebase-service-account.json"))) {
                logger.info("Loading Firebase credentials from external root file...");
                serviceAccount = Files.newInputStream(Paths.get("firebase-service-account.json"));
            } else {
                // 2. Try loading from resources classpath
                ClassPathResource resource = new ClassPathResource("firebase-service-account.json");
                if (resource.exists()) {
                    logger.info("Loading Firebase credentials from classpath resource...");
                    serviceAccount = resource.getInputStream();
                }
            }

            if (serviceAccount == null) {
                logger.warn("Firebase private key file (firebase-service-account.json) not found in root or classpath. Skipping Firebase initialization. Push notifications will be disabled.");
                return;
            }

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
                logger.info("Firebase SDK has been initialized successfully!");
            }
        } catch (Exception e) {
            logger.error("Failed to initialize Firebase SDK: {}. Push notifications will be disabled.", e.getMessage());
        }
    }
}
