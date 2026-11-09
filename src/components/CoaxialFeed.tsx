import { useMemo, useRef } from 'react';
import type { FC } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type {
  AntennaParams,
  RFMetrics,
  ModularAssemblySettings,
} from '../types/antenna';

interface CoaxialFeedProps {
  params: AntennaParams;
  metrics: RFMetrics;
  assembly: ModularAssemblySettings;
}

interface TVScreenDisplayProps {
  isTargetInBand: boolean;
  selectedStation: string;
  targetChannel: number;
  signalQualityPercent: number;
  sleeveLength: number;
}

function TVScreenDisplay({
  isTargetInBand,
  selectedStation,
  targetChannel,
  signalQualityPercent,
  sleeveLength,
}: TVScreenDisplayProps) {
  const canvas = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 1024;
    c.height = 576;
    return c;
  }, []);

  const textureRef = useRef<THREE.CanvasTexture>(null);

  useFrame(({ clock }) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const t = clock.getElapsedTime();
    const w = canvas.width;
    const h = canvas.height;

    if (isTargetInBand) {
      // Sinyal Bagus: Siaran Langsung Berwarna dengan studio gradient
      const bgGrad = ctx.createLinearGradient(0, 0, w, h);
      bgGrad.addColorStop(0, '#0c1e3d');
      bgGrad.addColorStop(0.5, '#162b55');
      bgGrad.addColorStop(1, '#060f22');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Gelombang visual dinamis simulasi video siaran
      ctx.fillStyle = 'rgba(56, 189, 248, 0.08)';
      ctx.beginPath();
      for (let x = 0; x < w; x += 20) {
        const y = h * 0.55 + Math.sin(x * 0.01 + t * 2) * 40 + Math.cos(x * 0.02 - t) * 20;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fill();

      // Top Header: Logo Stasiun & Badge DVB-T2
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, w, 80);

      // Logo Stasiun TV (Kelompok 6: Trans TV / Trans7)
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 36px Inter, sans-serif';
      ctx.fillText(selectedStation.toUpperCase(), 40, 52);

      // Badge Resolusi & MUX
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 22px "JetBrains Mono", monospace';
      ctx.fillText(`CH ${targetChannel} UHF (658 MHz) • DVB-T2 1080p FHD`, w - 540, 52);

      // LIVE ON AIR Red Dot
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(w - 60, 45, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px Inter, sans-serif';
      ctx.fillText('LIVE', w - 120, 52);

      // Kartu Program Berita / Siaran Tengah
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(60, 130, w - 120, 300, 16);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 38px Inter, sans-serif';
      ctx.fillText('UJI TRANSMISI SIARAN TV DIGITAL — KELOMPOK VI', 90, 190);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '24px Inter, sans-serif';
      ctx.fillText('Mata Kuliah: EL234504 Antena & Propagasi Radio • Teknik Elektro FTEIC ITS', 90, 235);

      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 28px "JetBrains Mono", monospace';
      ctx.fillText(`Kekuatan Sinyal: ${signalQualityPercent}%  |  SNR: 28.5 dB  |  BER: 0.00e-6`, 90, 290);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '22px Inter, sans-serif';
      ctx.fillText(`Pencatuan: Kabel Koaksial RG-6 75 Ω + Balun Sleeve λ/4 (Panjang ≈ ${sleeveLength.toFixed(1)} cm)`, 90, 340);
      ctx.fillText('Resonansi Cincin Aktif Terpenuhi: r_active = 7.25 cm di dalam rentang spiral', 90, 380);

      // Bottom News Ticker (Running Text)
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, h - 70, w, 70);

      ctx.fillStyle = '#ef4444';
      ctx.fillRect(0, h - 70, 180, 70);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px Inter, sans-serif';
      ctx.fillText('BREAKING', 30, h - 28);

      const tickerX = (w - ((t * 120) % (w + 800)));
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '22px Inter, sans-serif';
      ctx.fillText('ANTENA SPIRAL ARCHIMEDES DUA LENGAN BERHASIL MENERIMA SIARAN TRANS TV & TRANS7 SECARA JERNIH • POLARISASI SIRKULAR ANTI MULTIPATH FADING •', tickerX, h - 28);
    } else {
      // Sinyal Di Luar Rentang Geometri (Layar Biru DVB-T2 Standar TV Digital)
      const bgGrad = ctx.createLinearGradient(0, 0, w, h);
      bgGrad.addColorStop(0, '#003366');
      bgGrad.addColorStop(1, '#001a33');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Header Bar
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(0, 0, w, 80);

      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 36px Inter, sans-serif';
      ctx.fillText(selectedStation.toUpperCase(), 40, 52);

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 22px "JetBrains Mono", monospace';
      ctx.fillText(`CH ${targetChannel} UHF (658 MHz) • TUNER SEARCHING`, w - 540, 52);

      // Kartu Info Pencarian Sinyal
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(80, 140, w - 160, 280, 16);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#f87171';
      ctx.font = 'bold 36px Inter, sans-serif';
      ctx.fillText('FREKUENSI KANAL 44 DI LUAR JANGKAUAN GEOMETRI', 120, 205);

      ctx.fillStyle = '#e2e8f0';
      ctx.font = '22px Inter, sans-serif';
      ctx.fillText('Panjang gelombang resonansi λ = 45.56 cm membutuhkan cincin aktif r_active = 7.25 cm.', 120, 260);
      ctx.fillText('Jari-jari luar saat ini terlalu kecil untuk menangkap sinyal Kanal 44 (658 MHz).', 120, 300);

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 22px Inter, sans-serif';
      ctx.fillText('SOLUSI: Tambah Jumlah Putaran (N ≥ 3.5) atau perlebar pita foil (w ≥ 1.0 cm)', 120, 355);

      // Bottom Bar
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, h - 70, w, 70);
      ctx.fillStyle = '#f59e0b';
      ctx.font = '22px "JetBrains Mono", monospace';
      ctx.fillText(`STATUS: OUT-OF-BAND (Target: 658 MHz) • BALUN 75 Ω TERPASANG`, 40, h - 28);
    }

    if (textureRef.current) {
      textureRef.current.needsUpdate = true;
    }
  });

  return (
    <mesh position={[0, 5.0, 0.32]}>
      <planeGeometry args={[15.4, 9.0]} />
      <meshBasicMaterial toneMapped={false}>
        <canvasTexture ref={textureRef} attach="map" args={[canvas]} />
      </meshBasicMaterial>
    </mesh>
  );
}

