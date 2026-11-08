// =====================================================
//  UBAH ISI WEB DI FILE INI SAJA
// =====================================================
export const config = {
  pasangan: 'Sayang',              // panggilan pasangan (dipakai di sapaan)
  pengirim: 'Aku',                 // nama kamu (tanda tangan surat)

  // ---- PASSWORD: nama + tanggal jadian ----
  namaBenar: ['sayang', 'sayangku'], // nama yang diterima (huruf besar/kecil bebas)
  tanggalJadian: '2026-01-26',       // format TAHUN-BULAN-TANGGAL
  petunjuk: 'Tanggalnya hari yang paling kita ingat. Coba ingat-ingat lagi ya.',

  // ---- FOTO (taruh file di public/photos) ----
  photos: [
    { src: 'photos/foto1.svg', caption: 'Pertama kali kita foto bareng' },
    { src: 'photos/foto2.svg', caption: 'Hari yang selalu aku ingat' },
    { src: 'photos/foto3.svg', caption: 'Senyum kamu favoritku' },
    { src: 'photos/foto4.svg', caption: 'Jalan-jalan sama kamu' },
    { src: 'photos/foto5.svg', caption: 'Makan bareng, ketawa bareng' },
    { src: 'photos/foto6.svg', caption: 'Kamu rumahku' },
    { src: 'photos/foto7.svg', caption: 'Selalu ada kamu' },
    { src: 'photos/foto8.svg', caption: 'Aku sayang kamu' }
  ],

  // ---- VIDEO (taruh file di public/videos, format .mp4) ----
  videos: [
    { src: 'videos/video1.mp4', title: 'Video pertama kita', desc: 'Kenangan yang bikin senyum.' },
    { src: 'videos/video2.mp4', title: 'Kita berdua', desc: 'Hari-hari yang paling seru.' },
    { src: 'videos/video3.mp4', title: 'Pesan spesial', desc: 'Khusus buat kamu.' }
  ],

  tanggalSurat: '14 Februari 2026',   // tanggal yang tampil di surat
  ps: 'P.S. Surat ini boleh kamu baca berulang-ulang, kapan pun kamu rindu.',

  alasan: [
    'Kamu bikin hari-hari biasa terasa spesial.',
    'Tawamu adalah suara favoritku.',
    'Kamu sabar banget menghadapi aku.',
    'Bersamamu, aku merasa jadi versi terbaik diriku.',
    'Karena kamu adalah kamu.'
  ],

  surat: `Hai sayang,

Aku nggak pandai merangkai kata, jadi aku bikin kado kecil ini buat kamu.

Terima kasih sudah hadir, sudah bertahan, dan sudah jadi alasan aku tersenyum setiap hari. Apa pun yang terjadi nanti, aku mau terus jalan bareng kamu.

Selamat hari Valentine. Aku sayang kamu, hari ini dan seterusnya.`,

  // ---- LAGU (opsional): taruh di public/music.mp3, kosongkan '' kalau tidak pakai ----
  musik: 'music.mp3',
  lagu: { judul: 'Bergema Sampai Selamanya', artis: 'Nadhif Basalamah' }, // tulisan "sedang diputar"

  // ---- WHATSAPP (tombol di akhir) ----
  // nomor format internasional tanpa + dan tanpa 0 di depan, contoh 081234567890 jadi 6281234567890
  wa: {
    nomor: '6281234567890',
    pesan: 'Aku sudah buka semua kejutannya. Makasih ya sayang!'
  },

  // ---- GAME ----
  game: {
    target: 20,   // jumlah cinta yang harus ditangkap
    nyawa: 3,     // nyawa (kena hati retak = nyawa berkurang)
    lewatiSetelahKalah: 3, // tombol 'Lewati game' muncul setelah kalah sekian kali (0 = tidak ada)
    pesanMenang: 'Kamu berhasil menangkap semua cintaku!',
    hadiahJudul: 'Voucher 1x Pelukan Hangat',
    hadiahIsi: 'Berlaku selamanya. Boleh ditagih kapan saja, tanpa kedaluwarsa.'
  }
};
