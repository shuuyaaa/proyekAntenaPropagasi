import type { FC } from 'react';
import { X, BookOpen, Target, HelpCircle } from 'lucide-react';

interface TheoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TheoryModal: FC<TheoryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <BookOpen className="text-cyan-400" size={20} />
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                Landasan Teori, Desain &amp; Panduan Tugas Kelompok VI
              </h2>
              <span className="text-2xs text-cyan-400">
                Mata Kuliah EL234504 Antena &amp; Propagasi Radio &bull; Teknik Elektro FTEIC ITS
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="modal-body space-y-5 text-sm text-slate-300 leading-relaxed">
          {/* Section Khusus Tugas Kelompok VI */}
          <div className="theory-block bg-gradient-to-r from-cyan-950/40 to-blue-950/40 border border-cyan-500/40">
            <div className="flex items-center gap-2 mb-2 text-cyan-300 font-bold text-xs uppercase tracking-wider">
              <Target size={16} />
              <span>Spesifikasi Tugas Kelompok VI — Kanal 44 UHF (658 MHz)</span>
            </div>
            <ul className="text-xs space-y-1.5 text-slate-200">
              <li>&bull; <strong>Nomor Kanal Target</strong>: Kanal UHF 44 (Frekuensi tengah: <strong>658 MHz</strong>, Rentang: 654 &ndash; 662 MHz, Bandwidth: 8 MHz).</li>
              <li>&bull; <strong>Grup Siaran TV</strong>: <em>Trans TV HD, Trans7 HD, CNN Indonesia HD, CNBC Indonesia HD</em> (MUX TransMedia).</li>
              <li>&bull; <strong>Jenis Antena</strong>: Spiral Dua Lengan (Archimedean / Equiangular Spiral).</li>
              <li>&bull; <strong>Material Fisik</strong>: Aluminium/Copper Foil Tape di atas papan akrilik/PVC, saluran koaksial 75 &Omega; (RG-6), konektor IEC Male ke TV.</li>
            </ul>
          </div>

          {/* Section Jawaban Pertanyaan Laporan Proyek */}
          <div className="theory-block bg-amber-950/20 border border-amber-600/40">
            <div className="flex items-center gap-2 mb-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
              <HelpCircle size={16} />
              <span>Jawaban Pertanyaan Laporan Tugas Kelompok VI</span>
            </div>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div>
                <p className="font-semibold text-white mb-0.5">
                  1. Apakah antena spiral (Equiangular / Archimedean) termasuk antena balance atau un-balance?
                </p>
                <p className="text-slate-300 leading-relaxed pl-3 border-l-2 border-cyan-400">
                  Antena spiral dua lengan adalah <strong>ANTENA BALANCE (SEIMBANG)</strong>. Kedua lengannya memiliki geometri yang simetris sempurna dan dicatu dengan arus listrik yang sama besar tetapi berbeda fasa 180&deg; pada titik pusatnya.
                </p>
              </div>
              <div>
                <p className="font-semibold text-white mb-0.5">
                  2. Saluran transmisi apa yang cocok untuk antena balance dan untuk antena un-balance?
                </p>
                <div className="pl-3 border-l-2 border-cyan-400 space-y-1">
                  <p>
                    &bull; Untuk antena <strong>balance</strong>: Saluran transmisi <strong>balance</strong> (seperti saluran kawat kembar / <em>twin-lead ribbon cable</em> 300 &Omega;).
                  </p>
                  <p>
                    &bull; Untuk antena <strong>un-balance</strong>: Saluran transmisi <strong>un-balance</strong> (seperti kabel koaksial / <em>coaxial cable</em> 75 &Omega; atau 50 &Omega;).
                  </p>
                  <p>
                    &bull; <strong>Solusi Penerapan Real Case Kelompok 6</strong>: Karena tuner TV digital menggunakan kabel koaksial 75 &Omega; (un-balance), maka menghubungkan antena spiral (balance) ke kabel koaksial <strong>wajib menggunakan BALUN (Balanced-to-Unbalanced Transformer)</strong> seperti <em>Sleeve Bazooka Balun &lambda;/4</em> atau <em>Coaxial Loop Balun &lambda;/2 4:1</em> (mengacu pada Gambar 20.18 ARRL Handbook 2019). Tanpa balun, arus permukaan (unbalanced shield current) akan mengalir pada bagian luar kabel koaksial, merusak pola radiasi dan menimbulkan interferensi sinyal.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 1: Konsep & Persamaan Matematis */}
          <div className="theory-block">
            <h3 className="theory-title">1. Persamaan Geometris Spiral Archimedes &amp; Equiangular</h3>
            <p>
              Antena spiral beroperasi sebagai antena independen frekuensi (frequency-independent)
              dengan polarisasi sirkular (Circular Polarization). Persamaan dasarnya:
            </p>
            <div className="formula-box">
              <span className="formula-text">Spiral Archimedes: r(&theta;) = r_in + b &middot; &theta;</span>
              <span className="formula-desc">dengan b = (w + s) / (2&pi;)</span>
            </div>
            <div className="formula-box">
              <span className="formula-text">Equiangular Spiral: r(&theta;) = r_in &middot; e^(a &middot; &theta;)</span>
              <span className="formula-desc">dengan laju ekspansi sudut konstan a</span>
            </div>
          </div>

          {/* Section 2: Resonansi Wilayah Aktif untuk Kanal 44 (658 MHz) */}
          <div className="theory-block">
            <h3 className="theory-title">2. Dimensi Wilayah Aktif Radiasi (Kanal 44 — 658 MHz)</h3>
            <p>
              Radiasi gelombang elektromagnetik dominan terjadi pada satu keliling lilitan spiral yang setara dengan satu panjang gelombang (&lambda;):
            </p>
            <div className="formula-box">
              <span className="formula-text">&lambda; = c / f = 29979.2 / 658 &approx; 45.56 cm</span>
              <span className="formula-desc">
                Cincin Radiasi Aktif: C = 2&pi; &middot; r_active &approx; &lambda; &rArr; r_active = 45.56 / (2&pi;) &approx; 7.25 cm
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-2">
              Agar antena dapat menerima siaran Trans TV / Trans7 (Kanal 44) secara jernih, jari-jari terluar antena (<strong>r_out</strong>) harus lebih besar dari <strong>7.25 cm</strong> (Diameter lilitan &ge; 14.5 cm). Oleh karena itu, papan board akrilik berukuran <strong>22.0 &times; 22.0 cm</strong> sangat ideal untuk pembuatan nyata.
            </p>
          </div>

          {/* Section 3: Langkah Pembuatan Fisik (Real Case) */}
          <div className="theory-block">
            <h3 className="theory-title">3. Panduan Pembuatan Fisik Antena (Bill of Materials &amp; Langkah)</h3>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-700/60">
                <span className="text-cyan-400 font-semibold block mb-1">Alat &amp; Bahan (BOM):</span>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-300">
                  <li>Papan Substrat: Papan Akrilik bening / PVC Board / FR4 tebal 0.2 cm (ukuran 22.0 &times; 22.0 cm).</li>
                  <li>Konduktor: Aluminium Foil Tape berperekat (lebar pita w = 1.0 cm) atau tembaga foil.</li>
                  <li>Saluran Transmisi: Kabel Koaksial 75 &Omega; RG-6 (panjang 150 s.d. 300 cm).</li>
                  <li>Konektor TV: Konektor PAL / IEC 169-2 Male (Belling-Lee RF plug) ke port antena TV.</li>
                  <li>Balun: Pipa tembaga sleeve &lambda;/4 (&approx; 11.4 cm) atau loop koaksial &lambda;/2 (&approx; 22.8 cm).</li>
                  <li>Solder, timah, cutter presisi, penggaris logam, dan template mal cetak skala 1:1.</li>
                </ul>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-700/60">
                <span className="text-emerald-400 font-semibold block mb-1">Langkah Pembuatan:</span>
                <ol className="list-decimal pl-4 space-y-1 text-slate-300">
                  <li>Cetak pola mal spiral skala 1:1 pada kertas menggunakan tombol <em>Mal Cetak 1:1</em>.</li>
                  <li>Tempelkan kertas pola di bawah akrilik bening sebagai panduan penempelan pita foil.</li>
                  <li>Pasang aluminium foil tape mengikuti jalur Lengan 1 dan Lengan 2 (rotasi 180&deg;) dengan lebar celah s = w = 1.0 cm.</li>
                  <li>Buat 2 lubang via titik umpan di pusat antena berjarak 0.2 s.d. 0.3 cm.</li>
                  <li>Solder kawat inti kabel koaksial ke pangkal Lengan 1 dan kawat ground shield ke Lengan 2.</li>
                  <li>Pasang balun sleeve &lambda;/4 atau balun loop 4:1 di belakang papan.</li>
                  <li>Pasang konektor IEC Male di ujung kabel, lalu colokkan ke port antena TV Digital DVB-T2 / Set Top Box.</li>
                  <li>Lakukan auto-scan / manual tuning pada Kanal 44 (658 MHz) dan amati kejernihan siaran Trans TV, Trans7, CNN Indonesia, dan CNBC Indonesia.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button
            type="button"
            onClick={onClose}
            className="btn-modal-close"
          >
            Tutup Panduan Teori
          </button>
        </div>
      </div>
    </div>
  );
};
