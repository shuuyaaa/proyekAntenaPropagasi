import type { FC } from 'react';
import {
  Tv,
  Signal,
  Wifi,
  AlertCircle,
  Radio,
  CheckCircle2,
  X,
} from 'lucide-react';
import type { AntennaParams, RFMetrics } from '../types/antenna';
import {
  TV_CHANNELS_TABLE,
  KELOMPOK_6_STATIONS,
} from '../utils/antennaMath';

interface TVSignalMonitorProps {
  params: AntennaParams;
  setParams: React.Dispatch<React.SetStateAction<AntennaParams>>;
  metrics: RFMetrics;
  isOpen: boolean;
  onClose: () => void;
}

export const TVSignalMonitor: FC<TVSignalMonitorProps> = ({
  params,
  setParams,
  metrics,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const currentChannelInfo =
    TV_CHANNELS_TABLE.find((c) => c.channel === params.targetChannel) ||
    TV_CHANNELS_TABLE[5];

  const quality = metrics.signalQualityPercent;
  const isGood = quality >= 70;
  const isModerate = quality >= 40 && quality < 70;

  const handleSelectChannel = (chNum: number) => {
    const ch = TV_CHANNELS_TABLE.find((c) => c.channel === chNum);
    if (!ch) return;
    setParams((prev) => ({
      ...prev,
      targetChannel: chNum,
      selectedStation: ch.isKelompok6
        ? 'Trans TV HD'
        : ch.stationGroup.split(',')[0].trim(),
    }));
  };

  const handleSelectStation = (stName: string) => {
    setParams((prev) => ({
      ...prev,
      selectedStation: stName,
    }));
  };

  return (
    <div className="tv-modal-backdrop" onClick={onClose}>
      <div
        className="tv-modal-card custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header TV Monitor */}
        <div className="tv-modal-header">
          <div className="flex items-center gap-2">
            <Tv className="text-cyan-400" size={20} />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">
                  DVB-T2 Broadcast TV Receiver Output
                </span>
                <span className="badge-tv-live">
                  <span className="live-dot" /> LIVE TUNER
                </span>
              </div>
              <span className="text-xs text-slate-400">
                Penerima Siaran Televisi Digital Indonesia (Permenkominfo No. 6/2019)
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

        {/* Layar Simulasi TV (TV Screen Simulation) */}
        <div className="tv-screen-wrapper">
          <div className={`tv-screen ${!isGood && !isModerate ? 'no-signal' : ''}`}>
            {/* OSD (On-Screen Display) Info Banner */}
            <div className="tv-osd-top">
              <div className="flex items-center gap-2">
                <span className="tv-ch-number">
                  CH {currentChannelInfo.channel}
                </span>
                <span className="tv-st-name">{params.selectedStation}</span>
                {currentChannelInfo.isKelompok6 && (
                  <span className="badge-kelompok6-osd">Kelompok VI (Tugas Kita)</span>
                )}
              </div>
              <div className="tv-osd-badges">
                <span className="osd-pill">1080p FHD</span>
                <span className="osd-pill">DVB-T2</span>
                <span className="osd-pill">8 MHz BW</span>
                <span className="osd-pill">75&Omega; COAX</span>
              </div>
            </div>

            {/* Simulasi Tampilan Siaran */}
            {isGood ? (
              <div className="tv-broadcast-content broadcast-active">
                <div className="broadcast-scenery">
                  <div className="broadcast-watermark">
                    <Radio size={24} className="text-cyan-400 animate-spin" />
                    <span>{params.selectedStation}</span>
                  </div>
                  <div className="broadcast-info-card">
                    <span className="text-xs text-slate-300 font-semibold block">
                      Program: Siaran Nasional Berita &amp; Hiburan DVB-T2
                    </span>
                    <span className="text-3xs text-emerald-400 block mt-0.5">
                      Transmisi Digital Stabil &bull; SNR: 28.4 dB &bull; BER: 0.00e-6 &bull; Sinyal Optimal
                    </span>
                  </div>
                </div>
              </div>
            ) : isModerate ? (
              <div className="tv-broadcast-content broadcast-glitch">
                <div className="glitch-overlay">
                  <AlertCircle size={36} className="text-amber-400 mb-2" />
                  <span className="text-sm font-bold text-amber-300">
                    Sinyal DVB-T2 Lemah / Berbintik (Pixelated)
                  </span>
                  <span className="text-xs text-slate-400 mt-1 max-w-sm text-center">
                    Cincin aktif radiasi ({(metrics.rActiveCm).toFixed(2)} cm) berada di tepi jangkauan antena.
                    Atur jumlah putaran atau lebar pita foil agar resonansi lebih baik!
                  </span>
                </div>
              </div>
            ) : (
              <div className="tv-broadcast-content broadcast-dead">
                <div className="dead-signal-overlay">
                  <div className="noise-pattern" />
                  <div className="dead-signal-text">
                    <span className="text-lg font-bold text-rose-400 tracking-wider">
                      TIDAK ADA SINYAL (NO SIGNAL)
                    </span>
                    <span className="text-xs text-slate-300 mt-1 max-w-xs text-center">
                      Frekuensi kanal {currentChannelInfo.centerFreqMHz} MHz (&lambda; = {metrics.targetLambdaCm.toFixed(1)} cm) di luar rentang spiral!
                    </span>
                    <span className="text-2xs text-cyan-400 mt-2">
                      Solusi: Perbesar jari-jari luar (tambah N atau w) agar r_out &ge; {metrics.rActiveCm.toFixed(2)} cm.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* OSD Status Bar Bawah: Signal Strength & Signal Quality Meter */}
            <div className="tv-osd-bottom">
              <div className="grid grid-cols-2 gap-4">
                {/* Meter Kekuatan Sinyal (Signal Strength) */}
                <div>
                  <div className="flex justify-between text-2xs text-slate-300 mb-1">
                    <span className="flex items-center gap-1 font-semibold">
                      <Wifi size={11} className="text-cyan-400" />
                      Kekuatan Sinyal (RF Level)
                    </span>
                    <span className="font-mono text-cyan-300">
                      {quality > 30 ? Math.min(98, quality + 2) : quality}%
                    </span>
                  </div>
                  <div className="signal-meter-bar">
                    <div
                      className="signal-meter-fill"
                      style={{
                        width: `${quality > 30 ? Math.min(98, quality + 2) : quality}%`,
                        backgroundColor: isGood ? '#10b981' : isModerate ? '#f59e0b' : '#f43f5e',
                      }}
                    />
                  </div>
                </div>

                {/* Meter Kualitas Sinyal (Signal Quality / SNR) */}
                <div>
                  <div className="flex justify-between text-2xs text-slate-300 mb-1">
                    <span className="flex items-center gap-1 font-semibold">
                      <Signal size={11} className="text-emerald-400" />
                      Kualitas Sinyal (SNR/BER)
                    </span>
                    <span className="font-mono text-emerald-300">{quality}%</span>
                  </div>
                  <div className="signal-meter-bar">
                    <div
                      className="signal-meter-fill"
                      style={{
                        width: `${quality}%`,
                        backgroundColor: isGood ? '#10b981' : isModerate ? '#f59e0b' : '#f43f5e',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Kontrol Pemilihan Kanal & Stasiun TV */}
        <div className="tv-controls-section">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Pilih Kanal Alokasi TV Digital (Tabel 1 Permenkominfo)
            </span>
            <span className="text-2xs text-cyan-400">
              Target Kelompok VI: Kanal 44 (658 MHz)
            </span>
          </div>

          {/* Grid Tombol Kanal UHF */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
            {TV_CHANNELS_TABLE.map((ch) => (
              <button
                key={ch.channel}
                type="button"
                className={`btn-ch-selector ${
                  params.targetChannel === ch.channel ? 'active' : ''
                } ${ch.isKelompok6 ? 'is-kelompok-6' : ''}`}
                onClick={() => handleSelectChannel(ch.channel)}
              >
                <div className="ch-num">CH {ch.channel}</div>
                <div className="ch-freq">{ch.centerFreqMHz} MHz</div>
                {ch.isKelompok6 && <span className="ch-tag">Kelompok 6</span>}
              </button>
            ))}
          </div>

          {/* Pemilihan Stasiun dalam MUX */}
          <div className="station-selector-block">
            <span className="text-2xs font-semibold text-slate-400 block mb-1.5">
              Stasiun Siaran dalam MUX (Multiplexing) Terpilih:
            </span>
            {currentChannelInfo.isKelompok6 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {KELOMPOK_6_STATIONS.map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    className={`btn-station ${
                      params.selectedStation === st.name ? 'active' : ''
                    }`}
                    onClick={() => handleSelectStation(st.name)}
                  >
                    <span className="font-bold text-xs">{st.name}</span>
                    <span className="text-3xs text-slate-400 block mt-0.5">
                      {st.genre}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-300 p-2.5 rounded-lg bg-slate-900/60 border border-slate-700/60">
                Stasiun pemancar:{' '}
                <strong className="text-cyan-300">{currentChannelInfo.stationGroup}</strong>
                <span className="block text-2xs text-slate-400 mt-1">
                  Alokasi: {currentChannelInfo.assignedGroup} &bull; Rentang: {currentChannelInfo.freqRange}
                </span>
              </div>
            )}
          </div>

          {/* Diagnostik Teknis RF untuk Laporan Proyek */}
          <div className="mt-3 p-3 rounded-xl bg-slate-900/80 border border-slate-700/80 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div>
              <span className="text-2xs text-slate-400 block">Frekuensi Resonansi</span>
              <span className="font-mono text-cyan-300 font-bold">
                {currentChannelInfo.centerFreqMHz} MHz (&lambda; = {metrics.targetLambdaCm.toFixed(1)} cm)
              </span>
            </div>
            <div>
              <span className="text-2xs text-slate-400 block">Jari-Jari Cincin Aktif (r_active)</span>
              <span className="font-mono text-emerald-300 font-bold">
                {metrics.rActiveCm.toFixed(2)} cm (D_aktif = {(2 * metrics.rActiveCm).toFixed(2)} cm)
              </span>
            </div>
            <div>
              <span className="text-2xs text-slate-400 block">Status Jangkauan Geometri Antena</span>
              <span className={`font-semibold flex items-center gap-1 ${isGood ? 'text-emerald-400' : 'text-amber-400'}`}>
                {metrics.isTargetInBand ? (
                  <>
                    <CheckCircle2 size={13} />
                    Tercakup (r_in &le; r_act &le; r_out)
                  </>
                ) : (
                  <>
                    <AlertCircle size={13} />
                    Di Luar Jangkauan Antena
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
