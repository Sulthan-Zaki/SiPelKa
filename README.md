# SiPelKa

**Si**stem **I**nformasi **Pe**nelitian dan **Ka**pasitas

Sistem manajemen hibah penelitian untuk mengelola program hibah, proposal, review, pencairan dana, dan logbook penelitian. Terdiri dari backend API, dashboard web, dan aplikasi mobile.

## Daftar Isi

- [Prasyarat](#prasyarat)
- [Struktur Proyek](#struktur-proyek)
- [Cara Cepat (Docker)](#cara-cepat-docker)
- [Backend](#backend)
  - [Development dengan Docker](#development-dengan-docker)
  - [Development tanpa Docker](#development-tanpa-docker)
  - [Production](#production)
- [Frontend Web](#frontend-web)
  - [Development dengan Docker](#development-dengan-docker-1)
  - [Development tanpa Docker](#development-tanpa-docker-1)
  - [Production Build](#production-build)
- [Menjalankan Backend + Frontend Bersamaan](#menjalankan-backend--frontend-bersamaan)
- [Akun Demo (Data Dummy)](#akun-demo-data-dummy)
- [Konfigurasi](#konfigurasi)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

---

## Prasyarat

| Alat | Versi | Keterangan |
|------|-------|------------|
| **Docker & Docker Compose** | terbaru | **Cara utama (recommended)** |
| Java JDK | 21+ | Opsional, untuk non-Docker |
| Node.js | 20+ | Opsional, untuk frontend non-Docker |
| npm | 10+ | Opsional, untuk frontend non-Docker |
| Git | terbaru | Version control |

---

## Struktur Proyek

```
SiPelKa/
├── backend/                      # Spring Boot REST API
│   ├── src/
│   │   └── main/java/com/sipelka/backend/
│   │       ├── config/           # Security, JWT filter, DataSeeder
│   │       ├── controller/       # REST controllers
│   │       ├── dto/              # Request/response DTOs
│   │       ├── model/            # JPA entities & enums
│   │       ├── repository/       # Spring Data JPA repos
│   │       └── service/          # Business logic
│   ├── docker-compose.dev.yml    # Backend + PostgreSQL dev
│   ├── docker-compose.prod.yml   # Backend + PostgreSQL prod
│   ├── Dockerfile                # Multi-stage production build
│   ├── Dockerfile.dev            # Dev image (hot reload)
│   ├── run-dev.sh / run-dev.bat  # Shortcut scripts
│   └── pom.xml                   # Maven config
│
├── front-end-web-sipelka/        # Next.js dashboard
│   ├── app/                      # App Router pages
│   ├── components/               # React components
│   ├── lib/                      # API clients, auth
│   ├── types/                    # TypeScript types
│   ├── middleware.ts             # Auth middleware
│   ├── docker-compose.dev.yml    # Frontend dev Docker
│   └── Dockerfile.dev            # Dev image
│
└── front_end_mobile_sipelka/     # Flutter mobile app
```

| Komponen | Teknologi | Port Default |
|----------|-----------|-------------|
| Backend API | Spring Boot 4, Java 21, PostgreSQL 18 | `8080` |
| Frontend Web | Next.js 16, React 19, TypeScript, Tailwind CSS v4 | `3000` |
| Frontend Mobile | Flutter 3.11+, GetX, Dio | — |

---

## Cara Cepat (Docker)

Jalankan backend dan frontend secara terpisah di dua terminal:

**Terminal 1 — Backend:**
```bash
cd backend
docker compose -f docker-compose.dev.yml up --build
```

**Terminal 2 — Frontend:**
```bash
cd front-end-web-sipelka
docker compose -f docker-compose.dev.yml up --build
```

Buka http://localhost:3000. Login dengan akun demo (lihat [Akun Demo](#akun-demo-data-dummy)).

---

## Backend

### Development dengan Docker

```bash
cd backend
docker compose -f docker-compose.dev.yml up --build
```

Proses ini akan:
- Membuild image backend dengan **hot reload** (source code di-mount)
- Menjalankan **PostgreSQL 18** di port `5433`
- Mengaktifkan **remote debugging** di port `5005`
- **Auto-seed data dummy** jika `APP_SEED_DATA=true`

#### Service yang berjalan

| Service | URL | Port |
|---------|-----|------|
| Backend API | http://localhost:8080 | `8080` |
| PostgreSQL | localhost:5433 | `5433` |
| Remote Debug | — | `5005` |

#### Menghentikan & Mereset Database

```bash
# Hentikan container (data tetap tersimpan di volume)
docker compose -f docker-compose.dev.yml down

# Hentikan container dan HAPUS volume database
docker compose -f docker-compose.dev.yml down -v

# Mulai ulang dengan build ulang
docker compose -f docker-compose.dev.yml up --build
```

### Development tanpa Docker

Jika ingin menjalankan backend langsung di host (tanpa Docker):

**1. Pastikan PostgreSQL berjalan**

PostgreSQL harus aktif di `localhost:5432` dan database `sipelka_db` sudah dibuat:

```bash
# Contoh: create database via psql
psql -U postgres -c "CREATE DATABASE sipelka_db;"
psql -U postgres -c "CREATE USER sipelka_user WITH PASSWORD 'sipelka_secret';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE sipelka_db TO sipelka_user;"
```

**2. Sesuaikan konfigurasi database**

Edit `backend/src/main/resources/application.yaml`:
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/sipelka_db   # ubah dari 5433 → 5432
    username: sipelka_user
    password: sipelka_secret
```

**3. Jalankan aplikasi**

```bash
cd backend
./mvnw spring-boot:run -DAPP_SEED_DATA=true
```

> **Catatan:** Di Windows, gunakan `mvnw.cmd` sebagai ganti `./mvnw`.

### Production

#### Via Docker (recommended)

```bash
cd backend
docker compose -f docker-compose.prod.yml up --build -d
```

Proses ini akan:
- **Multi-stage build**: compile dengan JDK, jalankan dengan JRE (image lebih kecil)
- Menonaktifkan `show-sql` dan mengaktifkan `ddl-auto: validate`
- Menambahkan `restart: always` untuk ketersediaan tinggi
- **Volume persisten** untuk PostgreSQL (data tidak hilang saat container restart)

#### Cek Log

```bash
docker logs -f sipelka_backend_prod
```

---

## Frontend Web

### Development dengan Docker

```bash
cd front-end-web-sipelka
docker compose -f docker-compose.dev.yml up --build
```

Akses di http://localhost:3000. Perubahan kode akan otomatis di-reload (hot reload).

### Development tanpa Docker

```bash
cd front-end-web-sipelka
npm install
npm run dev
```

Akses di http://localhost:3000.

**Konfigurasi URL Backend:**

Frontend secara default mengakses backend di `http://localhost:8080`. Jika backend berjalan di host/port berbeda, buat file `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Production Build

```bash
cd front-end-web-sipelka
npm run build      # Membangun static files ke folder .next/
npm start          # Menjalankan production server di port 3000
```

Atau deploy ke **Vercel** (platform Next.js bawaan).

---

## Menjalankan Backend + Frontend Bersamaan

Tidak ada `docker-compose.yml` di root. Gunakan salah satu cara berikut:

### Opsi A — Dua Terminal Terpisah

**Terminal 1:**
```bash
cd backend && docker compose -f docker-compose.dev.yml up --build
```

**Terminal 2:**
```bash
cd front-end-web-sipelka && npm run dev
```

### Opsi B — Semua via Docker (buat compose sendiri)

Buat file `docker-compose.yml` di folder root:

```yaml
services:
  postgres:
    image: postgres:18-alpine
    container_name: sipelka_postgres
    environment:
      POSTGRES_DB: sipelka_db
      POSTGRES_USER: sipelka_user
      POSTGRES_PASSWORD: sipelka_secret
    ports:
      - "5433:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/18/docker
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U sipelka_user -d sipelka_db"]
      interval: 5s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.dev
    container_name: sipelka_backend
    ports:
      - "8080:8080"
    volumes:
      - ./backend/src:/app/src
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/sipelka_db
      SPRING_DATASOURCE_USERNAME: sipelka_user
      SPRING_DATASOURCE_PASSWORD: sipelka_secret
      APP_SEED_DATA: "true"
    depends_on:
      postgres:
        condition: service_healthy

  frontend:
    build:
      context: ./front-end-web-sipelka
      dockerfile: Dockerfile.dev
    container_name: sipelka_frontend
    ports:
      - "3000:3000"
    volumes:
      - ./front-end-web-sipelka:/app
      - /app/node_modules
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:8080
    depends_on:
      - backend

volumes:
  postgres_data:
```

Jalankan dengan:
```bash
docker compose up --build
```

---

## Akun Demo (Data Dummy)

Data dummy akan otomatis di-seed saat backend pertama kali dijalankan dengan `APP_SEED_DATA=true` (sudah di-set di `docker-compose.dev.yml`).

Berikut akun yang bisa digunakan untuk login ke http://localhost:3000:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@sipelka.ac.id | admin123 |
| **Researcher** | researcher1@sipelka.ac.id | researcher123 |
| **Researcher** | researcher2@sipelka.ac.id | researcher123 |
| **Reviewer** | reviewer1@sipelka.ac.id | reviewer123 |
| **Reviewer** | reviewer2@sipelka.ac.id | reviewer123 |

**Data dummy yang tersedia:**
- **4 Program Hibah**: Hibah Riset Dasar, Pengabdian Masyarakat, Inovasi Pendidikan, Ketahanan Pangan
- **8 Proposal**: dalam berbagai status (DRAFT, SUBMITTED, UNDER_REVIEW, APPROVED, REJECTED)
- **7 Review Proposal**: dengan skor dan rekomendasi (LAYAK, REVISI, TIDAK_LAYAK)
- **4 Pencairan Dana**: dengan status CAIR, PROSES, PENDING
- **8 Logbook Penelitian**: progress harian dari proposal yang disetujui
- **8 Notifikasi**: pemberitahuan sistem untuk setiap role

Data di-seed hanya sekali. Jika database sudah berisi data, seed akan dilewati. Untuk mengulang seed:
```bash
docker compose -f docker-compose.dev.yml down -v
docker compose -f docker-compose.dev.yml up --build
```

---

## Konfigurasi

### Backend (`backend/src/main/resources/application.yaml`)

```
# File konfigurasi utama Spring Boot
spring.datasource.url          → Koneksi JDBC ke PostgreSQL
spring.datasource.username     → User database
spring.datasource.password     → Password database
spring.jpa.hibernate.ddl-auto  → update (dev) / validate (prod)
spring.jpa.show-sql            → true (dev) / false (prod)
app.jwt.secret                 → Secret key untuk JWT (GANTI di production!)
app.jwt.expiration-ms          → Masa berlaku token (24 jam default)
app.admin-token                → Token untuk registrasi admin
app.seed-data                  → Aktifkan data dummy (true/false)
```

Custom environment variable yang bisa di-set:
| Variable | Default | Deskripsi |
|----------|---------|-----------|
| `APP_SEED_DATA` | `false` | Set `"true"` untuk mengaktifkan data dummy |
| `SPRING_DATASOURCE_URL` | dari YAML | URL koneksi database |
| `SPRING_DATASOURCE_USERNAME` | dari YAML | User database |
| `SPRING_DATASOURCE_PASSWORD` | dari YAML | Password database |

### Frontend Web

| Variable | Default | Deskripsi |
|----------|---------|-----------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8080` | Base URL backend API |

Set via file `.env.local` di `front-end-web-sipelka/`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

---

## API Endpoints

### Autentikasi & User

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| POST | `/api/users/login` | Login (body: `{email, password}`) | Tidak |
| POST | `/api/users/register/user` | Registrasi user baru | Tidak |
| POST | `/api/users/register/admin` | Registrasi admin (butuh `adminToken`) | Tidak |
| GET | `/api/users` | List semua user | JWT |
| GET | `/api/users/{id}` | Detail user | JWT |
| PUT | `/api/users/{id}` | Update user | JWT |
| DELETE | `/api/users/{id}` | Hapus user | JWT |
| PUT | `/api/users/{id}/activate` | Aktifkan user | JWT |

### Program Hibah

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/hibah` | List semua program hibah |
| POST | `/api/hibah` | Buat program hibah baru |
| GET | `/api/hibah/{id}` | Detail program hibah |
| PUT | `/api/hibah/{id}` | Update program hibah |
| DELETE | `/api/hibah/{id}` | Hapus program hibah |

### Proposal

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/proposals` | List semua proposal |
| POST | `/api/proposals` | Buat proposal baru |
| GET | `/api/proposals/{id}` | Detail proposal |
| PUT | `/api/proposals/{id}` | Update proposal |
| DELETE | `/api/proposals/{id}` | Hapus proposal |

### Review Proposal

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/reviews` | List semua review |
| POST | `/api/reviews` | Buat review baru |
| PUT | `/api/reviews/{id}` | Update review |

### Pencairan Dana

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/pencairan` | List semua pencairan dana |
| POST | `/api/pencairan` | Buat pencairan baru |
| PUT | `/api/pencairan/{id}` | Update status pencairan |

### Logbook Penelitian

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/logbook` | List semua logbook |
| POST | `/api/logbook` | Buat logbook baru |
| PUT | `/api/logbook/{id}` | Update logbook |

### Notifikasi

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/notifications` | List notifikasi user |
| PUT | `/api/notifications/{id}/read` | Tandai notifikasi telah dibaca |

Untuk detail request/response masing-masing endpoint, lihat kode di `backend/src/main/java/com/sipelka/backend/controller/`.

---

## Testing

### Backend

```bash
cd backend
./mvnw test
```

Menjalankan unit test untuk semua service layer (`UserService`, `ProposalService`, `ReviewProposalService`, `ProgramHibahService`, `PencairanDanaService`, `LogbookPenelitianService`, `NotifikasiService`).

### Frontend Web

```bash
cd front-end-web-sipelka
npm run lint    # ESLint check
```

---

## Troubleshooting

### Backend tidak bisa konek ke database

Pastikan PostgreSQL sudah berjalan:
```bash
docker ps | grep postgres
```

Jika pakai Docker, cek log:
```bash
docker logs sipelka_postgres_dev
```

### Port sudah dipakai

Ubah port di `docker-compose.dev.yml`:
```yaml
ports:
  - "8081:8080"   # ganti port host
```

### Data dummy tidak muncul

Pastikan environment `APP_SEED_DATA=true`. Jika database sudah berisi data, seed akan dilewati. Reset database:
```bash
docker compose -f docker-compose.dev.yml down -v
docker compose -f docker-compose.dev.yml up --build
```

### Frontend tidak bisa terhubung ke backend

1. Pastikan backend berjalan dan bisa diakses
2. Cek apakah `NEXT_PUBLIC_API_URL` sudah benar
3. Cek console browser untuk error CORS

### Permission denied saat menjalankan `mvnw`

```bash
chmod +x backend/mvnw
```

### Log backend

```bash
# Mode Docker
docker logs -f sipelka_backend_dev

# Mode non-Docker
# Output langsung di terminal
```
