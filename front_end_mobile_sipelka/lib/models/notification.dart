class AppNotification {
  final String id;
  final String userId;
  final String judulNotifikasi;
  final String pesan;
  final bool? isRead;
  final String? tipeNotifikasi;
  final DateTime? createdAt;

  AppNotification({
    required this.id,
    required this.userId,
    required this.judulNotifikasi,
    required this.pesan,
    this.isRead,
    this.tipeNotifikasi,
    this.createdAt,
  });

  factory AppNotification.fromJson(Map<String, dynamic> json) {
    return AppNotification(
      id: json['id'] as String,
      userId: json['userId'] as String,
      judulNotifikasi: json['judulNotifikasi'] as String,
      pesan: json['pesan'] as String,
      isRead: json['isRead'] as bool?,
      tipeNotifikasi: json['tipeNotifikasi'] as String?,
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'] as String)
          : null,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'userId': userId,
    'judulNotifikasi': judulNotifikasi,
    'pesan': pesan,
    'isRead': isRead,
    'tipeNotifikasi': tipeNotifikasi,
    'createdAt': createdAt?.toIso8601String(),
  };
}
