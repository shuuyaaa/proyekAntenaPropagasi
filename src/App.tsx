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
  PanelRightClose,
  PanelRightOpen,
  Menu,
  X,
  Download,
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
  // Default panel terbuka di desktop (>1024px), tertutup di iPad/iPhone agar langsung melihat kanvas 3D
  const [isPanelOpen, setIsPanelOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth > 1024;
    }
    return true;
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      {/* 1. TOP NAVBAR DENGAN DESAIN BERSIH & RESPONSIF DI HP/IPAD/DESKTOP */}
      <header className="top-navbar">
        <div className="flex items-center gap-2 min-w-0 shrink">
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
            <div className="app-course-subtitle truncate hidden sm:block">
              EL234504 Antena &amp; Propagasi &bull; Penerima Siaran TV Kanal 44 (658 MHz)
            </div>
          </div>
        </div>

        {/* Quick Actions di Navbar */}
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
              <span className="btn-label-desktop hidden md:inline">Monitor TV</span>
            </button>
          )}

          {/* Tombol Cetak Mal 1:1 Skala Nyata (SVG) - Desktop Only */}
          <button
            type="button"
            onClick={() => downloadSpiralSVG(params, metrics)}
            className="navbar-btn btn-desktop-only"
            title="Download Mal Cetak Skala Nyata 1:1 (SVG/Print)"
          >
            <Printer size={14} className="text-emerald-400" />
            <span>Mal 1:1</span>
          </button>

          {/* Dropdown Download Gambar (Pilih JPG atau PNG) - Desktop & Tablet */}
          <div className="relative btn-desktop-tablet">
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
            className="navbar-btn primary btn-desktop-tablet"
            title="Buka Landasan Teori, Balun & Panduan Tugas Kelompok VI"
          >
            <BookOpen size={14} />
            <span className="hidden md:inline">Teori &amp; Balun</span>
          </button>

          {/* Tombol Sembunyikan/Buka Panel Samping di Desktop */}
          <button
            type="button"
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            className={`navbar-btn btn-desktop-only ${!isPanelOpen ? 'active' : ''}`}
            title={isPanelOpen ? 'Sembunyikan Panel (Layar Penuh 3D)' : 'Buka Panel Kontrol'}
          >
            {isPanelOpen ? <PanelRightClose size={14} /> : <PanelRightOpen size={14} />}
            <span>{isPanelOpen ? 'Full 3D' : 'Panel'}</span>
          </button>

          {/* Tombol Toggle Fullscreen Browser di Navbar Desktop */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="navbar-btn icon-only btn-desktop-only"
            title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
          >
            {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
          </button>

          {/* Tombol Hamburger Menu Lengkap (HP & Tablet) */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="navbar-btn icon-only btn-mobile-menu"
            title="Menu Navigasi & Download Lengkap"
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
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
          <div className="canvas-hud-bottomleft hidden sm:flex">
            <div className="hud-badge">
              <span className="hud-dot" />
              <span>3D Orbit Controls &bull; Touch / Mouse</span>
            </div>
            <div className="hud-text">
              <span>&bull; Sentuh 1 Jari / Drag: Rotasi 360&deg;</span>
              <span>&bull; Pinch / Scroll: Zoom In/Out</span>
              <span>&bull; Geser 2 Jari / Klik Kanan: Pan Posisi</span>
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

          {/* ===============================================================
              DEDICATED FLOATING CANVAS DOCK (TOMBOL LAYAR PENUH & KONTROL CEPAT)
              Menjawab masalah "button buat full screennya kayak tertutup, mungkin bisa dipindah menu nya"
              Dock ini mengapung langsung di atas kanvas 3D dan selalu mudah diakses di iPad, iPhone & PC!
              =============================================================== */}
          <div className="canvas-floating-dock-wrapper">
            <div className="canvas-floating-dock">
              {/* Tombol Fullscreen Layar Penuh Dedikasi */}
              <button
                type="button"
                onClick={toggleFullscreen}
                className={`canvas-dock-btn dock-btn-fullscreen ${isFullscreen ? 'active' : ''}`}
                title={isFullscreen ? 'Keluar Mode Layar Penuh' : 'Mode Layar Penuh (Fullscreen)'}
              >
                {isFullscreen ? <Minimize size={15} /> : <Maximize size={15} />}
                <span className="dock-label">{isFullscreen ? 'Keluar Full' : 'Layar Penuh'}</span>
              </button>

              <div className="dock-separator" />

              {/* Kamera Presets Cluster */}
              <div className="dock-presets-cluster">
                <button
                  type="button"
                  onClick={() => setCameraPreset('top')}
                  className={`dock-preset-btn ${cameraPreset === 'top' ? 'active' : ''}`}
                  title="Tampak Atas 2D Spiral"
                >
                  Atas
                </button>
                <button
                  type="button"
                  onClick={() => setCameraPreset('isometric')}
                  className={`dock-preset-btn ${cameraPreset === 'isometric' ? 'active' : ''}`}
                  title="Isometrik 3D"
                >
                  3D
                </button>
                {isTV && (
                  <button
                    type="button"
                    onClick={() => setCameraPreset('tv_view')}
                    className={`dock-preset-btn ${cameraPreset === 'tv_view' ? 'active' : ''}`}
                    title="Fokus Antena & TV"
                  >
                    TV
                  </button>
                )}
              </div>

              <div className="dock-separator" />

              {/* Tombol Buka / Tutup Panel Kontrol */}
              <button
                type="button"
                onClick={() => setIsPanelOpen(!isPanelOpen)}
                className={`canvas-dock-btn dock-btn-panel ${isPanelOpen ? 'active' : ''}`}
                title={isPanelOpen ? 'Tutup Panel (Lihat 3D Penuh)' : 'Buka Pengaturan Dimensi & Alat'}
              >
                <Sliders size={15} />
                <span className="dock-label">{isPanelOpen ? 'Tutup Panel' : 'Atur Ukuran'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Panel Kontrol Pengaturan Dimensi & Bongkar Pasang Alat */}
        {isPanelOpen && (
          <>
            {/* Backdrop Gelap untuk iPad / Mobile ketika Panel Dibuka */}
            <div
              className="panel-backdrop-overlay"
              onClick={() => setIsPanelOpen(false)}
              title="Klik di luar untuk menutup panel"
            />
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
                onClose={() => setIsPanelOpen(false)}
              />
            </div>
          </>
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

      {/* 5. MOBILE & IPAD ACTION SHEET DRAWER (MENU LENGKAP & DOWNLOAD) */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setIsMobileMenuOpen(false)}>
          <div
            className="mobile-menu-drawer custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mobile-menu-header">
              <div className="flex items-center gap-2">
                <Radio size={16} className="text-cyan-400" />
                <span className="font-bold text-sm text-white">Menu &amp; Fitur Proyek</span>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mobile-menu-close-btn"
                title="Tutup Menu"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mobile-menu-body">
              {/* Identitas Kelompok VI */}
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg mb-3">
                <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5 mb-1">
                  <Target size={12} /> KELOMPOK VI &bull; KANAL 44 UHF (658 MHz)
                </div>
                <div className="text-3xs text-slate-300">
                  Departemen Teknik Elektro &bull; FTEIC Institut Teknologi Sepuluh Nopember
                </div>
              </div>

              {/* Menu Actions */}
              <div className="flex flex-col gap-1.5">
                {/* Mode Layar Penuh */}
                <button
                  type="button"
                  className="mobile-menu-item"
                  onClick={() => {
                    toggleFullscreen();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {isFullscreen ? (
                    <Minimize size={16} className="text-cyan-400" />
                  ) : (
                    <Maximize size={16} className="text-cyan-400" />
                  )}
                  <div>
                    <div className="font-medium text-xs text-white">
                      {isFullscreen ? 'Keluar Mode Layar Penuh' : 'Mode Layar Penuh (Fullscreen)'}
                    </div>
                    <div className="text-3xs text-slate-400">Tampilan 3D maksimum satu layar penuh</div>
                  </div>
                </button>

                {/* Buka Pengaturan Panel */}
                <button
                  type="button"
                  className="mobile-menu-item"
                  onClick={() => {
                    setIsPanelOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <Sliders size={16} className="text-cyan-400" />
                  <div>
                    <div className="font-medium text-xs text-white">Pengaturan Dimensi &amp; Bongkar Pasang</div>
                    <div className="text-3xs text-slate-400">Atur putaran N, foil, balun, RG-6 &amp; Smart TV</div>
                  </div>
                </button>

                {/* Monitor TV Digital DVB-T2 */}
                {isTV && (
                  <button
                    type="button"
                    className="mobile-menu-item highlight"
                    onClick={() => {
                      setIsTVMonitorOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <Tv size={16} className="text-amber-400" />
                    <div>
                      <div className="font-medium text-xs text-amber-300">Buka Monitor TV Digital DVB-T2</div>
                      <div className="text-3xs text-slate-400">Uji siaran Trans TV / Trans7 (CH 44 • 658 MHz)</div>
                    </div>
                  </button>
                )}

                {/* Landasan Teori */}
                <button
                  type="button"
                  className="mobile-menu-item"
                  onClick={() => {
                    setIsTheoryOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <BookOpen size={16} className="text-emerald-400" />
                  <div>
                    <div className="font-medium text-xs text-white">Landasan Teori &amp; Panduan Balun</div>
                    <div className="text-3xs text-slate-400">Kalkulasi impedansi self-complementary &amp; formula</div>
                  </div>
                </button>

                {/* Download Mal Cetak 1:1 SVG */}
                <button
                  type="button"
                  className="mobile-menu-item"
                  onClick={() => {
                    downloadSpiralSVG(params, metrics);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <Printer size={16} className="text-emerald-400" />
                  <div>
                    <div className="font-medium text-xs text-white">Download Mal Cetak Skala 1:1 (SVG)</div>
                    <div className="text-3xs text-slate-400">Cetak langsung ke kertas/mika untuk fabrikasi pita foil</div>
                  </div>
                </button>

                {/* Download Gambar Format Section */}
                <div className="border-t border-slate-800 my-1 pt-2">
                  <div className="text-3xs font-semibold text-slate-400 px-1 py-1 uppercase tracking-wider">
                    Download Tangkapan Layar 3D
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 mt-1">
                    <button
                      type="button"
                      className="btn-download-fmt"
                      onClick={() => {
                        handleDownloadFormat('png');
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <Download size={13} className="text-cyan-400" />
                      <span>PNG Transparan</span>
                    </button>
                    <button
                      type="button"
                      className="btn-download-fmt"
                      onClick={() => {
                        handleDownloadFormat('jpg');
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <Download size={13} className="text-amber-400" />
                      <span>JPG Studio Solid</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
