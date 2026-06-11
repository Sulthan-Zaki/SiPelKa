package com.sipelka.backend.config;

import com.sipelka.backend.model.*;
import com.sipelka.backend.model.enums.*;
import com.sipelka.backend.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.crypto.password.Pbkdf2PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
@ConditionalOnProperty(name = "app.seed-data", havingValue = "true")
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository userRepository;
    private final ProgramHibahRepository programHibahRepository;
    private final ProposalRepository proposalRepository;
    private final ReviewProposalRepository reviewProposalRepository;
    private final PencairanDanaRepository pencairanDanaRepository;
    private final LogbookPenelitianRepository logbookPenelitianRepository;
    private final NotifikasiRepository notifikasiRepository;

    private final Pbkdf2PasswordEncoder passwordEncoder = Pbkdf2PasswordEncoder.defaultsForSpringSecurity_v5_8();

    public DataSeeder(UserRepository userRepository,
                      ProgramHibahRepository programHibahRepository,
                      ProposalRepository proposalRepository,
                      ReviewProposalRepository reviewProposalRepository,
                      PencairanDanaRepository pencairanDanaRepository,
                      LogbookPenelitianRepository logbookPenelitianRepository,
                      NotifikasiRepository notifikasiRepository) {
        this.userRepository = userRepository;
        this.programHibahRepository = programHibahRepository;
        this.proposalRepository = proposalRepository;
        this.reviewProposalRepository = reviewProposalRepository;
        this.pencairanDanaRepository = pencairanDanaRepository;
        this.logbookPenelitianRepository = logbookPenelitianRepository;
        this.notifikasiRepository = notifikasiRepository;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already contains data. Skipping seed.");
            return;
        }

        log.info("Seeding dummy development data...");

        // ========================
        // USERS
        // ========================
        User admin = User.builder()
                .name("Admin SiPelKa")
                .email("admin@sipelka.ac.id")
                .nip("199001012010011001")
                .password(passwordEncoder.encode("admin123"))
                .role(UserRole.ADMIN)
                .isActivated(true)
                .build();
        userRepository.save(admin);

        User researcher1 = User.builder()
                .name("Dr. Budi Santoso")
                .email("researcher1@sipelka.ac.id")
                .nip("199102022011022002")
                .password(passwordEncoder.encode("researcher123"))
                .role(UserRole.RESEARCHER)
                .isActivated(true)
                .build();

        User researcher2 = User.builder()
                .name("Dr. Siti Rahmawati")
                .email("researcher2@sipelka.ac.id")
                .nip("199203032012033003")
                .password(passwordEncoder.encode("researcher123"))
                .role(UserRole.RESEARCHER)
                .isActivated(true)
                .build();
        userRepository.save(researcher1);
        userRepository.save(researcher2);

        User reviewer1 = User.builder()
                .name("Prof. Ahmad Fauzi")
                .email("reviewer1@sipelka.ac.id")
                .nip("199304042013044004")
                .password(passwordEncoder.encode("reviewer123"))
                .role(UserRole.REVIEWER)
                .isActivated(true)
                .build();

        User reviewer2 = User.builder()
                .name("Prof. Dewi Lestari")
                .email("reviewer2@sipelka.ac.id")
                .nip("199405052014055005")
                .password(passwordEncoder.encode("reviewer123"))
                .role(UserRole.REVIEWER)
                .isActivated(true)
                .build();
        userRepository.save(reviewer1);
        userRepository.save(reviewer2);

        // ========================
        // PROGRAM HIBAH
        // ========================
        ProgramHibah hibah1 = ProgramHibah.builder()
                .admin(admin)
                .namaProgram("Hibah Riset Dasar 2026")
                .deskripsi("Program hibah untuk penelitian dasar di bidang sains dan teknologi yang bertujuan mengembangkan ilmu pengetahuan fundamental.")
                .bidangFokus("Sains dan Teknologi")
                .tanggalBuka(LocalDateTime.now().minusDays(30))
                .tanggalTutup(LocalDateTime.now().plusDays(60))
                .totalDanaMaksimal(new BigDecimal("50000000"))
                .build();

        ProgramHibah hibah2 = ProgramHibah.builder()
                .admin(admin)
                .namaProgram("Hibah Pengabdian Masyarakat 2026")
                .deskripsi("Program hibah untuk kegiatan pengabdian kepada masyarakat yang berdampak langsung pada kesejahteraan sosial.")
                .bidangFokus("Sosial Humaniora")
                .tanggalBuka(LocalDateTime.now().minusDays(20))
                .tanggalTutup(LocalDateTime.now().plusDays(45))
                .totalDanaMaksimal(new BigDecimal("30000000"))
                .build();

        ProgramHibah hibah3 = ProgramHibah.builder()
                .admin(admin)
                .namaProgram("Hibah Inovasi Pendidikan 2026")
                .deskripsi("Program hibah untuk inovasi metode dan media pembelajaran guna meningkatkan kualitas pendidikan di Indonesia.")
                .bidangFokus("Pendidikan")
                .tanggalBuka(LocalDateTime.now().minusDays(15))
                .tanggalTutup(LocalDateTime.now().plusDays(50))
                .totalDanaMaksimal(new BigDecimal("40000000"))
                .build();

        ProgramHibah hibah4 = ProgramHibah.builder()
                .admin(admin)
                .namaProgram("Hibah Ketahanan Pangan 2026")
                .deskripsi("Program hibah untuk penelitian dan pengabdian yang mendukung ketahanan pangan nasional melalui teknologi pertanian.")
                .bidangFokus("Pertanian")
                .tanggalBuka(LocalDateTime.now().minusDays(25))
                .tanggalTutup(LocalDateTime.now().plusDays(35))
                .totalDanaMaksimal(new BigDecimal("35000000"))
                .build();
        programHibahRepository.save(hibah1);
        programHibahRepository.save(hibah2);
        programHibahRepository.save(hibah3);
        programHibahRepository.save(hibah4);

        // ========================
        // PROPOSALS
        // ========================
        Proposal proposal1 = Proposal.builder()
                .peneliti(researcher1)
                .hibah(hibah1)
                .judulPenelitian("Implementasi Machine Learning untuk Deteksi Dini Penyakit Tropis")
                .bidangPenelitian("Sains dan Teknologi")
                .ringkasan("Penelitian ini bertujuan mengembangkan model machine learning yang mampu mendeteksi dini penyakit tropis menggunakan data citra medis dan gejala klinis.")
                .dokumenUrl("/uploads/proposals/ml-tropis.pdf")
                .statusProposal(StatusProposal.APPROVED)
                .skorRuleBased(100)
                .build();

        Proposal proposal2 = Proposal.builder()
                .peneliti(researcher1)
                .hibah(hibah2)
                .judulPenelitian("Pemberdayaan Ekonomi Perempuan Melalui Digitalisasi UMKM di Desa")
                .bidangPenelitian("Sosial Humaniora")
                .ringkasan("Program pemberdayaan ekonomi perempuan pedesaan melalui pelatihan digitalisasi UMKM dan pendampingan bisnis berkelanjutan.")
                .dokumenUrl("/uploads/proposals/ekonomi-perempuan.pdf")
                .statusProposal(StatusProposal.UNDER_REVIEW)
                .skorRuleBased(85)
                .build();

        Proposal proposal3 = Proposal.builder()
                .peneliti(researcher2)
                .hibah(hibah1)
                .judulPenelitian("Pengembangan Material Nano untuk Penyimpanan Energi Ramah Lingkungan")
                .bidangPenelitian("Sains dan Teknologi")
                .ringkasan("Penelitian ini fokus pada pengembangan material nano berbasis karbon untuk aplikasi penyimpanan energi yang lebih efisien dan ramah lingkungan.")
                .dokumenUrl("/uploads/proposals/material-nano.pdf")
                .statusProposal(StatusProposal.DRAFT)
                .skorRuleBased(null)
                .build();

        Proposal proposal4 = Proposal.builder()
                .peneliti(researcher2)
                .hibah(hibah3)
                .judulPenelitian("Gamifikasi Pembelajaran Matematika Berbasis Augmented Reality untuk Sekolah Dasar")
                .bidangPenelitian("Pendidikan")
                .ringkasan("Mengembangkan platform pembelajaran matematika interaktif berbasis augmented reality dan gamifikasi untuk meningkatkan minat belajar siswa SD.")
                .dokumenUrl("/uploads/proposals/gamifikasi-matematika.pdf")
                .statusProposal(StatusProposal.SUBMITTED)
                .skorRuleBased(70)
                .build();

        Proposal proposal5 = Proposal.builder()
                .peneliti(researcher1)
                .hibah(hibah4)
                .judulPenelitian("Sistem Smart Farming Berbasis IoT untuk Optimalisasi Produksi Padi")
                .bidangPenelitian("Pertanian")
                .ringkasan("Mengembangkan sistem pertanian cerdas menggunakan sensor IoT, drone, dan analitik data untuk mengoptimalkan produksi padi dan efisiensi sumber daya.")
                .dokumenUrl("/uploads/proposals/smart-farming.pdf")
                .statusProposal(StatusProposal.UNDER_REVIEW)
                .skorRuleBased(80)
                .build();

        Proposal proposal6 = Proposal.builder()
                .peneliti(researcher2)
                .hibah(hibah2)
                .judulPenelitian("Pemberdayaan Petani Milenial Melalui Teknologi Pertanian Presisi")
                .bidangPenelitian("Sosial Humaniora")
                .ringkasan("Program pemberdayaan petani muda dengan pelatihan teknologi pertanian presisi, akses pasar digital, dan pendampingan agribisnis berkelanjutan.")
                .dokumenUrl("/uploads/proposals/petani-milenial.pdf")
                .statusProposal(StatusProposal.APPROVED)
                .skorRuleBased(100)
                .build();

        Proposal proposal7 = Proposal.builder()
                .peneliti(researcher1)
                .hibah(hibah3)
                .judulPenelitian("Pengembangan Platform AI untuk Personalisasi Pembelajaran Bahasa Inggris")
                .bidangPenelitian("Pendidikan")
                .ringkasan("Membangun platform pembelajaran bahasa Inggris adaptif berbasis kecerdasan buatan yang menyesuaikan materi dengan kemampuan individu peserta didik.")
                .dokumenUrl("/uploads/proposals/ai-pembelajaran.pdf")
                .statusProposal(StatusProposal.REJECTED)
                .skorRuleBased(65)
                .build();

        Proposal proposal8 = Proposal.builder()
                .peneliti(researcher2)
                .hibah(hibah4)
                .judulPenelitian("Sistem Irigasi Cerdas Bertenaga Surya untuk Lahan Pertanian Lahan Kering")
                .bidangPenelitian("Pertanian")
                .ringkasan("Merancang sistem irigasi otomatis bertenaga surya yang dikendalikan melalui aplikasi mobile untuk meningkatkan produktivitas lahan pertanian lahan kering.")
                .dokumenUrl("/uploads/proposals/irigasi-cerdas.pdf")
                .statusProposal(StatusProposal.SUBMITTED)
                .skorRuleBased(72)
                .build();
        proposalRepository.save(proposal1);
        proposalRepository.save(proposal2);
        proposalRepository.save(proposal3);
        proposalRepository.save(proposal4);
        proposalRepository.save(proposal5);
        proposalRepository.save(proposal6);
        proposalRepository.save(proposal7);
        proposalRepository.save(proposal8);

        // ========================
        // REVIEWS
        // ========================
        ReviewProposal review1 = ReviewProposal.builder()
                .proposal(proposal1)
                .reviewer(reviewer1)
                .skorPenilaian(85)
                .catatanRevisi("Proposal sangat baik. Metodologi jelas dan terstruktur dengan baik. Disarankan untuk menambah detail jadwal penelitian dan rencana mitigasi risiko.")
                .statusRekomendasi(StatusRekomendasi.LAYAK)
                .tanggalReview(LocalDateTime.now().minusDays(5))
                .build();

        ReviewProposal review2 = ReviewProposal.builder()
                .proposal(proposal2)
                .reviewer(reviewer2)
                .skorPenilaian(65)
                .catatanRevisi("Proposal perlu diperbaiki pada bagian metode evaluasi dampak. Tambahkan indikator keberhasilan yang lebih terukur dan rencana keberlanjutan program.")
                .statusRekomendasi(StatusRekomendasi.REVISI)
                .tanggalReview(LocalDateTime.now().minusDays(3))
                .build();

        ReviewProposal review3 = ReviewProposal.builder()
                .proposal(proposal4)
                .reviewer(reviewer2)
                .skorPenilaian(62)
                .catatanRevisi("Konsep gamifikasi menarik, namun perlu detail lebih pada aspek teknis implementasi AR. Sertakan storyboard dan wireframe aplikasi.")
                .statusRekomendasi(StatusRekomendasi.REVISI)
                .tanggalReview(LocalDateTime.now().minusDays(2))
                .build();

        ReviewProposal review4 = ReviewProposal.builder()
                .proposal(proposal5)
                .reviewer(reviewer2)
                .skorPenilaian(78)
                .catatanRevisi("Proposal komprehensif dengan pendekatan interdisipliner yang baik. Tambahkan analisis biaya-manfaat dan studi kelayakan teknis di lokasi sasaran.")
                .statusRekomendasi(StatusRekomendasi.LAYAK)
                .tanggalReview(LocalDateTime.now().minusDays(1))
                .build();

        ReviewProposal review5 = ReviewProposal.builder()
                .proposal(proposal6)
                .reviewer(reviewer1)
                .skorPenilaian(88)
                .catatanRevisi("Proposal sangat baik dan aplikatif. Target sasaran jelas dan metode pendampingan terstruktur. Rekomendasi untuk didanai penuh.")
                .statusRekomendasi(StatusRekomendasi.LAYAK)
                .tanggalReview(LocalDateTime.now().minusDays(4))
                .build();

        ReviewProposal review6 = ReviewProposal.builder()
                .proposal(proposal7)
                .reviewer(reviewer1)
                .skorPenilaian(40)
                .catatanRevisi("Proposal kurang sesuai dengan bidang fokus program hibah. Pendekatan teknis kurang matang dan kajian pustaka tidak memadai.")
                .statusRekomendasi(StatusRekomendasi.TIDAK_LAYAK)
                .tanggalReview(LocalDateTime.now().minusDays(6))
                .build();

        ReviewProposal review7 = ReviewProposal.builder()
                .proposal(proposal8)
                .reviewer(reviewer1)
                .skorPenilaian(72)
                .catatanRevisi("Ide inovatif dan relevan. Perlu dilengkapi dengan spesifikasi teknis panel surya dan sistem irigasi, serta analisis dampak lingkungan.")
                .statusRekomendasi(StatusRekomendasi.REVISI)
                .tanggalReview(LocalDateTime.now().minusDays(1))
                .build();
        reviewProposalRepository.save(review1);
        reviewProposalRepository.save(review2);
        reviewProposalRepository.save(review3);
        reviewProposalRepository.save(review4);
        reviewProposalRepository.save(review5);
        reviewProposalRepository.save(review6);
        reviewProposalRepository.save(review7);

        // ========================
        // PENCAIRAN DANA
        // ========================
        PencairanDana pencairan1 = PencairanDana.builder()
                .proposal(proposal1)
                .admin(admin)
                .tahapPencairan(1)
                .jumlahDana(new BigDecimal("25000000"))
                .statusPencairan(StatusPencairan.CAIR)
                .tanggalPencairan(LocalDateTime.now().minusDays(2))
                .buktiTransferUrl("/uploads/bukti/transfer-tahap1-proposal1.pdf")
                .build();

        PencairanDana pencairan2 = PencairanDana.builder()
                .proposal(proposal1)
                .admin(admin)
                .tahapPencairan(2)
                .jumlahDana(new BigDecimal("25000000"))
                .statusPencairan(StatusPencairan.PROSES)
                .tanggalPencairan(LocalDateTime.now())
                .build();

        PencairanDana pencairan3 = PencairanDana.builder()
                .proposal(proposal6)
                .admin(admin)
                .tahapPencairan(1)
                .jumlahDana(new BigDecimal("15000000"))
                .statusPencairan(StatusPencairan.CAIR)
                .tanggalPencairan(LocalDateTime.now().minusDays(1))
                .buktiTransferUrl("/uploads/bukti/transfer-tahap1-proposal6.pdf")
                .build();

        PencairanDana pencairan4 = PencairanDana.builder()
                .proposal(proposal6)
                .admin(admin)
                .tahapPencairan(2)
                .jumlahDana(new BigDecimal("15000000"))
                .statusPencairan(StatusPencairan.PENDING)
                .build();
        pencairanDanaRepository.save(pencairan1);
        pencairanDanaRepository.save(pencairan2);
        pencairanDanaRepository.save(pencairan3);
        pencairanDanaRepository.save(pencairan4);

        // ========================
        // LOGBOOK PENELITIAN
        // ========================
        LogbookPenelitian logbook1 = LogbookPenelitian.builder()
                .proposal(proposal1)
                .tanggalKegiatan(LocalDate.now().minusDays(14))
                .deskripsiProgress("Melakukan studi literatur dan review jurnal terkait machine learning untuk deteksi penyakit tropis. Terkumpul 25 referensi relevan.")
                .kendala("Akses ke beberapa jurnal internasional terbatas.")
                .build();

        LogbookPenelitian logbook2 = LogbookPenelitian.builder()
                .proposal(proposal1)
                .tanggalKegiatan(LocalDate.now().minusDays(7))
                .deskripsiProgress("Melakukan pengumpulan data primer dari 3 rumah sakit di Jakarta. Data citra medis berhasil dikumpulkan sebanyak 500 sampel.")
                .kendala("Beberapa rumah sakit mengalami keterlambatan dalam proses izin data.")
                .build();

        LogbookPenelitian logbook3 = LogbookPenelitian.builder()
                .proposal(proposal1)
                .tanggalKegiatan(LocalDate.now().minusDays(1))
                .deskripsiProgress("Memulai preprocessing data citra. Normalisasi dan augmentasi data berjalan sesuai rencana. 400 sampel siap untuk training.")
                .kendala(null)
                .build();

        LogbookPenelitian logbook4 = LogbookPenelitian.builder()
                .proposal(proposal6)
                .tanggalKegiatan(LocalDate.now().minusDays(10))
                .deskripsiProgress("Melakukan survei lokasi dan identifikasi petani milenial calon peserta program. Terdata 50 petani dari 3 desa di Kabupaten Malang.")
                .kendala("Jarak antar desa cukup jauh, membutuhkan waktu perjalanan tambahan.")
                .build();

        LogbookPenelitian logbook5 = LogbookPenelitian.builder()
                .proposal(proposal6)
                .tanggalKegiatan(LocalDate.now().minusDays(5))
                .deskripsiProgress("Melaksanakan pelatihan tahap 1: Pengenalan teknologi pertanian presisi dan penggunaan sensor tanah. Dihadiri 45 petani.")
                .kendala(null)
                .build();

        LogbookPenelitian logbook6 = LogbookPenelitian.builder()
                .proposal(proposal6)
                .tanggalKegiatan(LocalDate.now().minusDays(2))
                .deskripsiProgress("Evaluasi pelatihan tahap 1 dan pendampingan langsung di lapangan. Petani mulai mengimplementasikan penggunaan sensor di lahan masing-masing.")
                .kendala("Beberapa petani masih kesulitan mengoperasikan aplikasi monitoring.")
                .build();

        LogbookPenelitian logbook7 = LogbookPenelitian.builder()
                .proposal(proposal5)
                .tanggalKegiatan(LocalDate.now().minusDays(3))
                .deskripsiProgress("Instalasi sensor IoT di 2 lokasi sawah percontohan di Subang. Sensor suhu, kelembaban, dan pH tanah terpasang dan berfungsi dengan baik.")
                .kendala("Cuaca hujan menghambat proses instalasi.")
                .build();

        LogbookPenelitian logbook8 = LogbookPenelitian.builder()
                .proposal(proposal5)
                .tanggalKegiatan(LocalDate.now().minusDays(1))
                .deskripsiProgress("Uji coba sistem pemantauan jarak jauh. Data dari sensor berhasil dikirim ke platform cloud dan dapat diakses melalui dashboard web.")
                .kendala(null)
                .build();
        logbookPenelitianRepository.save(logbook1);
        logbookPenelitianRepository.save(logbook2);
        logbookPenelitianRepository.save(logbook3);
        logbookPenelitianRepository.save(logbook4);
        logbookPenelitianRepository.save(logbook5);
        logbookPenelitianRepository.save(logbook6);
        logbookPenelitianRepository.save(logbook7);
        logbookPenelitianRepository.save(logbook8);

        // ========================
        // NOTIFIKASI
        // ========================
        Notifikasi notif1 = Notifikasi.builder()
                .user(admin)
                .judulNotifikasi("Proposal Baru Masuk")
                .pesan("Proposal 'Implementasi Machine Learning untuk Deteksi Dini Penyakit Tropis' dari Dr. Budi Santoso telah diajukan dan siap ditinjau.")
                .isRead(true)
                .tipeNotifikasi(TipeNotifikasi.STATUS_UPDATE)
                .build();

        Notifikasi notif2 = Notifikasi.builder()
                .user(researcher1)
                .judulNotifikasi("Proposal Disetujui")
                .pesan("Selamat! Proposal Anda 'Implementasi Machine Learning untuk Deteksi Dini Penyakit Tropis' telah disetujui dan siap untuk pencairan dana tahap 1.")
                .isRead(false)
                .tipeNotifikasi(TipeNotifikasi.STATUS_UPDATE)
                .build();

        Notifikasi notif3 = Notifikasi.builder()
                .user(reviewer1)
                .judulNotifikasi("Tugas Review Baru")
                .pesan("Anda ditugaskan untuk mereview proposal 'Implementasi Machine Learning untuk Deteksi Dini Penyakit Tropis'. Batas review: 14 hari.")
                .isRead(true)
                .tipeNotifikasi(TipeNotifikasi.SYSTEM)
                .build();

        Notifikasi notif4 = Notifikasi.builder()
                .user(admin)
                .judulNotifikasi("Pengingat Deadline")
                .pesan("Program Hibah Riset Dasar 2026 akan tutup dalam 7 hari. Pastikan semua proposal sudah direview.")
                .isRead(false)
                .tipeNotifikasi(TipeNotifikasi.DEADLINE)
                .build();

        Notifikasi notif5 = Notifikasi.builder()
                .user(admin)
                .judulNotifikasi("Proposal Baru Masuk")
                .pesan("Proposal 'Sistem Smart Farming Berbasis IoT untuk Optimalisasi Produksi Padi' dari Dr. Budi Santoso telah diajukan dan siap ditinjau.")
                .isRead(false)
                .tipeNotifikasi(TipeNotifikasi.STATUS_UPDATE)
                .build();

        Notifikasi notif6 = Notifikasi.builder()
                .user(researcher2)
                .judulNotifikasi("Proposal Disetujui")
                .pesan("Selamat! Proposal Anda 'Pemberdayaan Petani Milenial Melalui Teknologi Pertanian Presisi' telah disetujui. Dana tahap 1 sebesar Rp15.000.000 siap dicairkan.")
                .isRead(false)
                .tipeNotifikasi(TipeNotifikasi.STATUS_UPDATE)
                .build();

        Notifikasi notif7 = Notifikasi.builder()
                .user(researcher1)
                .judulNotifikasi("Proposal Ditolak")
                .pesan("Mohon maaf, proposal 'Pengembangan Platform AI untuk Personalisasi Pembelajaran Bahasa Inggris' tidak memenuhi kriteria bidang fokus program hibah.")
                .isRead(false)
                .tipeNotifikasi(TipeNotifikasi.STATUS_UPDATE)
                .build();

        Notifikasi notif8 = Notifikasi.builder()
                .user(reviewer2)
                .judulNotifikasi("Tugas Review Baru")
                .pesan("Anda ditugaskan untuk mereview proposal 'Sistem Smart Farming Berbasis IoT untuk Optimalisasi Produksi Padi'. Batas review: 14 hari.")
                .isRead(false)
                .tipeNotifikasi(TipeNotifikasi.SYSTEM)
                .build();
        notifikasiRepository.save(notif1);
        notifikasiRepository.save(notif2);
        notifikasiRepository.save(notif3);
        notifikasiRepository.save(notif4);
        notifikasiRepository.save(notif5);
        notifikasiRepository.save(notif6);
        notifikasiRepository.save(notif7);
        notifikasiRepository.save(notif8);

        log.info("Dummy data seeding completed successfully!");
    }
}
