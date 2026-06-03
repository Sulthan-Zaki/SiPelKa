class User {
  final String id;
  final String name;
  final String email;
  final String nip;
  final String role;
  final bool isActivated;

  User({
    required this.id,
    required this.name,
    required this.email,
    required this.nip,
    required this.role,
    required this.isActivated,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] as String,
      name: json['name'] as String,
      email: json['email'] as String,
      nip: json['nip'] as String,
      role: json['role'] as String,
      isActivated: json['isActivated'] as bool? ?? false,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'email': email,
    'nip': nip,
    'role': role,
    'isActivated': isActivated,
  };
}
