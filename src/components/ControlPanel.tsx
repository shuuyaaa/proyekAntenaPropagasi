import { useState } from 'react';
import type { FC, Dispatch, SetStateAction } from 'react';
import {
  RotateCcw,
  Eye,
  Sliders,
  Activity,
  Layers,
  Radio,
  Zap,
  Grid,
  Ruler,
  AlertTriangle,
  Info,
  Tv,
  Target,
  Cable,
  Printer,
  Download,
  Boxes,
  Check,
} from 'lucide-react';
import type {
  AntennaParams,
  RFMetrics,
  CameraPreset,
  VisualSettings,
  ModularAssemblySettings,
  ImageFormat,
} from '../types/antenna';
import {
  DEFAULT_KELOMPOK_6_PARAMS,
  DEFAULT_MICROWAVE_LAB_PARAMS,
  TV_CHANNELS_TABLE,
} from '../utils/antennaMath';
import { downloadSpiralSVG } from '../utils/svgExport';
import { exportCanvasImage } from '../utils/imageExport';

interface ControlPanelProps {
  params: AntennaParams;
  setParams: Dispatch<SetStateAction<AntennaParams>>;
  metrics: RFMetrics;
  cameraPreset: CameraPreset;
  setCameraPreset: (preset: CameraPreset) => void;
  visualSettings: VisualSettings;
  setVisualSettings: Dispatch<SetStateAction<VisualSettings>>;
  assembly: ModularAssemblySettings;
  setAssembly: Dispatch<SetStateAction<ModularAssemblySettings>>;
  highlightArm: 'none' | 'arm1' | 'arm2';
  setHighlightArm: (arm: 'none' | 'arm1' | 'arm2') => void;
  onOpenTheory: () => void;
  onOpenTVMonitor: () => void;
}

