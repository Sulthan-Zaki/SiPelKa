class Grant {
  final String id;
  final String? adminId;
  final String namaProgram;
  final String? deskripsi;
  final String? bidangFokus;
  final DateTime tanggalBuka;
  final DateTime tanggalTutup;
  final double? totalDanaMaksimal;
  final DateTime? createdAt;

  Grant({
    required this.id,
    this.adminId,
    required this.namaProgram,
    this.deskripsi,
    this.bidangFokus,
    required this.tanggalBuka,
    required this.tanggalTutup,
    this.totalDanaMaksimal,
    this.createdAt,
  });

  bool get isOpen {
    final now = DateTime.now();
    return now.isAfter(tanggalBuka) && now.isBefore(tanggalTutup);
  }

  int? get daysRemaining {
    return tanggalTutup.difference(DateTime.now()).inDays;
  }

  factory Grant.fromJson(Map<String, dynamic> json) {
    return Grant(
      id: json['id'] as String,
      adminId: json['adminId'] as String?,
      namaProgram: json['namaProgram'] as String,
      deskripsi: json['deskripsi'] as String?,
      bidangFokus: json['bidangFokus'] as String?,
      tanggalBuka: DateTime.parse(json['tanggalBuka'] as String),
      tanggalTutup: DateTime.parse(json['tanggalTutup'] as String),
      totalDanaMaksimal: (json['totalDanaMaksimal'] as num?)?.toDouble(),
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'] as String)
          : null,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'adminId': adminId,
    'namaProgram': namaProgram,
    'deskripsi': deskripsi,
    'bidangFokus': bidangFokus,
    'tanggalBuka': tanggalBuka.toIso8601String(),
    'tanggalTutup': tanggalTutup.toIso8601String(),
    'totalDanaMaksimal': totalDanaMaksimal,
    'createdAt': createdAt?.toIso8601String(),
  };
}
