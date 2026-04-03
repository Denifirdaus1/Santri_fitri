-- Buat database
CREATE DATABASE IF NOT EXISTS pesantren;
USE pesantren;

-- Tabel santri
CREATE TABLE santri (
    id_santri INT AUTO_INCREMENT PRIMARY KEY,
    nis VARCHAR(20) UNIQUE NOT NULL,
    nama_santri VARCHAR(100) NOT NULL,
    jenis_kelamin ENUM('L', 'P') NOT NULL,
    kelas VARCHAR(20) NOT NULL,
    status ENUM('aktif', 'nonaktif') DEFAULT 'aktif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel admin
CREATE TABLE admin (
    id_admin INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nama_admin VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel akun_santri (untuk login)
CREATE TABLE akun_santri (
    id_akun INT AUTO_INCREMENT PRIMARY KEY,
    id_santri INT NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_santri) REFERENCES santri(id_santri) ON DELETE CASCADE
);

-- Tabel izin
CREATE TABLE izin (
    id_izin INT AUTO_INCREMENT PRIMARY KEY,
    id_santri INT NOT NULL,
    jenis_izin ENUM('sakit', 'acara_keluarga', 'pulang', 'lainnya') NOT NULL,
    tanggal_keluar DATETIME NOT NULL,
    batas_waktu DATETIME,
    tanggal_kembali DATETIME,
    alasan TEXT,
    status ENUM('menunggu', 'disetujui', 'ditolak') DEFAULT 'menunggu',
    status_kembali ENUM('tepat_waktu', 'terlambat') NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_santri) REFERENCES santri(id_santri) ON DELETE CASCADE
);

-- Insert data dummy admin
INSERT INTO admin (username, password, nama_admin) VALUES 
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin Utama');
-- password: password

-- Insert data dummy santri
INSERT INTO santri (nis, nama_santri, jenis_kelamin, kelas) VALUES
('12345667', 'Fadlia Nur Azizah', 'P', 'Ula'),
('12345668', 'Deden Ramdhan', 'L', 'Ulya'),
('12345669', 'Naila Sahru N', 'P', 'Wustho');

-- Insert akun santri dummy
INSERT INTO akun_santri (id_santri, username, password) VALUES
(1, '12345667', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
(2, '12345668', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
(3, '12345669', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Insert dummy izin
INSERT INTO izin (id_santri, jenis_izin, tanggal_keluar, alasan, status) VALUES
(1, 'sakit', '2026-02-27 08:00:00', 'Demam', 'disetujui'),
(2, 'acara_keluarga', '2026-02-28 09:00:00', 'Pernikahan kakak', 'menunggu'),
(3, 'lainnya', '2026-02-26 10:00:00', 'Beli buku', 'ditolak');