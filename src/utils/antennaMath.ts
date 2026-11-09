import type {
  AntennaParams,
  RFMetrics,
  TVChannelInfo,
} from '../types/antenna';

// Kecepatan cahaya dalam cm * MHz dan cm * GHz
// c = 2.99792458 x 10^8 m/s = 29979.2458 cm * MHz = 29.9792458 cm * GHz
export const SPEED_OF_LIGHT_CM_MHZ = 29979.2458;
export const SPEED_OF_LIGHT_CM_GHZ = 29.9792458;

// Impedansi intrinsik ruang bebas eta_0 = 120 * pi =~ 376.730313 Ohm
export const ETA_0 = 120 * Math.PI;

// Impedansi standar kabel koaksial TV broadcast (RG-6 / RG-59)
export const Z0_TV_COAX = 75.0;

// Tabel 1: Alokasi Kanal untuk Siaran TV Digital di Indonesia (Permenkominfo No. 6/2019)
export const TV_CHANNELS_TABLE: TVChannelInfo[] = [
  {
    channel: 29,
    centerFreqMHz: 538,
    freqRange: '534 - 542 MHz',
    bandwidthMHz: 8,
    stationGroup: 'SCTV, Indosiar, RTV, Mentari TV',
    assignedGroup: 'Kelompok I',
    isKelompok6: false,
  },
  {
    channel: 32,
    centerFreqMHz: 562,
    freqRange: '558 - 566 MHz',
    bandwidthMHz: 8,
    stationGroup: 'ANTV, tvOne, Arek TV',
    assignedGroup: 'Kelompok II',
    isKelompok6: false,
  },
  {
    channel: 35,
    centerFreqMHz: 586,
    freqRange: '582 - 590 MHz',
    bandwidthMHz: 8,
    stationGroup: 'TVRI Nasional, TVRI Jawa Timur',
    assignedGroup: 'Kelompok III',
    isKelompok6: false,
  },
  {
    channel: 38,
    centerFreqMHz: 610,
    freqRange: '606 - 614 MHz',
    bandwidthMHz: 8,
    stationGroup: 'Metro TV, JTV, TV9, BBS TV',
    assignedGroup: 'Kelompok IV',
    isKelompok6: false,
  },
  {
    channel: 41,
    centerFreqMHz: 634,
    freqRange: '630 - 638 MHz',
    bandwidthMHz: 8,
    stationGroup: 'RCTI, MNCTV, GTV, iNews',
    assignedGroup: 'Kelompok V',
    isKelompok6: false,
  },
  {
    channel: 44,
    centerFreqMHz: 658,
    freqRange: '654 - 662 MHz',
    bandwidthMHz: 8,
    stationGroup: 'Trans TV, Trans7, CNN Indonesia, CNBC Indonesia',
    assignedGroup: 'Kelompok VI (Tugas Kita)',
    isKelompok6: true,
  },
];

// Stasiun TV pada Kanal 44 (Kelompok 6)
export const KELOMPOK_6_STATIONS = [
  { id: 'transtv', name: 'Trans TV HD', genre: 'General Entertainment' },
  { id: 'trans7', name: 'Trans7 HD', genre: 'Variety & Documentaries' },
  { id: 'cnn', name: 'CNN Indonesia HD', genre: 'News & Current Affairs' },
  { id: 'cnbc', name: 'CNBC Indonesia HD', genre: 'Business & Economy' },
];

// Parameter Default khusus KELOMPOK 6 dalam satuan CENTIMETER (cm)
export const DEFAULT_KELOMPOK_6_PARAMS: AntennaParams = {
  spiralType: 'archimedean',
  applicationMode: 'tv_broadcast',
  turns: 3.5,
  wCm: 1.0, // Lebar pita foil 1.0 cm (10 mm)
  sCm: 1.0, // Celah antar-lilitan 1.0 cm (Self-complementary w == s)
  rInCm: 1.5, // Jari-jari awal feed 1.5 cm (15 mm)
  substrateWidthCm: 22.0, // Ukuran board 22.0 cm x 22.0 cm (220 mm)
  substrateLengthCm: 22.0,
  substrateThicknessCm: 0.2, // Tebal board 0.2 cm (2 mm)
  foilThicknessCm: 0.01, // Tebal foil logam 0.1 mm = 0.01 cm
  substrateEpsilonR: 2.6, // Akrilik bening (atau 1.0 untuk foam/karton)
  equiangularRate: 0.22,
  targetChannel: 44,
  selectedStation: 'Trans TV HD',
  balunType: 'sleeve_bazooka', // Balun sleeve koaksial lambda/4
  cableLengthCm: 60.0, // Panjang kabel koaksial 60 cm ke TV
};

// Parameter Default Praktikum Lab Microwave dalam satuan CENTIMETER (cm)
export const DEFAULT_MICROWAVE_LAB_PARAMS: AntennaParams = {
  spiralType: 'archimedean',
  applicationMode: 'microwave_lab',
  turns: 3.0,
  wCm: 0.3, // Lebar pita foil 0.3 cm (3 mm)
  sCm: 0.3, // Celah 0.3 cm (3 mm)
  rInCm: 0.45, // Jari-jari awal 0.45 cm (4.5 mm)
  substrateWidthCm: 10.0, // Board 10 cm x 10 cm
  substrateLengthCm: 10.0,
  substrateThicknessCm: 0.2,
  foilThicknessCm: 0.01,
  substrateEpsilonR: 2.6,
  equiangularRate: 0.22,
  targetChannel: 44,
  selectedStation: 'Trans TV HD',
  balunType: 'direct',
  cableLengthCm: 40.0,
};

