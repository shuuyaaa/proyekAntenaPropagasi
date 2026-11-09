export type SpiralType = 'archimedean' | 'equiangular';
export type ApplicationMode = 'tv_broadcast' | 'microwave_lab';
export type BalunType = 'sleeve_bazooka' | 'half_wave_4to1' | 'direct';
export type ImageFormat = 'png' | 'jpg';

export interface TVChannelInfo {
  channel: number;
  centerFreqMHz: number;
  freqRange: string;
  bandwidthMHz: number;
  stationGroup: string;
  assignedGroup: string;
  isKelompok6: boolean;
}

export interface AntennaParams {
  spiralType: SpiralType;
  applicationMode: ApplicationMode;
  turns: number; // Jumlah putaran (N)
  wCm: number; // Lebar pita foil konduktor (cm)
  sCm: number; // Lebar celah antar-lilitan (cm)
  rInCm: number; // Jari-jari dalam umpan (cm)
  substrateWidthCm: number; // Lebar papan board (cm)
  substrateLengthCm: number; // Panjang papan board (cm)
  substrateThicknessCm: number; // Tebal papan board (cm)
  foilThicknessCm: number; // Tebal foil logam (cm)
  substrateEpsilonR: number; // Konstanta dielektrik substrat
  equiangularRate: number; // Parameter laju ekspansi spiral equiangular (a)
  targetChannel: number; // Nomor kanal TV digital (44 untuk Kelompok 6)
  selectedStation: string; // Stasiun siaran aktif (Trans TV, Trans7, dll.)
  balunType: BalunType; // Jenis balun pencatuan (referensi ARRL)
  cableLengthCm: number; // Panjang kabel koaksial RG6 (cm)
}

export interface RFMetrics {
  bCm: number; // Koefisien pertumbuhan spiral Archimedes (cm/rad)
  rOutCm: number; // Jari-jari luar terhitung (cm)
  diameterOutCm: number; // Diameter luar terhitung (cm)
  thetaMax: number; // Sudut putaran total (rad)
  fMinMHz: number; // Frekuensi batas bawah (MHz)
  fMaxMHz: number; // Frekuensi batas atas (MHz)
  fMinGHz: number; // Frekuensi batas bawah (GHz)
  fMaxGHz: number; // Frekuensi batas atas (GHz)
  targetFreqMHz: number; // Frekuensi target kanal TV (MHz)
  targetLambdaCm: number; // Panjang gelombang target (cm)
  rActiveCm: number; // Jari-jari cincin radiasi aktif (cm)
  diameterActiveCm: number; // Diameter cincin radiasi aktif (cm)
  isTargetInBand: boolean; // Apakah frekuensi target tercakup geometri antena
  signalQualityPercent: number; // Estimasi kualitas sinyal DVB-T2 (%)
  bandwidthRatio: number; // Rasio bandwidth fMax / fMin
  zInFreeSpace: number; // Impedansi input teoritis ruang bebas (Ohm)
  zInLoaded: number; // Impedansi input dengan substrat (Ohm)
  isSelfComplementary: boolean; // Apakah w == s
  activeBandwidthOctaves: number; // Bandwidth dalam satuan oktav
}

export type CameraPreset = 'top' | 'isometric' | 'side' | 'bottom' | 'tv_view';

export interface ModularAssemblySettings {
  showFoil: boolean; // Lengan foil spiral logam
  showSubstrate: boolean; // Papan board akrilik
  showBalun: boolean; // Balun sleeve lambda/4
  showRG6Cable: boolean; // Kabel Koaksial RG6 75 Ohm
  showFConnector: boolean; // F-Connector RG6 (ulir drat)
  showTVJack: boolean; // Jack Antena TV (IEC Male)
  showRealTV: boolean; // Unit TV Digital 3D di ujung kabel
  explodedSpacing: number; // Jarak pandangan terurai (0 s.d. 1)
}

export interface VisualSettings {
  showGrid: boolean;
  showDimensions: boolean;
  showRadiationPattern: boolean;
  showCurrentAnimation: boolean;
  showActiveRegion: boolean;
  showAxes: boolean;
  wireframe: boolean;
  theme: 'dark' | 'blueprint' | 'studio';
}
