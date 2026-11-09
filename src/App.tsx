import { useState, useMemo, useEffect } from 'react';
import type {
  AntennaParams,
  CameraPreset,
  VisualSettings,
  ModularAssemblySettings,
  ImageFormat,
} from './types/antenna';
import {
  DEFAULT_KELOMPOK_6_PARAMS,
  calculateRFMetrics,
} from './utils/antennaMath';
import { AntennaCanvas } from './components/AntennaCanvas';
import { ControlPanel } from './components/ControlPanel';
import { TheoryModal } from './components/TheoryModal';
import { TVSignalMonitor } from './components/TVSignalMonitor';
import {
  Radio,
  BookOpen,
  Camera,
  Maximize,
  Minimize,
  Tv,
  Target,
  Sliders,
  Printer,
  ChevronRight,
  PanelRightClose,
  PanelRightOpen,
} from 'lucide-react';
import { downloadSpiralSVG } from './utils/svgExport';
import { exportCanvasImage } from './utils/imageExport';
import './index.css';

export function App() {
  const [params, setParams] = useState<AntennaParams>(DEFAULT_KELOMPOK_6_PARAMS);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('isometric');
  const [highlightArm, setHighlightArm] = useState<'none' | 'arm1' | 'arm2'>('none');
  const [isTheoryOpen, setIsTheoryOpen] = useState(false);
  const [isTVMonitorOpen, setIsTVMonitorOpen] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);

  // Modular assembly: pengaturan bongkar pasang tiap alat & komponen fisik
  const [assembly, setAssembly] = useState<ModularAssemblySettings>({
    showFoil: true,
    showSubstrate: true,
    showBalun: true,
    showRG6Cable: true,
    showFConnector: true,
    showTVJack: true,
    showRealTV: true,
    explodedSpacing: 0,
  });

  const [visualSettings, setVisualSettings] = useState<VisualSettings>({
    showGrid: true,
    showDimensions: true,
    showRadiationPattern: false,
    showCurrentAnimation: false,
    showActiveRegion: true,
    showAxes: true,
    wireframe: false,
    theme: 'dark',
  });

  // Sinkronisasi status Fullscreen native browser
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.warn('Gagal mengubah mode fullscreen:', err);
    }
  };

  // Kalkulasi metrik teoretis RF secara reaktif (satuan cm & MHz)
  const metrics = useMemo(() => calculateRFMetrics(params), [params]);

  const handleDownloadFormat = (fmt: ImageFormat) => {
    exportCanvasImage(fmt, params.targetChannel, params.selectedStation);
    setIsExportDropdownOpen(false);
  };

  const isTV = params.applicationMode === 'tv_broadcast';

  return (
    <div className={`app-root theme-${visualSettings.theme}`}>
      {/* 1. TOP NAVBAR DENGAN DESAIN BERSIH & RAPI SHADCN */}
      <header className="top-navbar">
        <div className="flex items-center gap-2.5 min-w-0 shrink">
          <div className="app-brand-icon shrink-0">
            <Radio size={18} className="text-cyan-400" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-nowrap">
              <span className="app-main-title truncate">Spiral Antenna 3D</span>
              <span className="badge-univ shrink-0">ITS FTEIC</span>
              <span className="badge-header-kelompok6 shrink-0">
                <Target size={10} /> KELOMPOK VI
              </span>
            </div>
            <div className="app-course-subtitle truncate">
              EL234504 Antena &amp; Propagasi &bull; Penerima Siaran TV Kanal 44 (658 MHz)
            </div>
          </div>
        </div>

        {/* Quick Actions di Navbar (Selalu 1 Baris Sejajar Tanpa Wrap) */}
        <div className="navbar-actions-group">
          {/* Tombol Monitor TV Digital DVB-T2 */}
          {isTV && (
            <button
              type="button"
              onClick={() => setIsTVMonitorOpen(true)}
              className="navbar-btn tv-monitor"
              title="Buka Layar Monitor Output Penerima Siaran TV Digital"
            >
              <Tv size={14} className="text-amber-400" />
              <span>Monitor TV</span>
            </button>
          )}

          {/* Tombol Cetak Mal 1:1 Skala Nyata (SVG) */}
          <button
            type="button"
            onClick={() => downloadSpiralSVG(params, metrics)}
            className="navbar-btn"
            title="Download Mal Cetak Skala Nyata 1:1 (SVG/Print)"
          >
            <Printer size={14} className="text-emerald-400" />
            <span>Mal 1:1</span>
          </button>

          {/* Dropdown Download Gambar (Pilih JPG atau PNG) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
              className="navbar-btn"
              title="Unduh Gambar Tangkapan Layar 3D (PNG / JPG)"
            >
              <Camera size={14} />
              <span>Download</span>
            </button>

            {isExportDropdownOpen && (
              <div className="export-dropdown-menu">
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => handleDownloadFormat('png')}
                >
                  <span className="badge-fmt png">PNG</span>
                  <span>High-Res Transparan</span>
                </button>
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => handleDownloadFormat('jpg')}
                >
                  <span className="badge-fmt jpg">JPG</span>
                  <span>Solid Studio 96%</span>
                </button>
              </div>
            )}
          </div>

          {/* Tombol Panduan Teori */}
          <button
            type="button"
            onClick={() => setIsTheoryOpen(true)}
            className="navbar-btn primary"
            title="Buka Landasan Teori, Balun & Panduan Tugas Kelompok VI"
          >
            <BookOpen size={14} />
            <span>Teori &amp; Balun</span>
          </button>

          {/* Tombol Sembunyikan/Buka Panel Samping (Full Desktop View) */}
          <button
            type="button"
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            className={`navbar-btn ${!isPanelOpen ? 'active' : ''}`}
            title={isPanelOpen ? 'Sembunyikan Panel (Layar Penuh 3D)' : 'Buka Panel Kontrol'}
          >
            {isPanelOpen ? <PanelRightClose size={14} /> : <PanelRightOpen size={14} />}
            <span>{isPanelOpen ? 'Full 3D' : 'Panel'}</span>
          </button>

          {/* Tombol Toggle Fullscreen Browser */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="navbar-btn icon-only"
            title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
          >
            {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
          </button>
        </div>
      </header>

      {/* 2. AREA UTAMA: 3D VIEWPORT & PANEL KONTROL */}
      <main className="main-viewport-container">
        {/* Kanvas 3D Interaktif Three.js */}
        <div className="canvas-wrapper">
          <AntennaCanvas
            params={params}
            metrics={metrics}
            visualSettings={visualSettings}
            assembly={assembly}
            cameraPreset={cameraPreset}
            highlightArm={highlightArm}
          />

          {/* Floating HUD Petunjuk Navigasi Touch / Mouse (Kiri Bawah) */}
          <div className="canvas-hud-bottomleft">
            <div className="hud-badge">
              <span className="hud-dot" />
              <span>3D Orbit Controls &bull; Touch / Mouse</span>
            </div>
            <div className="hud-text">
              <span>&bull; Drag / Sentuh 1 Jari: Rotasi 360&deg;</span>
              <span>&bull; Pinch / Scroll: Zoom In/Out</span>
              <span>&bull; Klik Kanan / 2 Jari: Geser (Pan)</span>
            </div>
          </div>

          {/* Floating Status Ringkas Frekuensi (Kiri Atas) */}
          <div className="canvas-hud-topleft">
            <div className="hud-card-compact">
              <div className="flex items-center gap-2 mb-1">
                <span className="badge-hud-kelompok6">Kelompok 6</span>
                <span className="text-xs font-bold text-white">
                  Kanal {params.targetChannel} ({metrics.targetFreqMHz} MHz)
                </span>
              </div>
              <div className="text-sm font-bold text-cyan-400">
                {isTV
                  ? `${metrics.fMinMHz.toFixed(0)} MHz - ${metrics.fMaxMHz.toFixed(0)} MHz`
                  : `${metrics.fMinGHz.toFixed(2)} GHz - ${metrics.fMaxGHz.toFixed(2)} GHz`}
              </div>
              <div className="text-3xs text-slate-300 mt-1 flex items-center gap-1.5 flex-wrap">
                <span>Cincin Aktif &lambda;: <strong>{(2 * metrics.rActiveCm).toFixed(2)} cm</strong></span>
                <span>&bull;</span>
                <span className={metrics.isTargetInBand ? 'text-emerald-400' : 'text-amber-400'}>
                  {metrics.isTargetInBand ? 'In-Band (Resonansi OK)' : 'Out-of-Band'}
                </span>
              </div>
            </div>
          </div>

          {/* Floating Tombol Buka Panel jika Panel Ditutup */}
          {!isPanelOpen && (
            <button
              type="button"
              onClick={() => setIsPanelOpen(true)}
              className="floating-open-panel-pill"
              title="Buka Kembali Panel Kontrol Geometri & Perangkat"
            >
              <Sliders size={16} />
              <span>Buka Pengaturan Alat &amp; Dimensi</span>
              <ChevronRight size={14} />
            </button>
          )}
        </div>

        {/* Panel Kontrol Pengaturan Dimensi & Bongkar Pasang Alat */}
        {isPanelOpen && (
          <div className="control-panel-wrapper">
            <ControlPanel
              params={params}
              setParams={setParams}
              metrics={metrics}
              cameraPreset={cameraPreset}
              setCameraPreset={setCameraPreset}
              visualSettings={visualSettings}
              setVisualSettings={setVisualSettings}
              assembly={assembly}
              setAssembly={setAssembly}
              highlightArm={highlightArm}
              setHighlightArm={setHighlightArm}
              onOpenTheory={() => setIsTheoryOpen(true)}
              onOpenTVMonitor={() => setIsTVMonitorOpen(true)}
            />
          </div>
        )}
      </main>

      {/* 3. MODAL OUTPUT PENERIMA SIARAN TV DVB-T2 */}
      <TVSignalMonitor
        params={params}
        setParams={setParams}
        metrics={metrics}
        isOpen={isTVMonitorOpen}
        onClose={() => setIsTVMonitorOpen(false)}
      />

      {/* 4. MODAL PANDUAN TEORI, JAWABAN TUGAS & FORMULA BALUN */}
      <TheoryModal
        isOpen={isTheoryOpen}
        onClose={() => setIsTheoryOpen(false)}
      />
    </div>
  );
}

export default App;
