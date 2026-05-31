class Proposal {
  final String id;
  final String penelitiId;
  final String? penelitiName;
  final String hibahId;
  final String? hibahName;
  final String judulPenelitian;
  final String bidangPenelitian;
  final String? ringkasan;
  final String? dokumenUrl;
  final String statusProposal;
  final bool? kriteriaKelengkapanDokumen;
  final bool? kesesuaianBidang;
  final int? skorRuleBased;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  Proposal({
    required this.id,
    required this.penelitiId,
    this.penelitiName,
    required this.hibahId,
    this.hibahName,
    required this.judulPenelitian,
    required this.bidangPenelitian,
    this.ringkasan,
    this.dokumenUrl,
    required this.statusProposal,
    this.kriteriaKelengkapanDokumen,
    this.kesesuaianBidang,
    this.skorRuleBased,
    this.createdAt,
    this.updatedAt,
  });

  factory Proposal.fromJson(Map<String, dynamic> json) {
    return Proposal(
      id: json['id'] as String,
      penelitiId: json['penelitiId'] as String,
      penelitiName: json['penelitiName'] as String?,
      hibahId: json['hibahId'] as String,
      hibahName: json['hibahName'] as String?,
      judulPenelitian: json['judulPenelitian'] as String,
      bidangPenelitian: json['bidangPenelitian'] as String,
      ringkasan: json['ringkasan'] as String?,
      dokumenUrl: json['dokumenUrl'] as String?,
      statusProposal: json['statusProposal'] as String,
      kriteriaKelengkapanDokumen: json['kriteriaKelengkapanDokumen'] as bool?,
      kesesuaianBidang: json['kesesuaianBidang'] as bool?,
      skorRuleBased: json['skorRuleBased'] as int?,
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'] as String)
          : null,
      updatedAt: json['updatedAt'] != null
          ? DateTime.parse(json['updatedAt'] as String)
          : null,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'penelitiId': penelitiId,
    'penelitiName': penelitiName,
    'hibahId': hibahId,
    'hibahName': hibahName,
    'judulPenelitian': judulPenelitian,
    'bidangPenelitian': bidangPenelitian,
    'ringkasan': ringkasan,
    'dokumenUrl': dokumenUrl,
    'statusProposal': statusProposal,
    'kriteriaKelengkapanDokumen': kriteriaKelengkapanDokumen,
    'kesesuaianBidang': kesesuaianBidang,
    'skorRuleBased': skorRuleBased,
    'createdAt': createdAt?.toIso8601String(),
    'updatedAt': updatedAt?.toIso8601String(),
  };
}