export const DEFAULT_ANTENNA_PARAMS: AntennaParams = DEFAULT_KELOMPOK_6_PARAMS;

export function calculateRFMetrics(params: AntennaParams): RFMetrics {
  const {
    spiralType,
    turns,
    wCm,
    sCm,
    rInCm,
    substrateEpsilonR,
    equiangularRate,
    targetChannel,
  } = params;

  // Temukan info kanal TV yang dipilih
  const channelInfo =
    TV_CHANNELS_TABLE.find((c) => c.channel === targetChannel) ||
    TV_CHANNELS_TABLE[5]; // Default Kanal 44
  const targetFreqMHz = channelInfo.centerFreqMHz;

  // Panjang gelombang frekuensi target dalam cm:
  // lambda = c / f = 29979.2458 / targetFreqMHz
  const targetLambdaCm = SPEED_OF_LIGHT_CM_MHZ / targetFreqMHz;

  // Jari-jari cincin radiasi aktif (active region ring) dalam cm:
  // C = 2 * pi * r_active ~= lambda => r_active = lambda / (2 * pi)
  const rActiveCm = targetLambdaCm / (2 * Math.PI);
  const diameterActiveCm = 2 * rActiveCm;

  const thetaMax = turns * 2 * Math.PI;

  let rOutCm: number;
  let bCm: number;

  if (spiralType === 'equiangular') {
    // Equiangular spiral: r(theta) = r_in * exp(a * theta)
    const a = Math.max(0.05, equiangularRate);
    rOutCm = rInCm * Math.exp(a * thetaMax);
    bCm = a * rInCm;
  } else {
    // Archimedean spiral: r(theta) = r_in + b * theta
    bCm = (wCm + sCm) / (2 * Math.PI);
    rOutCm = rInCm + bCm * thetaMax;
  }

  const diameterOutCm = 2 * rOutCm;

  // Keliling luar dan keliling dalam (cm)
  const circumferenceOutCm = 2 * Math.PI * rOutCm;
  const circumferenceInCm = 2 * Math.PI * rInCm;

  // Batas frekuensi dalam MHz
  const fMinMHz = SPEED_OF_LIGHT_CM_MHZ / circumferenceOutCm;
  const fMaxMHz = SPEED_OF_LIGHT_CM_MHZ / circumferenceInCm;

  // Batas frekuensi dalam GHz
  const fMinGHz = fMinMHz / 1000.0;
  const fMaxGHz = fMaxMHz / 1000.0;

  // Cek apakah frekuensi target TV (658 MHz) berada dalam jangkauan antena:
  // r_in <= r_active <= r_out
  const isTargetInBand = rActiveCm >= rInCm && rActiveCm <= rOutCm;

  // Estimasi kualitas sinyal DVB-T2 penerima (%)
  let signalQualityPercent: number;
  if (isTargetInBand) {
    const centerFactor =
      1 - Math.abs(rActiveCm - (rInCm + rOutCm) / 2) / ((rOutCm - rInCm) / 2);
    const isSelfComp = Math.abs(wCm - sCm) < 0.05;
    const compBonus = isSelfComp ? 8 : 0;
    signalQualityPercent = Math.min(
      99,
      Math.max(68, Math.round(80 + centerFactor * 13 + compBonus))
    );
  } else if (rActiveCm > rOutCm) {
    const deficitRatio = rOutCm / rActiveCm;
    signalQualityPercent = Math.max(12, Math.round(deficitRatio * 55));
  } else {
    const excessRatio = rActiveCm / rInCm;
    signalQualityPercent = Math.max(15, Math.round(excessRatio * 50));
  }

  // Rasio Bandwidth
  const bandwidthRatio = fMinMHz > 0 ? fMaxMHz / fMinMHz : 0;
  const activeBandwidthOctaves =
    bandwidthRatio > 0 ? Math.log2(bandwidthRatio) : 0;

  // Babinet-Booker self-complementary condition (w == s)
  const isSelfComplementary = Math.abs(wCm - sCm) < 0.02;

  // Impedansi input teoritis ruang bebas (Rumsey's theorem)
  // Zin = eta_0 / 2 = 188.365 Ohm untuk w == s
  const ratioFactor = Math.sqrt(sCm / Math.max(0.01, wCm));
  const zInFreeSpace = (ETA_0 / 2) * ratioFactor;

  // Efek substrat dielektrik: epsilon_eff ~= (epsilon_r + 1) / 2
  const epsilonEff = (substrateEpsilonR + 1) / 2;
  const zInLoaded = zInFreeSpace / Math.sqrt(epsilonEff);

  return {
    bCm,
    rOutCm,
    diameterOutCm,
    thetaMax,
    fMinMHz,
    fMaxMHz,
    fMinGHz,
    fMaxGHz,
    targetFreqMHz,
    targetLambdaCm,
    rActiveCm,
    diameterActiveCm,
    isTargetInBand,
    signalQualityPercent,
    bandwidthRatio,
    zInFreeSpace,
    zInLoaded,
    isSelfComplementary,
    activeBandwidthOctaves,
  };
}
