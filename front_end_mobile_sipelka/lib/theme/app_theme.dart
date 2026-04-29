import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  static const Color primaryColor = Color(0xFF7F080C);
  static const Color primaryContainerColor = Color(0xFFA12520);
  static const Color tertiaryColor = Color(0xFF4F3A00); // Gold
  static const Color backgroundColor = Color(0xFFFCF8F8);
  static const Color surfaceColor = Color(0xFFFCF8F8);
  static const Color surfaceContainerLow = Color(0xFFF6F3F2);
  static const Color surfaceContainerLowest = Color(0xFFFFFFFF);
  static const Color onSurfaceVariant = Color(0xFF59413E);
  static const Color outlineVariant = Color(0xFFE1BFBB);
  static const Color errorColor = Color(0xFFBA1A1A);
  static const Color onBackgroundColor = Color(0xFF1C1B1B);

  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: primaryColor,
        primary: primaryColor,
        onPrimary: Colors.white,
        primaryContainer: primaryContainerColor,
        onPrimaryContainer: Colors.white,
        tertiary: tertiaryColor,
        onTertiary: Colors.white,
        surface: surfaceColor,
        onSurface: onBackgroundColor,
        error: errorColor,
        onError: Colors.white,
        outlineVariant: outlineVariant,
      ),
      scaffoldBackgroundColor: backgroundColor,
      textTheme: GoogleFonts.interTextTheme().copyWith(
        displayMedium: GoogleFonts.inter(
          fontSize: 32,
          fontWeight: FontWeight.bold,
          color: onBackgroundColor,
        ),
        headlineSmall: GoogleFonts.inter(
          fontSize: 20,
          fontWeight: FontWeight.w600,
          color: onBackgroundColor,
        ),
        bodyLarge: GoogleFonts.inter(
          fontSize: 16,
          height: 1.6,
          color: onBackgroundColor,
        ),
        labelMedium: GoogleFonts.inter(
          fontSize: 14,
          color: onSurfaceVariant,
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primaryColor,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: surfaceContainerLow,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(4),
          borderSide: BorderSide.none,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(4),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(4),
          borderSide: const BorderSide(color: primaryColor, width: 2),
        ),
      ),
    );
  }
}
