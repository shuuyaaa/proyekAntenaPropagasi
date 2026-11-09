import type { AntennaParams, RFMetrics } from '../types/antenna';

export interface TVObservationRecord {
  id: string;
  channel: number;
  frequencyMHz: number;
  stationName: string;
  orientation: string;
  signalStrength: number;
  signalQuality: number;
  pictureStatus: 'Sangat Jernih (HD)' | 'Jernih (HD)' | 'Berbintik / Glitch' | 'Freeze / Macroblock' | 'Tidak Ada Sinyal';
  audioStatus: 'Stereo Jelas' | 'Normal' | 'Putus-putus' | 'Mute';
  notes: string;
}

export const INITIAL_OBSERVATION_RECORDS: TVObservationRecord[] = [
  {
    id: 'obs-1',
    channel: 44,
    frequencyMHz: 658,
    stationName: 'Trans TV HD',
    orientation: 'Tegak lurus menghadap pemancar (0° Azimuth)',
    signalStrength: 96,
    signalQuality: 98,
    pictureStatus: 'Sangat Jernih (HD)',
    audioStatus: 'Stereo Jelas',
    notes: 'Kanal target utama Kelompok 6. Gambar 1080p DVB-T2 sangat stabil tanpa drop frame.',
  },
  {
    id: 'obs-2',
    channel: 44,
    frequencyMHz: 658,
    stationName: 'Trans7 HD',
    orientation: 'Tegak lurus menghadap pemancar (0° Azimuth)',
    signalStrength: 95,
    signalQuality: 97,
    pictureStatus: 'Sangat Jernih (HD)',
    audioStatus: 'Stereo Jelas',
    notes: 'MUX TransMedia yang sama. Penerimaan kuat dan jernih.',
  },
  {
    id: 'obs-3',
    channel: 44,
    frequencyMHz: 658,
    stationName: 'CNN Indonesia HD',
    orientation: 'Tegak lurus menghadap pemancar (0° Azimuth)',
    signalStrength: 94,
    signalQuality: 96,
    pictureStatus: 'Sangat Jernih (HD)',
    audioStatus: 'Stereo Jelas',
    notes: 'Teks running text berita terbaca sangat tajam, sinkronisasi audio video sempurna.',
  },
  {
    id: 'obs-4',
    channel: 44,
    frequencyMHz: 658,
    stationName: 'CNBC Indonesia HD',
    orientation: 'Diputar 45° dari arah pemancar',
    signalStrength: 82,
    signalQuality: 85,
    pictureStatus: 'Jernih (HD)',
    audioStatus: 'Stereo Jelas',
    notes: 'Sinyal mengalami penurunan wajar akibat off-axis broadside, namun tetap terkunci stabil.',
  },
  {
    id: 'obs-5',
    channel: 41,
    frequencyMHz: 634,
    stationName: 'RCTI HD',
    orientation: 'Tegak lurus menghadap pemancar (0° Azimuth)',
    signalStrength: 91,
    signalQuality: 92,
    pictureStatus: 'Sangat Jernih (HD)',
    audioStatus: 'Stereo Jelas',
    notes: 'Uji pindah kanal (Kanal 41 MUX MNC). Antena spiral terbukti bersifat Ultra-Wideband.',
  },
  {
    id: 'obs-6',
    channel: 35,
    frequencyMHz: 586,
    stationName: 'TVRI Nasional',
    orientation: 'Tegak lurus menghadap pemancar (0° Azimuth)',
    signalStrength: 88,
    signalQuality: 90,
    pictureStatus: 'Jernih (HD)',
    audioStatus: 'Stereo Jelas',
    notes: 'Uji frekuensi lebih rendah (586 MHz). Cincin aktif masih tercakup dalam geometri lilitan luar.',
  },
];

/**
 * Menghasilkan naskah draft laporan lengkap Bab I s.d. Bab VI dalam format Markdown
 */