export const ControlPanel: FC<ControlPanelProps> = ({
  params,
  setParams,
  metrics,
  cameraPreset,
  setCameraPreset,
  visualSettings,
  setVisualSettings,
  assembly,
  setAssembly,
  highlightArm,
  setHighlightArm,
  onOpenTheory,
  onOpenTVMonitor,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<ImageFormat>('png');

  const updateParam = <K extends keyof AntennaParams>(
    key: K,
    value: AntennaParams[K]
  ) => {
    setParams((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const toggleVisual = (key: keyof VisualSettings) => {
    setVisualSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleAssembly = (key: keyof ModularAssemblySettings) => {
    setAssembly((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleApplyKelompok6Preset = () => {
    setParams(DEFAULT_KELOMPOK_6_PARAMS);
    setCameraPreset('isometric');
    setHighlightArm('none');
  };

  const handleApplyMicrowaveLabPreset = () => {
    setParams(DEFAULT_MICROWAVE_LAB_PARAMS);
    setCameraPreset('isometric');
    setHighlightArm('none');
  };

  const handleDownloadImage = () => {
    exportCanvasImage(
      selectedFormat,
      params.targetChannel,
      params.selectedStation
    );
  };

  const isExceedingBoard = metrics.diameterOutCm > params.substrateWidthCm - 0.6;
  const isTVMode = params.applicationMode === 'tv_broadcast';
  const currentChannel = TV_CHANNELS_TABLE.find(
    (c) => c.channel === params.targetChannel
  ) || TV_CHANNELS_TABLE[5];

  return (
    <aside className="control-panel-container custom-scrollbar">
      {/* 1. HEADER INFORMASI & IDENTITAS KELOMPOK 6 */}
      <div className="panel-header">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <span className="badge-its">ITS FTEIC</span>
          <span className="badge-course">EL234504</span>
          <span className="badge-kelompok-6">
            <Target size={11} /> KELOMPOK VI
          </span>
        </div>
        <h1 className="panel-title">Archimedean &amp; Equiangular Spiral</h1>
        <p className="panel-subtitle">
          Rancang Bangun Antena Penerima Siaran TV Broadcast &bull; Teknik Elektro ITS
        </p>
      </div>

      {/* 2. MODE OPERASI: TV BROADCAST KELOMPOK 6 VS LAB GELOMBANG MIKRO */}
      <div className="panel-section">
        <div className="section-label">
          <Tv size={15} className="text-cyan-400" />
          <span>Mode Aplikasi &amp; Geometri Spiral</span>
        </div>

        {/* Tab Switcher: TV Broadcast vs Microwave Lab */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-900/80 rounded-lg border border-slate-700/60">
          <button
            type="button"
            className={`btn-mode-tab ${isTVMode ? 'active' : ''}`}
            onClick={handleApplyKelompok6Preset}
          >
            <div className="font-bold text-xs">Siaran TV Broadcast</div>
            <div className="text-3xs text-slate-400">Kanal 44 (658 MHz)</div>
          </button>
          <button
            type="button"
            className={`btn-mode-tab ${!isTVMode ? 'active' : ''}`}
            onClick={handleApplyMicrowaveLabPreset}
          >
            <div className="font-bold text-xs">Lab Microwave</div>
            <div className="text-3xs text-slate-400">2.1 - 10.6 GHz</div>
          </button>
        </div>

        {/* Pemilihan Jenis Geometri: Archimedean vs Equiangular */}
        <div className="grid grid-cols-2 gap-1.5 mt-1">
          <button
            type="button"
            className={`btn-spiral-type ${params.spiralType === 'archimedean' ? 'active' : ''}`}
            onClick={() => updateParam('spiralType', 'archimedean')}
          >
            Spiral Archimedes
          </button>
          <button
            type="button"
            className={`btn-spiral-type ${params.spiralType === 'equiangular' ? 'active' : ''}`}
            onClick={() => updateParam('spiralType', 'equiangular')}
          >
            Equiangular Spiral
          </button>
        </div>

        {/* Banner Quick Link ke Monitor TV */}
        {isTVMode && (
          <button
            type="button"
            onClick={onOpenTVMonitor}
            className="btn-open-tv-screen"
          >
            <div className="flex items-center gap-2">
              <Tv size={16} className="text-cyan-300" />
              <div className="text-left">
                <div className="font-bold text-xs text-white">
                  Buka Output TV Penerima DVB-T2
                </div>
                <div className="text-3xs text-cyan-200">
                  Uji Sinyal Siaran {currentChannel.stationGroup.split(',')[0]} (CH {currentChannel.channel})
                </div>
              </div>
            </div>
            <span className="badge-signal-mini">
              {metrics.signalQualityPercent}% SNR
            </span>
          </button>
        )}
      </div>

      {/* 3. PRESET SUDUT PANDANG KAMERA (FOKUS SATU LAYAR PENUH) */}
      <div className="panel-section">
        <div className="section-label">
          <Eye size={15} className="text-cyan-400" />
          <span>Preset Sudut Pandang Kamera</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className={`btn-preset ${cameraPreset === 'isometric' ? 'active' : ''}`}
            onClick={() => setCameraPreset('isometric')}
            title="Sudut Isometrik 3D Proporsional Satu Layar Penuh"
          >
            Isometrik 3D
          </button>
          <button
            type="button"
            className={`btn-preset ${cameraPreset === 'tv_view' ? 'active' : ''}`}
            onClick={() => setCameraPreset('tv_view')}
            title="Tampilan Lengkap Antena & Perangkat TV"
          >
            Antena &amp; TV
          </button>
          <button
            type="button"
            className={`btn-preset ${cameraPreset === 'top' ? 'active' : ''}`}
            onClick={() => setCameraPreset('top')}
            title="Tampak Atas 2D (Tegak Lurus)"
          >
            Tampak Atas (2D)
          </button>
          <button
            type="button"
            className={`btn-preset ${cameraPreset === 'side' ? 'active' : ''}`}
            onClick={() => setCameraPreset('side')}
            title="Tampak Samping (Profil Ketebalan)"
          >
            Tampak Samping
          </button>
        </div>
      </div>

      {/* 4. MODULAR ASSEMBLY: BONGKAR PASANG ALAT & PANDANGAN TERURAI */}
      <div className="panel-section">
        <div className="flex items-center justify-between section-label">
          <div className="flex items-center gap-2">
            <Boxes size={15} className="text-cyan-400" />
            <span>Bongkar Pasang Perangkat (Modular)</span>
          </div>
          <span className="text-2xs text-slate-400">Klik pasang/lepas</span>
        </div>

        {/* Slider Jarak Pandangan Terurai (Exploded View) */}
        <div className="slider-group mb-1">
          <div className="slider-header">
            <span className="slider-name">Pandangan Terurai (Exploded View)</span>
            <span className="slider-val">{(assembly.explodedSpacing * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={assembly.explodedSpacing}
            onChange={(e) =>
              setAssembly((prev) => ({
                ...prev,
                explodedSpacing: parseFloat(e.target.value),
              }))
            }
            className="slider-input"
          />
        </div>

        {/* Toggle Grid untuk Memasang/Membongkar Tiap Komponen Fisik */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className={`btn-assembly-toggle ${assembly.showFoil ? 'active' : ''}`}
            onClick={() => toggleAssembly('showFoil')}
          >
            <span className="indicator-dot" />
            <span>Pita Foil Spiral</span>
          </button>

          <button
            type="button"
            className={`btn-assembly-toggle ${assembly.showSubstrate ? 'active' : ''}`}
            onClick={() => toggleAssembly('showSubstrate')}
          >
            <span className="indicator-dot" />
            <span>Papan Akrilik</span>
          </button>

          <button
            type="button"
            className={`btn-assembly-toggle ${assembly.showBalun ? 'active' : ''}`}
            onClick={() => toggleAssembly('showBalun')}
          >
            <span className="indicator-dot" />
            <span>Balun &lambda;/4</span>
          </button>

          <button
            type="button"
            className={`btn-assembly-toggle ${assembly.showRG6Cable ? 'active' : ''}`}
            onClick={() => toggleAssembly('showRG6Cable')}
          >
            <span className="indicator-dot" />
            <span>Kabel RG-6 (75&Omega;)</span>
          </button>

          <button
            type="button"
            className={`btn-assembly-toggle ${assembly.showFConnector ? 'active' : ''}`}
            onClick={() => toggleAssembly('showFConnector')}
          >
            <span className="indicator-dot" />
            <span>F-Connector RG6</span>
          </button>

          <button
            type="button"
            className={`btn-assembly-toggle ${assembly.showTVJack ? 'active' : ''}`}
            onClick={() => toggleAssembly('showTVJack')}
          >
            <span className="indicator-dot" />
            <span>Jack Antena TV</span>
          </button>
        </div>

        {/* Card Khusus Smart TV 3D */}
        <button
          type="button"
          className={`btn-assembly-tv-card mt-1.5 ${assembly.showRealTV ? 'active' : ''}`}
          onClick={() => toggleAssembly('showRealTV')}
        >
          <div className="flex items-center gap-2.5">
            <span className="indicator-dot" />
            <div className="text-left">
              <div className="font-semibold text-xs text-white">Smart TV 3D (Layar Siaran)</div>
              <div className="text-2xs text-slate-400">Penerima Siaran Trans TV CH 44</div>
            </div>
          </div>
          <span className={`badge-tv-status ${assembly.showRealTV ? 'active' : ''}`}>
            {assembly.showRealTV ? 'TERPASANG' : 'DILEPAS'}
          </span>
        </button>
      </div>

      {/* 5. SLIDER PARAMETER REAL-TIME DALAM CENTIMETER (cm) */}
      <div className="panel-section">
        <div className="flex items-center justify-between section-label">
          <div className="flex items-center gap-2">
            <Sliders size={15} className="text-cyan-400" />
            <span>Dimensi Geometri Fabrikasi (cm)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => downloadSpiralSVG(params, metrics)}
              className="btn-reset-mini text-emerald-400 hover:text-emerald-300"
              title="Unduh Mal Cetak 1:1 Skala Nyata (SVG)"
            >
              <Printer size={12} />
              <span>Mal 1:1</span>
            </button>
            <button
              type="button"
              onClick={isTVMode ? handleApplyKelompok6Preset : handleApplyMicrowaveLabPreset}
              className="btn-reset-mini"
              title="Kembalikan ke ukuran standar"
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Slider: Jumlah Putaran (N) */}
        <div className="slider-group">
          <div className="slider-header">
            <span className="slider-name">Jumlah Putaran (N)</span>
            <span className="slider-val">{params.turns.toFixed(1)} turns</span>
          </div>
          <input
            type="range"
            min={1.0}
            max={6.0}
            step={0.5}
            value={params.turns}
            onChange={(e) => updateParam('turns', parseFloat(e.target.value))}
            className="slider-input"
          />
          <div className="slider-ticks">
            <span>1.0</span>
            <span>2.5</span>
            <span>{isTVMode ? '3.5 (CH 44)' : '3.0'}</span>
            <span>5.0</span>
            <span>6.0</span>
          </div>
        </div>

        {/* Slider: Lebar Pita Foil (w) dalam cm */}
        <div className="slider-group">
          <div className="slider-header">
            <span className="slider-name">Lebar Pita Foil (w)</span>
            <span className="slider-val">{params.wCm.toFixed(1)} cm</span>
          </div>
          <input
            type="range"
            min={0.1}
            max={isTVMode ? 2.5 : 0.8}
            step={0.1}
            value={params.wCm}
            onChange={(e) => updateParam('wCm', parseFloat(e.target.value))}
            className="slider-input"
          />
          <div className="slider-ticks">
            <span>0.1 cm</span>
            <span>{isTVMode ? '1.0 cm (Foil Tape)' : '0.3 cm'}</span>
            <span>{isTVMode ? '2.5 cm' : '0.8 cm'}</span>
          </div>
        </div>

        {/* Slider: Lebar Celah Antar-Pita (s) dalam cm */}
        <div className="slider-group">
          <div className="slider-header">
            <span className="slider-name">Lebar Celah Antar-Pita (s)</span>
            <span className="slider-val">{params.sCm.toFixed(1)} cm</span>
          </div>
          <input
            type="range"
            min={0.1}
            max={isTVMode ? 2.5 : 0.8}
            step={0.1}
            value={params.sCm}
            onChange={(e) => updateParam('sCm', parseFloat(e.target.value))}
            className="slider-input"
          />
          <div className="slider-ticks">
            <span>0.1 cm</span>
            <span>{isTVMode ? '1.0 cm (Self-Comp)' : '0.3 cm'}</span>
            <span>{isTVMode ? '2.5 cm' : '0.8 cm'}</span>
          </div>
        </div>

        {/* Slider: Jari-jari Titik Awal Dalam (r_in) dalam cm */}
        <div className="slider-group">
          <div className="slider-header">
            <span className="slider-name">Jari-jari Dalam Umpan (r_in)</span>
            <span className="slider-val">{params.rInCm.toFixed(2)} cm</span>
          </div>
          <input
            type="range"
            min={0.2}
            max={isTVMode ? 3.0 : 1.0}
            step={0.05}
            value={params.rInCm}
            onChange={(e) => updateParam('rInCm', parseFloat(e.target.value))}
            className="slider-input"
          />
          <div className="slider-ticks">
            <span>0.2 cm</span>
            <span>{isTVMode ? '1.50 cm (Feed)' : '0.45 cm'}</span>
            <span>{isTVMode ? '3.0 cm' : '1.0 cm'}</span>
          </div>
        </div>

        {/* Slider: Ukuran Papan Board (cm) */}
        <div className="slider-group">
          <div className="slider-header">
            <span className="slider-name">Ukuran Papan Board Akrilik</span>
            <span className="slider-val">{params.substrateWidthCm.toFixed(1)} cm</span>
          </div>
          <input
            type="range"
            min={8.0}
            max={32.0}
            step={1.0}
            value={params.substrateWidthCm}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              updateParam('substrateWidthCm', val);
              updateParam('substrateLengthCm', val);
            }}
            className="slider-input"
          />
          <div className="slider-ticks">
            <span>8 cm</span>
            <span>10 cm (Lab)</span>
            <span>22 cm (Kanal 44)</span>
            <span>32 cm</span>
          </div>
        </div>

        {/* Alert jika diameter spiral melebihi board */}
        {isExceedingBoard && (
          <div className="warning-box">
            <AlertTriangle size={16} className="text-amber-400 shrink-0" />
            <p className="text-xs text-amber-200">
              Diameter luar ({metrics.diameterOutCm.toFixed(1)} cm) melebihi batas papan {params.substrateWidthCm.toFixed(1)}&times;{params.substrateWidthCm.toFixed(1)} cm!
            </p>
          </div>
        )}
      </div>

      {/* 6. DOWNLOAD GAMBAR (JPG ATAU PNG) */}
      <div className="panel-section">
        <div className="section-label">
          <Download size={15} className="text-cyan-400" />
          <span>Download Gambar Hasil Setting (JPG / PNG)</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Pilihan Format: JPG atau PNG */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-900/80 rounded-lg border border-slate-700/60 flex-1">
            <button
              type="button"
              className={`btn-format-selector ${selectedFormat === 'png' ? 'active' : ''}`}
              onClick={() => setSelectedFormat('png')}
            >
              {selectedFormat === 'png' && <Check size={12} className="inline mr-1 text-cyan-400" />}
              PNG (Transparan)
            </button>
            <button
              type="button"
              className={`btn-format-selector ${selectedFormat === 'jpg' ? 'active' : ''}`}
              onClick={() => setSelectedFormat('jpg')}
            >
              {selectedFormat === 'jpg' && <Check size={12} className="inline mr-1 text-cyan-400" />}
              JPG (Solid Studio)
            </button>
          </div>

          {/* Tombol Eksekusi Download Gambar */}
          <button
            type="button"
            onClick={handleDownloadImage}
            className="btn-download-image-action"
            title={`Unduh Gambar 3D format .${selectedFormat}`}
          >
            <Download size={14} />
            <span>Unduh {selectedFormat.toUpperCase()}</span>
          </button>
        </div>
      </div>

      {/* 7. KALKULASI TEORITIS RF & RESPON FREKUENSI TV */}
      <div className="panel-section">
        <div className="flex items-center justify-between section-label">
          <div className="flex items-center gap-2">
            <Activity size={15} className="text-cyan-400" />
            <span>Kalkulasi Teori RF (Satuan: cm &amp; MHz)</span>
          </div>
          <button
            type="button"
            onClick={onOpenTheory}
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 underline underline-offset-2"
          >
            <Info size={12} />
            <span>Rumus &amp; Balun</span>
          </button>
        </div>

        {/* Kartu Status Kanal Target 44 */}
        <div className="tv-target-card">
          <div className="flex items-center justify-between">
            <span className="text-2xs text-slate-300 uppercase font-semibold">
              Target Kanal 44 (Kelompok 6)
            </span>
            <span className={`badge-inband ${metrics.isTargetInBand ? 'success' : 'fail'}`}>
              {metrics.isTargetInBand ? 'RESONANSI TERPENUHI' : 'DILUAR JANGKAUAN'}
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <div className="text-xl font-bold font-mono text-cyan-300">
              {metrics.targetFreqMHz} MHz
            </div>
            <div className="text-right text-xs text-slate-400">
              &lambda; = {metrics.targetLambdaCm.toFixed(1)} cm
            </div>
          </div>
          <div className="text-2xs text-slate-400 mt-1">
            Cincin Radiasi Aktif: <strong className="text-emerald-400">r_active = {metrics.rActiveCm.toFixed(2)} cm</strong> (Diameter {(2 * metrics.rActiveCm).toFixed(2)} cm)
          </div>
        </div>

        {/* Grid Kartu Metrik RF */}
        <div className="rf-metric-grid">
          <div className="rf-card">
            <div className="rf-card-label">Jari-jari Luar (r_out)</div>
            <div className="rf-card-value text-cyan-400">
              {metrics.rOutCm.toFixed(2)}{' '}
              <span className="text-xs font-normal text-slate-400">cm</span>
            </div>
            <div className="rf-card-sub">
              Diameter = {metrics.diameterOutCm.toFixed(1)} cm
            </div>
          </div>

          <div className="rf-card">
            <div className="rf-card-label">Frekuensi Terendah</div>
            <div className="rf-card-value text-emerald-400">
              {isTVMode ? `${metrics.fMinMHz.toFixed(0)} MHz` : `${metrics.fMinGHz.toFixed(2)} GHz`}
            </div>
            <div className="rf-card-sub">
              Batas luar (&lambda; = {(2 * Math.PI * metrics.rOutCm).toFixed(1)} cm)
            </div>
          </div>

          <div className="rf-card">
            <div className="rf-card-label">Frekuensi Tertinggi</div>
            <div className="rf-card-value text-indigo-400">
              {isTVMode ? `${metrics.fMaxMHz.toFixed(0)} MHz` : `${metrics.fMaxGHz.toFixed(2)} GHz`}
            </div>
            <div className="rf-card-sub">
              Batas dalam (&lambda; = {(2 * Math.PI * params.rInCm).toFixed(1)} cm)
            </div>
          </div>

          <div className="rf-card">
            <div className="rf-card-label">Rasio Bandwidth</div>
            <div className="rf-card-value text-amber-400">
              {metrics.bandwidthRatio.toFixed(1)} : 1
            </div>
            <div className="rf-card-sub">
              {metrics.activeBandwidthOctaves.toFixed(1)} Oktav
            </div>
          </div>
        </div>

        {/* Pencatuan Balun 75 Ohm Coaxial */}
        <div className="balun-selector-box">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Cable size={14} className="text-cyan-400" />
              Pencatuan Balun (ARRL Fig 20.18)
            </span>
            <span className="text-3xs text-slate-400 font-mono">75&Omega; COAX</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            <button
              type="button"
              className={`btn-balun-opt ${params.balunType === 'sleeve_bazooka' ? 'active' : ''}`}
              onClick={() => updateParam('balunType', 'sleeve_bazooka')}
            >
              <div className="font-bold">Sleeve &lambda;/4 (Bazooka)</div>
              <div className="text-3xs text-slate-400">Fig 20.18 (B)</div>
            </button>
            <button
              type="button"
              className={`btn-balun-opt ${params.balunType === 'half_wave_4to1' ? 'active' : ''}`}
              onClick={() => updateParam('balunType', 'half_wave_4to1')}
            >
              <div className="font-bold">Loop &lambda;/2 4:1</div>
              <div className="text-3xs text-slate-400">Fig 20.18 (D)</div>
            </button>
          </div>
        </div>
      </div>

      {/* 8. FITUR TAMPILAN & OPSI VISUAL */}
      <div className="panel-section">
        <div className="section-label">
          <Layers size={15} className="text-cyan-400" />
          <span>Lapisan Visual 3D</span>
        </div>

        <div className="feature-toggles-grid">
          <button
            type="button"
            className={`btn-toggle ${visualSettings.showGrid ? 'active' : ''}`}
            onClick={() => toggleVisual('showGrid')}
          >
            <Grid size={14} />
            <span>Grid cm</span>
          </button>

          <button
            type="button"
            className={`btn-toggle ${visualSettings.showDimensions ? 'active' : ''}`}
            onClick={() => toggleVisual('showDimensions')}
          >
            <Ruler size={14} />
            <span>Dimensi</span>
          </button>

          <button
            type="button"
            className={`btn-toggle ${visualSettings.showActiveRegion ? 'active' : ''}`}
            onClick={() => toggleVisual('showActiveRegion')}
            title="Tampilkan cincin radiasi aktif frekuensi TV 658 MHz"
          >
            <Target size={14} />
            <span>Cincin Aktif</span>
          </button>

          <button
            type="button"
            className={`btn-toggle ${visualSettings.showRadiationPattern ? 'active' : ''}`}
            onClick={() => toggleVisual('showRadiationPattern')}
          >
            <Radio size={14} />
            <span>Pola Radiasi</span>
          </button>

          <button
            type="button"
            className={`btn-toggle ${visualSettings.showCurrentAnimation ? 'active' : ''}`}
            onClick={() => toggleVisual('showCurrentAnimation')}
          >
            <Zap size={14} />
            <span>Animasi Arus</span>
          </button>

          <button
            type="button"
            className={`btn-toggle ${visualSettings.wireframe ? 'active' : ''}`}
            onClick={() => toggleVisual('wireframe')}
          >
            <Layers size={14} />
            <span>Wireframe</span>
          </button>
        </div>

        {/* Inspeksi Lengan Spiral 1 & 2 */}
        <div className="mt-2 pt-2 border-t border-slate-700/60">
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              className={`btn-arm-select ${highlightArm === 'none' ? 'active' : ''}`}
              onClick={() => setHighlightArm('none')}
            >
              Semua
            </button>
            <button
              type="button"
              className={`btn-arm-select arm1 ${highlightArm === 'arm1' ? 'active' : ''}`}
              onClick={() => setHighlightArm('arm1')}
            >
              Lengan 1 (&theta;)
            </button>
            <button
              type="button"
              className={`btn-arm-select arm2 ${highlightArm === 'arm2' ? 'active' : ''}`}
              onClick={() => setHighlightArm('arm2')}
            >
              Lengan 2 (&theta;+&pi;)
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
