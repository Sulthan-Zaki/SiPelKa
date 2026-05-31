class Logbook {
  final String id;
  final String proposalId;
  final DateTime tanggalKegiatan;
  final String deskripsiProgress;
  final String? kendala;
  final String? lampiranUrl;
  final DateTime? createdAt;

  Logbook({
    required this.id,
    required this.proposalId,
    required this.tanggalKegiatan,
    required this.deskripsiProgress,
    this.kendala,
    this.lampiranUrl,
    this.createdAt,
  });

  String get formattedMonthDay {
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
    ];
    return '${tanggalKegiatan.day} ${months[tanggalKegiatan.month - 1]} ${tanggalKegiatan.year}';
  }

  factory Logbook.fromJson(Map<String, dynamic> json) {
    return Logbook(
      id: json['id'] as String,
      proposalId: json['proposalId'] as String,
      tanggalKegiatan: DateTime.parse(json['tanggalKegiatan'] as String),
      deskripsiProgress: json['deskripsiProgress'] as String,
      kendala: json['kendala'] as String?,
      lampiranUrl: json['lampiranUrl'] as String?,
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'] as String)
          : null,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'proposalId': proposalId,
    'tanggalKegiatan': tanggalKegiatan.toIso8601String(),
    'deskripsiProgress': deskripsiProgress,
    'kendala': kendala,
    'lampiranUrl': lampiranUrl,
    'createdAt': createdAt?.toIso8601String(),
  };
}