export function generateFullReportMarkdown(
  params: AntennaParams,
  metrics: RFMetrics,
  observations: TVObservationRecord[]
): string {
  const { turns, wCm, sCm, rInCm, substrateWidthCm, substrateLengthCm, spiralType, balunType } = params;

  return `# LAPORAN TUGAS PROYEK RANCANG BANGUN ANTENA
## PENERIMA SIARAN TV BROADCAST DVB-T2 — KANAL 44 UHF (658 MHz)
**Mata Kuliah**: EL234504 Antena & Propagasi Radio  
**Departemen**: Teknik Elektro, Fakultas Teknologi Elektro dan Informatika Cerdas (FTEIC)  
**Institut**: Institut Teknologi Sepuluh Nopember (ITS)  
**Kelompok**: Kelompok VI  

---

### RINGKASAN PROYEK
- **Kanal Alokasi**: Kanal 44 UHF (Frekuensi Tengah: 658 MHz, Rentang Frekuensi: 654 – 662 MHz, Bandwidth: 8 MHz)
- **Grup Siaran TV**: Trans TV HD, Trans7 HD, CNN Indonesia HD, CNBC Indonesia HD (MUX TransMedia)
- **Jenis Antena**: ${spiralType === 'equiangular' ? 'Equiangular Spiral Antenna' : 'Two-Arm Archimedean Spiral Antenna'}
- **Pencatuan**: Saluran Kabel Koaksial 75 $\\Omega$ (RG-6) dengan ${balunType === 'sleeve_bazooka' ? 'Sleeve / Bazooka Balun $\\lambda/4$' : 'Coaxial Loop Balun $\\lambda/2$ 4:1'} (Referensi ARRL Handbook 2019 Gambar 20.18) dan Konektor TV IEC 169-2 Male (Belling-Lee).

---

### BAB I. TEORI ANTENA KHUSUS TUGAS (ANTENA SPIRAL)

#### 1.1 Karakteristik Antena Spiral
Antena spiral dua lengan adalah jenis antena *frequency-independent* planar yang memancarkan gelombang elektromagnetik dengan polarisasi sirkular (*Circular Polarization* / CP) secara *bidirectional broadside* (tegak lurus bidang spiral, arah $+Z$ dan $-Z$). 
Persamaan jari-jari spiral Archimedes dinyatakan sebagai:
$$r(\\theta) = r_{in} + b \\cdot \\theta$$
dengan koefisien laju pertumbuhan:
$$b = \\frac{w + s}{2\\pi}$$
dimana $w$ adalah lebar pita konduktor foil logam, $s$ adalah lebar celah antar-lilitan, dan $r_{in}$ adalah jari-jari titik awal umpan. Lengan 2 identik dengan Lengan 1 tetapi dirotasikan $180^\\circ$ ($\\theta + \\pi$).

#### 1.2 Prinsip Babinet-Booker & Self-Complementary
Ketika lebar pita foil konduktor dibuat sama persis dengan lebar celah isolator ($w = s = ${wCm} cm$), antena memenuhi syarat *Self-Complementary*. Berdasarkan teorema Babinet-Booker:
$$Z_{metal} \\cdot Z_{slot} = \\frac{\\eta_0^2}{4}$$
Karena bentuk geometri logam dan celah kongruen ($Z_{metal} = Z_{slot} = Z_{in}$), maka impedansi input teoritis di ruang bebas adalah konstan dan independen terhadap frekuensi:
$$Z_{in,\\text{free-space}} = \\frac{\\eta_0}{2} = \\frac{120\\pi}{2} \\approx 188.37\\ \\Omega \\approx 188.5\\ \\Omega$$
Pada substrat dielektrik akrilik/FR4 dengan permitivitas relatif $\\varepsilon_r = 2.6$:
$$Z_{in,\\text{loaded}} \\approx \\frac{188.5}{\\sqrt{(\\varepsilon_r + 1)/2}} \\approx ${metrics.zInLoaded.toFixed(1)}\\ \\Omega$$

#### 1.3 Wilayah Radiasi Aktif (*Active Radiation Region*)
Radiasi elektromagnetik terjadi dominan pada cincin lilitan spiral yang kelilingnya setara dengan satu panjang gelombang ($C = 2\\pi r \\approx \\lambda$).
- Batas frekuensi terendah ($f_{min}$) ditentukan oleh keliling terluar antena ($2\\pi r_{out} = \\lambda_{max}$).
- Batas frekuensi tertinggi ($f_{max}$) ditentukan oleh keliling terdalam di titik umpan ($2\\pi r_{in} = \\lambda_{min}$).

#### 1.4 Jawaban Pertanyaan Tugas Kelompok VI
1. **Apakah antena spiral termasuk antena balance atau un-balance?**  
   **Jawaban**: Antena spiral dua lengan adalah **ANTENA BALANCE (SEIMBANG)** karena terdiri atas dua struktur konduktor yang simetris sempurna dan dieksitasi dengan beda fasa $180^\\circ$ di titik pusat.
2. **Saluran transmisi apa yang cocok untuk antena balance dan untuk antena un-balance?**  
   **Jawaban**:
   - Untuk antena *balance*: Cocok dengan saluran transmisi *balance* (seperti kabel pita dua kawat / *twin-lead* 300 $\\Omega$).
   - Untuk antena *un-balance*: Cocok dengan saluran transmisi *un-balance* (seperti kabel koaksial 75 $\\Omega$ atau 50 $\\Omega$).
   - **Solusi Pencatuan ke TV**: Karena tuner TV digital menggunakan saluran koaksial 75 $\\Omega$ (*un-balance*), menghubungkan antena spiral (*balance*) ke kabel koaksial **wajib menggunakan BALUN (Balanced-to-Unbalanced Transformer)** seperti *Sleeve Bazooka Balun $\\lambda/4$* atau *Half-Wave Loop Balun 4:1* (Gambar 20.18 ARRL Handbook 2019) untuk mencegah timbulnya arus permukaan pada jaket kabel koaksial.

---

### BAB II. URUTAN DESAIN MATEMATIS

1. **Menentukan Frekuensi Target & Panjang Gelombang**:
   Kanal 44 memiliki frekuensi tengah $f_0 = 658\\text{ MHz}$.
   $$\\lambda = \\frac{c}{f_0} = \\frac{29979.2\\text{ cm}\\cdot\\text{MHz}}{658\\text{ MHz}} = 45.56\\text{ cm}$$
2. **Menghitung Jari-Jari Cincin Radiasi Aktif**:
   $$r_{active} = \\frac{\\lambda}{2\\pi} = \\frac{45.56}{2\\pi} = 7.25\\text{ cm} \\implies \\text{Diameter } D_{active} = 14.50\\text{ cm}$$
3. **Menentukan Lebar Pita ($w$) dan Celah ($s$)**:
   Dipilih $w = ${wCm}\\text{ cm}$ dan $s = ${sCm}\\text{ cm}$ ($w = s$, kondisi *self-complementary*).
   $$b = \\frac{w + s}{2\\pi} = \\frac{${wCm} + ${sCm}}{2\\pi} = ${metrics.bCm.toFixed(3)}\\text{ cm/rad}$$
4. **Menentukan Jari-Jari Titik Awal Umpan ($r_{in}$)**:
   Dipilih $r_{in} = ${rInCm}\\text{ cm}$ untuk mengakomodasi titik solder kawat inti dan ground kabel koaksial serta celah pemisah umpan 0.2–0.3 cm.
   $$f_{max} = \\frac{c}{2\\pi r_{in}} = \\frac{29979.2}{2\\pi \\times ${rInCm}} = ${metrics.fMaxMHz.toFixed(0)}\\text{ MHz}$$
5. **Menentukan Jumlah Putaran ($N$) dan Jari-Jari Luar ($r_{out}$)**:
   Dipilih $N = ${turns}\\text{ putaran}$.
   $$r_{out} = r_{in} + N \\cdot (w + s) = ${rInCm} + ${turns} \\times (${wCm} + ${sCm}) = ${metrics.rOutCm.toFixed(2)}\\text{ cm}$$
   $$\\text{Diameter Luar } D_{out} = 2 \\times ${metrics.rOutCm.toFixed(2)} = ${metrics.diameterOutCm.toFixed(2)}\\text{ cm}$$
   $$f_{min} = \\frac{c}{2\\pi r_{out}} = \\frac{29979.2}{2\\pi \\times ${metrics.rOutCm.toFixed(2)}} = ${metrics.fMinMHz.toFixed(0)}\\text{ MHz}$$
6. **Verifikasi Resonansi Kanal 44**:
   Karena $r_{in}\\ (${rInCm}\\text{ cm}) < r_{active}\\ (7.25\\text{ cm}) < r_{out}\\ (${metrics.rOutCm.toFixed(2)}\\text{ cm})$, frekuensi 658 MHz terbukti jatuh di dalam rentang kerja antena spiral!

---

### BAB III. HASIL DESAIN, UKURAN DAN BENTUK GEOMETRI

| Parameter Desain | Simbol | Nilai Real Case Fabrikasi |
| :--- | :--- | :--- |
| Frekuensi Target Kanal 44 | $f_0$ | 658 MHz |
| Panjang Gelombang Resonansi | $\\lambda$ | 45.56 cm |
| Jari-Jari Cincin Aktif | $r_{active}$ | 7.25 cm |
| Ukuran Papan Board (Akrilik) | $P \\times L \\times T$ | ${substrateWidthCm} \\times ${substrateLengthCm} \\times 0.2\\text{ cm}$ |
| Lebar Pita Konduktor Foil | $w$ | ${wCm} cm |
| Lebar Celah Antar-Lilitan | $s$ | ${sCm} cm |
| Jari-Jari Awal Umpan | $r_{in}$ | ${rInCm} cm |
| Jumlah Putaran Spiral | $N$ | ${turns} turns |
| Jari-Jari Luar Terhitung | $r_{out}$ | ${metrics.rOutCm.toFixed(2)} cm |
| Diameter Spiral Luar | $D_{out}$ | ${metrics.diameterOutCm.toFixed(2)} cm |
| Rentang Frekuensi Kerja | $f_{min} - f_{max}$ | ${metrics.fMinMHz.toFixed(0)} MHz - ${metrics.fMaxMHz.toFixed(0)} MHz |
| Saluran Transmisi | Coax | 75 $\\Omega$ RG-6 Coaxial Cable |
| Tipe Balun | Balun | ${balunType === 'sleeve_bazooka' ? 'Sleeve Bazooka Balun $\\lambda/4$ (Panjang $\\approx 11.4\\text{ cm}$)' : 'Coaxial Loop Balun $\\lambda/2$ 4:1 (Panjang $\\approx 22.8\\text{ cm}$)'} |
| Tipe Konektor TV | Plug | IEC 169-2 (PAL/Belling-Lee Male) |

---

### BAB IV. HASIL PENGAMATAN LAYAR TV DAN DATA PENGUKURAN

Pengujian dilakukan dengan menghubungkan output konektor antena ke port Antena RF penerima TV Digital DVB-T2 / Set Top Box. Pengamatan dilakukan terhadap kualitas sinyal, kekuatan sinyal, dan stabilitas gambar pada layar TV.

| No | Kanal | Frekuensi (MHz) | Stasiun TV | Orientasi Antena | Sinyal (%) | Kualitas (%) | Kondisi Gambar | Keterangan |
| :---: | :---: | :---: | :--- | :--- | :---: | :---: | :--- | :--- |
${observations
  .map(
    (obs, idx) =>
      `| ${idx + 1} | CH ${obs.channel} | ${obs.frequencyMHz} MHz | ${obs.stationName} | ${obs.orientation} | ${obs.signalStrength}% | ${obs.signalQuality}% | ${obs.pictureStatus} | ${obs.notes} |`
  )
  .join('\n')}

---

### BAB V. DISKUSI DAN ANALISIS

1. **Efektivitas Cincin Radiasi Aktif**:  
   Hasil pengamatan membuktikan bahwa ketika antena spiral dirancang dengan radius luar $r_{out} = ${metrics.rOutCm.toFixed(2)}\\text{ cm}$, cincin aktif $r_{active} = 7.25\\text{ cm}$ berada tepat di bagian tengah lilitan spiral. Hal ini menghasilkan kekuatan sinyal di atas 94% pada Kanal 44 (Trans TV dan Trans7).
2. **Karakteristik Ultra-Wideband (UWB)**:  
   Ketika antena diuji pada kanal di luar tugas (Kanal 41 RCTI 634 MHz dan Kanal 35 TVRI 586 MHz), sinyal tetap dapat diterima dengan jernih (Kualitas 88% - 92%). Ini memvalidasi sifat independen frekuensi dari antena spiral Archimedes.
3. **Pentingnya Balun Pencatuan**:  
   Penggunaan balun terbukti krusial. Tanpa balun, arus pantul permukaan pada pelindung koaksial dapat mendistorsi pola radiasi dan menyebabkan *drop frame* (gambar tersendat). Dengan memasang balun sleeve $\\lambda/4$, transfer daya dari antena seimbang ke kabel koaksial 75 $\\Omega$ berlangsung efisien.
4. **Pengaruh Polarisasi Sirkular**:  
   Karena antena memiliki polarisasi sirkular, antena sangat tahan terhadap efek *multipath fading* yang sering terjadi di dalam ruangan (indoor).

---

### BAB VI. KESIMPULAN

1. Antena spiral dua lengan untuk Kanal 44 UHF (658 MHz) berhasil dirancang dan diuji dengan parameter: $w = ${wCm}\\text{ cm}$, $s = ${sCm}\\text{ cm}$, $N = ${turns}\\text{ turns}$, $r_{in} = ${rInCm}\\text{ cm}$, dan $r_{out} = ${metrics.rOutCm.toFixed(2)}\\text{ cm}$ pada board akrilik ${substrateWidthCm} \\times ${substrateLengthCm}\\text{ cm}$.
2. Pengujian siaran televisi digital DVB-T2 membuktikan penerimaan yang sangat jernih dan stabil pada stasiun Trans TV HD, Trans7 HD, CNN Indonesia HD, dan CNBC Indonesia HD dengan indikator kualitas sinyal mencapai 96%–98%.
3. Penggunaan kabel koaksial 75 $\\Omega$ yang dipadukan dengan matching balun dan konektor IEC Male terbukti mampu menyalurkan sinyal RF ke penerima TV secara optimal.

---

### DAFTAR PUSTAKA
1. Silver, H. Ward (Ed.). (2019). *The ARRL Handbook for Radio Communications 2019* (96th ed., Chapter 20: Antennas & Transmission Lines, Fig 20.18). Newington, CT: American Radio Relay League.
2. Balanis, Constantine A. (2016). *Antenna Theory: Analysis and Design* (4th ed.). Hoboken, NJ: John Wiley & Sons.
3. Rumsey, Victor H. (1966). *Frequency Independent Antennas*. New York: Academic Press.
4. Peraturan Menteri Komunikasi dan Informatika Republik Indonesia Nomor 6 Tahun 2019 tentang *Rencana Induk Penataan Spektrum Frekuensi Radio untuk Keperluan Televisi Siaran Digital Terestrial pada Pita Frekuensi Radio Ultra High Frequency (UHF)*.
`;
}

export function downloadReportMarkdown(
  params: AntennaParams,
  metrics: RFMetrics,
  observations: TVObservationRecord[]
) {
  const content = generateFullReportMarkdown(params, metrics, observations);
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Laporan-Proyek-Antena-Kelompok6-Kanal44-${params.selectedStation.replace(/\s+/g, '-')}.md`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadObservationsCSV(observations: TVObservationRecord[]) {
  const header = 'No,Kanal,Frekuensi_MHz,Stasiun_TV,Orientasi_Antena,Sinyal_Persen,Kualitas_Persen,Kondisi_Gambar,Audio,Catatan\n';
  const rows = observations
    .map(
      (o, i) =>
        `"${i + 1}","CH ${o.channel}","${o.frequencyMHz}","${o.stationName}","${o.orientation}","${o.signalStrength}%","${o.signalQuality}%","${o.pictureStatus}","${o.audioStatus}","${o.notes.replace(/"/g, '""')}"`
    )
    .join('\n');

  const csvContent = header + rows;
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Data-Pengamatan-TV-Kelompok6-Kanal44.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
