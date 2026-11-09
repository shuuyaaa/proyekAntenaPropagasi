import { useRef, useEffect } from 'react';
import type { FC } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import type {
  AntennaParams,
  RFMetrics,
  CameraPreset,
  VisualSettings,
  ModularAssemblySettings,
} from '../types/antenna';
import { SpiralArms } from './SpiralGeometry';
import { SubstrateBoard } from './SubstrateBoard';
import { CoaxialFeed } from './CoaxialFeed';
import { DimensionOverlay } from './DimensionOverlay';
import { RadiationPattern } from './RadiationPattern';

interface AntennaCanvasProps {
  params: AntennaParams;
  metrics: RFMetrics;
  visualSettings: VisualSettings;
  assembly: ModularAssemblySettings;
  cameraPreset: CameraPreset;
  highlightArm?: 'none' | 'arm1' | 'arm2';
}

function CameraController({
  preset,
  boardSizeCm,
}: {
  preset: CameraPreset;
  boardSizeCm: number;
}) {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);

  // Perhitungan jarak kamera presisi agar antena dan TV terbingkai sempurna (Satuan: Centimeter)
  const dTop = boardSizeCm * 1.6;
  const dSide = boardSizeCm * 1.6;

  useEffect(() => {
    if (!controlsRef.current) return;

    const controls = controlsRef.current;

    switch (preset) {
      case 'top':
        // Tampak Atas 2D: Melihat pola spiral dan jalur kabel koaksial dari atas
        controls.target.set(10.0, 0, 3.0);
        camera.position.set(10.0, dTop, 3.0);
        camera.up.set(0, 0, -1);
        break;
      case 'isometric':
        // Isometrik 3D: Sudut pandang proporsional menampilkan antena, kabel, dan TV
        controls.target.set(9.0, 2.0, 2.0);
        camera.position.set(22.0, 22.0, 28.0);
        camera.up.set(0, 1, 0);
        break;
      case 'side':
        // Tampak Samping: Melihat profil ketebalan board, balun, dan kaki TV
        controls.target.set(9.0, 2.0, 2.0);
        camera.position.set(9.0, 3.0, dSide);
        camera.up.set(0, 1, 0);
        break;
      case 'bottom':
        controls.target.set(0, 0, 0);
        camera.position.set(0, -dTop, 0);
        camera.up.set(0, 0, 1);
        break;
      case 'tv_view':
        // Setup Lengkap: Fokus melihat antena spiral tersambung kabel koaksial ke TV
        controls.target.set(10.0, 3.0, 2.0);
        camera.position.set(18.0, 20.0, 32.0);
        camera.up.set(0, 1, 0);
        break;
    }

    camera.lookAt(controls.target);
    controls.update();
  }, [preset, dTop, dSide, camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping={true}
      dampingFactor={0.06}
      minDistance={4}
      maxDistance={250}
      makeDefault
    />
  );
}

function AntennaScene({
  params,
  metrics,
  visualSettings,
  assembly,
  cameraPreset,
  highlightArm,
}: AntennaCanvasProps) {
  const boardSizeCm = Math.max(params.substrateWidthCm, params.substrateLengthCm);

  return (
    <>
      <CameraController preset={cameraPreset} boardSizeCm={boardSizeCm} />

      {/* TATA CAHAYA FOTOREALISTIS UNTUK PANTULAN ALUMINIUM FOIL */}
      <ambientLight intensity={0.75} />

      {/* Directional Light Utama */}
      <directionalLight
        position={[boardSizeCm * 0.8, boardSizeCm * 1.4, boardSizeCm * 1.0]}
        intensity={1.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />

      {/* Fill Light Spekular */}
      <directionalLight
        position={[-boardSizeCm * 1.0, boardSizeCm * 0.8, -boardSizeCm * 0.8]}
        intensity={0.8}
        color="#93c5fd"
      />

      {/* Point Light di Atas Titik Umpan */}
      <pointLight
        position={[0, 4, 0]}
        intensity={1.5}
        distance={boardSizeCm * 2}
        decay={2}
        color="#ffffff"
      />

      <Environment preset="city" />

      {/*
        ELEMEN STRUKTURAL UTAMA (SATUAN: CENTIMETER)
        rotation={[-Math.PI / 2, 0, 0]} menempatkan permukaan board di bidang horizontal XZ,
        dengan normal spiral menghadap ke +Y (Atas) sesuai standar Three.js OrbitControls!
      */}
      <group
        name="antenna-assembly"
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <SpiralArms
          params={params}
          metrics={metrics}
          showFoil={assembly.showFoil}
          explodedOffset={assembly.explodedSpacing * 2.5}
          wireframe={visualSettings.wireframe}
          showCurrentAnimation={visualSettings.showCurrentAnimation}
          showActiveRegion={visualSettings.showActiveRegion}
          highlightArm={highlightArm}
        />

        <SubstrateBoard
          params={params}
          showSubstrate={assembly.showSubstrate}
          wireframe={visualSettings.wireframe}
        />

        <CoaxialFeed
          params={params}
          metrics={metrics}
          assembly={assembly}
        />

        <DimensionOverlay
          params={params}
          metrics={metrics}
          showGrid={visualSettings.showGrid}
          showDimensions={visualSettings.showDimensions}
          showAxes={visualSettings.showAxes}
        />

        <RadiationPattern
          visible={visualSettings.showRadiationPattern}
          scale={metrics.rOutCm * 1.35}
        />
      </group>
    </>
  );
}

export const AntennaCanvas: FC<AntennaCanvasProps> = (props) => {
  const getBackgroundColor = () => {
    switch (props.visualSettings.theme) {
      case 'blueprint':
        return '#022c43';
      case 'studio':
        return '#f1f5f9';
      case 'dark':
      default:
        return '#070a13';
    }
  };

  return (
    <div className="canvas-container relative w-full h-full select-none">
      <Canvas
        camera={{
          position: [22, 22, 28],
          fov: 42,
          near: 0.1,
          far: 500,
        }}
        shadows
        gl={{
          preserveDrawingBuffer: true, // Diperlukan agar toDataURL untuk JPG/PNG jernih tanpa layar hitam
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        onCreated={({ gl, scene }) => {
          scene.background = new THREE.Color(getBackgroundColor());
          gl.setClearColor(getBackgroundColor());
        }}
      >
        <AntennaScene {...props} />
      </Canvas>
    </div>
  );
};