export const CoaxialFeed: FC<CoaxialFeedProps> = ({
  params,
  metrics,
  assembly,
}) => {
  const { rInCm, substrateThicknessCm, balunType, selectedStation, targetChannel } = params;
  const { targetLambdaCm, isTargetInBand, signalQualityPercent } = metrics;
  const {
    showBalun,
    showRG6Cable,
    showFConnector,
    showTVJack,
    showRealTV,
    explodedSpacing,
  } = assembly;

  const feedSeparation = Math.min(0.3, rInCm * 0.7);
  const bottomZ = -substrateThicknessCm;

  // Jarak pemisah saat mode pandangan terurai (Exploded View Spacing in cm)
  const exp = explodedSpacing * 4.0;

  // Panjang balun sleeve lambda / 4 pada frekuensi kerja 658 MHz (~11.4 cm)
  const sleeveLength = Math.min(6.5, (targetLambdaCm / 4) * 0.5);

  // ===================================================================
  // POSISI PERANGKAT TV & PORT ANTENA (Dalam Koordinat Antena Group)
  // Di mana Z = normal board (menghadap atas), X = kanan, Y = depan/belakang
  // ===================================================================
  const tvBasePos = useMemo(() => {
    return new THREE.Vector3(
      22.0 + exp * 2.5, // X: Di sebelah kanan papan antena
      -6.0 - exp * 1.5, // Y: Sedikit ke depan
      1.0               // Z: Berdiri di atas bidang meja
    );
  }, [exp]);

  // Port RF TV berada di panel belakang/kiri samping TV
  const tvPortPos = useMemo(() => {
    return new THREE.Vector3(
      tvBasePos.x - 5.5,
      tvBasePos.y + 0.5,
      tvBasePos.z + 4.5
    );
  }, [tvBasePos]);

  // ===================================================================
  // GEOMETRI KABEL KOAKSIAL RG-6 MELENGKUNG REALISTIS (3D CURVED TUBE)
  // Menghubungkan titik umpan/balun antena langsung ke port RF di belakang TV
  // ===================================================================
  const { cableGeometry, cablePoints } = useMemo(() => {
    const pStart = new THREE.Vector3(0, 0, bottomZ - (showBalun ? sleeveLength : 0.5) - exp * 0.8);
    const pDrop = new THREE.Vector3(2.5, -2.0, bottomZ - 2.5 - exp * 0.8);
    const pMid1 = new THREE.Vector3(8.0, -8.0, -1.0);
    const pMid2 = new THREE.Vector3(15.0, -10.0, 0.5);
    const pApproach = new THREE.Vector3(
      tvPortPos.x - 3.5 - exp * 1.2,
      tvPortPos.y - 1.5,
      tvPortPos.z - 0.5
    );
    const pEnd = new THREE.Vector3(
      tvPortPos.x - 1.2 - exp * 0.6,
      tvPortPos.y,
      tvPortPos.z
    );

    const curve = new THREE.CatmullRomCurve3([
      pStart,
      pDrop,
      pMid1,
      pMid2,
      pApproach,
      pEnd,
    ]);

    const geom = new THREE.TubeGeometry(curve, 64, 0.28, 16, false);
    return { cableGeometry: geom, cablePoints: { pStart, pEnd, pApproach } };
  }, [bottomZ, sleeveLength, exp, showBalun, tvPortPos]);

  return (
    <group name="modular-coaxial-feed-assembly">
      {/* ===============================================================
          1. TERMINAL PIN UMPAN SEIMBANG DI PUSAT ANTENA BOARD (Z = 0)
          =============================================================== */}
      <group name="feed-pins">
        {/* Terminal Inti Lengan 1 (+X) */}
        <mesh position={[feedSeparation / 2, 0, bottomZ / 2]}>
          <cylinderGeometry args={[0.06, 0.06, substrateThicknessCm + 0.1, 16]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.95} roughness={0.2} />
        </mesh>
        {rInCm > feedSeparation / 2 && (
          <mesh
            position={[(rInCm + feedSeparation / 2) / 2, 0, 0.008]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.045, 0.045, rInCm - feedSeparation / 2, 12]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.95} roughness={0.2} />
          </mesh>
        )}
        <mesh position={[rInCm, 0, 0.01]}>
          <sphereGeometry args={[0.09, 14, 14]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.15} />
        </mesh>

        {/* Terminal Ground Shield Lengan 2 (-X) */}
        <mesh position={[-feedSeparation / 2, 0, bottomZ / 2]}>
          <cylinderGeometry args={[0.06, 0.06, substrateThicknessCm + 0.1, 16]} />
          <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.25} />
        </mesh>
        {rInCm > feedSeparation / 2 && (
          <mesh
            position={[-(rInCm + feedSeparation / 2) / 2, 0, 0.008]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.045, 0.045, rInCm - feedSeparation / 2, 12]} />
            <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.25} />
          </mesh>
        )}
        <mesh position={[-rInCm, 0, 0.01]}>
          <sphereGeometry args={[0.09, 14, 14]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.15} />
        </mesh>
      </group>

      {/* ===============================================================
          2. BALUN MATCHING TRANSFORMER LAMBDA / 4 (ARRL Fig 20.18)
          =============================================================== */}
      {showBalun && (
        <group position={[0, 0, bottomZ - sleeveLength / 2 - exp * 0.4]}>
          {balunType === 'sleeve_bazooka' ? (
            <group name="bazooka-sleeve-balun">
              {/* Tabung Silinder Konduktor Sleeve Kuningan/Aluminium */}
              <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[0.42, 0.42, sleeveLength, 24, 1, true]} />
                <meshStandardMaterial
                  color="#94a3b8"
                  metalness={0.95}
                  roughness={0.18}
                  side={THREE.DoubleSide}
                />
              </mesh>
              {/* Cincin Shorting Ring di Pangkal Bawah Balun */}
              <mesh position={[0, 0, -sleeveLength / 2]}>
                <ringGeometry args={[0.28, 0.42, 24]} />
                <meshStandardMaterial
                  color="#64748b"
                  metalness={0.9}
                  roughness={0.2}
                  side={THREE.DoubleSide}
                />
              </mesh>
              {/* Cincin Penutup Atas */}
              <mesh position={[0, 0, sleeveLength / 2]}>
                <ringGeometry args={[0.28, 0.42, 24]} />
                <meshStandardMaterial
                  color="#cbd5e1"
                  metalness={0.95}
                  roughness={0.15}
                  side={THREE.DoubleSide}
                />
              </mesh>
            </group>
          ) : (
            <group name="coaxial-loop-balun">
              <mesh position={[0.45, 0, 0]}>
                <cylinderGeometry args={[0.25, 0.25, sleeveLength * 1.3, 16]} />
                <meshStandardMaterial color="#1e293b" roughness={0.6} />
              </mesh>
            </group>
          )}
        </group>
      )}

      {/* ===============================================================
          3. KABEL KOAKSIAL RG-6 75 OHM MELENGKUNG DARI ANTENA KE TV
          =============================================================== */}
      {showRG6Cable && (
        <group name="rg6-coaxial-cable-assembly">
          {/* Badan Kabel Koaksial Hitam Melengkung 3D */}
          <mesh geometry={cableGeometry} castShadow receiveShadow>
            <meshStandardMaterial
              color="#090d16"
              roughness={0.65}
              metalness={0.1}
            />
          </mesh>

          {/* Cincin Strain Relief / Pelindung Tekukan di Dekat Antena */}
          <mesh position={[0.8, -0.6, bottomZ - (showBalun ? sleeveLength : 0.5) - 0.5]}>
            <cylinderGeometry args={[0.34, 0.34, 0.8, 16]} />
            <meshStandardMaterial color="#334155" roughness={0.8} />
          </mesh>

          {/* Cincin Ferit / Strain Relief di Dekat Ujung TV */}
          <mesh position={[cablePoints.pApproach.x, cablePoints.pApproach.y, cablePoints.pApproach.z]}>
            <cylinderGeometry args={[0.36, 0.36, 1.0, 16]} />
            <meshStandardMaterial color="#1e293b" roughness={0.7} />
          </mesh>
        </group>
      )}

      {/* ===============================================================
          4. F-CONNECTOR RG-6 (ULIR DRAT NIKEL DENGAN HEX NUT)
          =============================================================== */}
      {showFConnector && (
        <group
          name="f-connector-rg6"
          position={[
            tvPortPos.x - 2.0 - exp * 1.0,
            tvPortPos.y,
            tvPortPos.z,
          ]}
          rotation={[0, 0, -Math.PI / 2]}
        >
          {/* Hexagonal Nut (Badan Mur Ulir) */}
          <mesh position={[0, 0.4, 0]}>
            <cylinderGeometry args={[0.48, 0.48, 0.7, 6]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.96} roughness={0.2} />
          </mesh>
          {/* Collar Ulir Drat */}
          <mesh position={[0, -0.2, 0]}>
            <cylinderGeometry args={[0.42, 0.42, 0.5, 20]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.25} />
          </mesh>
          {/* Pin Tembaga Inti Koaksial */}
          <mesh position={[0, -0.6, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.5, 12]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.95} roughness={0.2} />
          </mesh>
        </group>
      )}

      {/* ===============================================================
          5. JACK ANTENA TV IEC 169-2 BELLING-LEE MALE (PLUG KE PORT TV)
          =============================================================== */}
      {showTVJack && (
        <group
          name="iec-tv-antenna-jack"
          position={[
            tvPortPos.x - 0.8 - exp * 0.4,
            tvPortPos.y,
            tvPortPos.z,
          ]}
          rotation={[0, 0, -Math.PI / 2]}
        >
          {/* Barrel Luar Logam Mengkilap */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.48, 0.48, 1.1, 24]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.96} roughness={0.18} />
          </mesh>
          {/* Cincin Grip Plastik / Karet Abu-Abu */}
          <mesh position={[0, 0.4, 0]}>
            <cylinderGeometry args={[0.52, 0.52, 0.35, 16]} />
            <meshStandardMaterial color="#475569" roughness={0.5} />
          </mesh>
          {/* Jarum Pin Tengah Kuningan Emas */}
          <mesh position={[0, -0.8, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.6, 16]} />
            <meshStandardMaterial color="#eab308" metalness={0.95} roughness={0.2} />
          </mesh>
          {/* Tabung Grounding Shield Terbuka */}
          <mesh position={[0, -0.7, 0]}>
            <cylinderGeometry args={[0.34, 0.34, 0.4, 24, 1, true]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.2} side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}

      {/* ===============================================================
          6. PERANGKAT SMART TV 3D LENGKAP DENGAN LAYAR OUTPUT SIARAN REAL
          =============================================================== */}
      {showRealTV && (
        <group
          name="real-digital-tv-set"
          position={[tvBasePos.x, tvBasePos.y, tvBasePos.z]}
          rotation={[Math.PI / 2, 0, -Math.PI / 12]} // Menghadap sedikit diagonal ke arah pengguna
        >
          {/* Bingkai Luar TV (Bezel Tipis Modern) */}
          <mesh position={[0, 5.0, 0]} castShadow receiveShadow>
            <boxGeometry args={[16.0, 9.6, 0.6]} />
            <meshStandardMaterial color="#0b0f19" roughness={0.35} metalness={0.4} />
          </mesh>

          {/* Lis Logam Tepi Bezel Bawah */}
          <mesh position={[0, 0.3, 0.31]}>
            <boxGeometry args={[16.0, 0.2, 0.05]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
          </mesh>

          {/* Lampu Indikator Power LED Hijau */}
          <mesh position={[7.2, 0.3, 0.32]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshBasicMaterial color="#10b981" />
          </mesh>

          {/* LAYAR TV REAL DENGAN OUTPUT SIARAN LANGSUNG DVB-T2 */}
          <TVScreenDisplay
            isTargetInBand={isTargetInBand}
            selectedStation={selectedStation}
            targetChannel={targetChannel}
            signalQualityPercent={signalQualityPercent}
            sleeveLength={sleeveLength}
          />

          {/* DUDUKAN STAND KAKI TV (DESK BASE) */}
          <group name="tv-stand">
            {/* Pelat Dasar Dudukan */}
            <mesh position={[0, 0.1, 0]} receiveShadow>
              <boxGeometry args={[6.5, 0.2, 3.5]} />
              <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
            </mesh>
            {/* Tiang Penyangga TV ke Kaki */}
            <mesh position={[0, 0.8, 0]}>
              <cylinderGeometry args={[0.35, 0.35, 1.4, 16]} />
              <meshStandardMaterial color="#64748b" metalness={0.85} roughness={0.25} />
            </mesh>
          </group>

          {/* PORT ANTENA RF INPUT DI PANEL BELAKANG TV */}
          <group position={[-6.0, 4.0, -0.4]} rotation={[0, -Math.PI / 2, 0]}>
            {/* Soket Port Silinder TV RF Belling-Lee Female */}
            <mesh position={[0, 0, 0.3]}>
              <cylinderGeometry args={[0.38, 0.38, 0.6, 24]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.2} />
            </mesh>
            {/* Lubang Port Center */}
            <mesh position={[0, 0, 0.61]}>
              <ringGeometry args={[0.1, 0.36, 24]} />
              <meshStandardMaterial color="#1e293b" metalness={0.9} />
            </mesh>
            {/* Label RF IN di Casing Belakang */}
            <mesh position={[0, 0.6, 0.05]}>
              <planeGeometry args={[1.2, 0.4]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>
        </group>
      )}
    </group>
  );
};
