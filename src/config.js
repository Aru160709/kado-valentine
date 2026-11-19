// =====================================================
//  UBAH ISI WEB DI FILE INI SAJA
// =====================================================
export const config = {
  pasangan: 'Sayang',              // panggilan pasangan (dipakai di sapaan)
  pengirim: 'Aku',                 // nama kamu (tanda tangan surat)

  // ---- PASSWORD: nama + tanggal jadian ----
  namaBenar: ['sayang', 'sayangkuuu'], // nama yang diterima (huruf besar/kecil bebas)
  tanggalJadian: '2026-01-26',       // format TAHUN-BULAN-TANGGAL
  petunjuk: 'Tanggalnya hari yang paling kita ingat. Coba ingat-ingat lagi ya.',

  // ---- FOTO (taruh file di public/photos) ----
  photos: [
    { src: 'photos/album/foto_1.jpg', caption: 'Pertama kali kita foto bareng', date: '27 November 2025', story: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vitae sem ac lorem facilisis.' },
    { src: 'photos/album/foto_2.jpg', caption: 'Hari yang selalu aku ingat', date: '03 Desember 2025', story: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vitae sem ac lorem facilisis.' },
    { src: 'photos/album/foto_1.jpg', caption: 'Senyum kamu favoritku', date: '12 Desember 2025', story: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vitae sem ac lorem facilisis.' },
    { src: 'photos/album/foto_2.jpg', caption: 'Jalan-jalan sama kamu', date: '25 Desember 2025', story: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vitae sem ac lorem facilisis.' },
    { src: 'photos/album/foto_1.jpg', caption: 'Makan bareng, ketawa bareng', date: '01 Januari 2026', story: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vitae sem ac lorem facilisis.' },
    { src: 'photos/album/foto_2.jpg', caption: 'Kamu rumahku', date: '26 Januari 2026', story: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vitae sem ac lorem facilisis.' },
    { src: 'photos/album/foto_1.jpg', caption: 'Selalu ada kamu', date: '07 Februari 2026', story: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vitae sem ac lorem facilisis.' },
    { src: 'photos/album/foto_2.jpg', caption: 'Aku sayang kamu', date: '14 Februari 2026', story: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vitae sem ac lorem facilisis.' }
  ],

  // ---- VIDEO (taruh file di public/videos, format .mp4) ----
  videos: [
    { src: 'videos/vid_1.mp4', title: 'Video pertama kita', desc: 'Kenangan yang bikin senyum.' },
    { src: 'videos/vid_1.mp4', title: 'Kita berdua', desc: 'Hari-hari yang paling seru.' },
    { src: 'videos/vid_1.mp4', title: 'Pesan spesial', desc: 'Khusus buat kamu.' }
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

  // ---- BACKSONG: tambahkan satu objek untuk tiap file lagu di folder public/ ----
  playlist: [
    { src: 'music/bergema-selamanya.mp3', title: 'Bergema Sampai Selamanya', artist: 'Nadhif Basalamah', cover: 'music/covers/bergema.jpg' }
  ],

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
