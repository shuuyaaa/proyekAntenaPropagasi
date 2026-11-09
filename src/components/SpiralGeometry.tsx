import { useMemo, useRef } from 'react';
import type { FC } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import type { AntennaParams, RFMetrics } from '../types/antenna';

interface SpiralGeometryProps {
  params: AntennaParams;
  metrics?: RFMetrics;
  showFoil?: boolean;
  explodedOffset?: number; // Jarak pandangan terurai (cm)
  wireframe?: boolean;
  showCurrentAnimation?: boolean;
  showActiveRegion?: boolean;
  highlightArm?: 'none' | 'arm1' | 'arm2';
}

function createSpiralRibbonGeometry(
  params: AntennaParams,
  segmentsPerTurn: number = 180
): THREE.BufferGeometry {
  const {
    spiralType,
    turns,
    wCm,
    sCm,
    rInCm,
    foilThicknessCm,
    equiangularRate,
  } = params;

  const thetaMax = turns * 2 * Math.PI;
  const totalSegments = Math.max(90, Math.round(turns * segmentsPerTurn));
  const t = Math.max(0.01, foilThicknessCm); // tebal foil dalam cm

  const innerPts: THREE.Vector2[] = [];
  const outerPts: THREE.Vector2[] = [];

  const b = (wCm + sCm) / (2 * Math.PI);
  const a = Math.max(0.05, equiangularRate);

  for (let i = 0; i <= totalSegments; i++) {
    const frac = i / totalSegments;
    const theta = frac * thetaMax;

    let r1: number;
    let r2: number;

    if (spiralType === 'equiangular') {
      r1 = rInCm * Math.exp(a * theta);
      r2 = r1 + wCm;
    } else {
      r1 = rInCm + b * theta;
      r2 = r1 + wCm;
    }

    const cosT = Math.cos(theta);
    const sinT = Math.sin(theta);

    innerPts.push(new THREE.Vector2(r1 * cosT, r1 * sinT));
    outerPts.push(new THREE.Vector2(r2 * cosT, r2 * sinT));
  }

  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];

  const addQuad = (
    p1: [number, number, number],
    p2: [number, number, number],
    p3: [number, number, number],
    p4: [number, number, number],
    normal: [number, number, number],
    uv1: [number, number],
    uv2: [number, number],
    uv3: [number, number],
    uv4: [number, number]
  ) => {
    positions.push(...p1, ...p2, ...p3);
    normals.push(...normal, ...normal, ...normal);
    uvs.push(...uv1, ...uv2, ...uv3);

    positions.push(...p1, ...p3, ...p4);
    normals.push(...normal, ...normal, ...normal);
    uvs.push(...uv1, ...uv3, ...uv4);
  };

  // 1. TOP SURFACE (z = t)
  for (let i = 0; i < totalSegments; i++) {
    const u1 = i / totalSegments;
    const u2 = (i + 1) / totalSegments;

    const pIn1: [number, number, number] = [innerPts[i].x, innerPts[i].y, t];
    const pOut1: [number, number, number] = [outerPts[i].x, outerPts[i].y, t];
    const pIn2: [number, number, number] = [innerPts[i + 1].x, innerPts[i + 1].y, t];
    const pOut2: [number, number, number] = [outerPts[i + 1].x, outerPts[i + 1].y, t];

    addQuad(
      pIn1,
      pOut1,
      pOut2,
      pIn2,
      [0, 0, 1],
      [u1, 0],
      [u1, 1],
      [u2, 1],
      [u2, 0]
    );
  }

  // 2. BOTTOM SURFACE (z = 0)
  for (let i = 0; i < totalSegments; i++) {
    const u1 = i / totalSegments;
    const u2 = (i + 1) / totalSegments;

    const pIn1: [number, number, number] = [innerPts[i].x, innerPts[i].y, 0];
    const pOut1: [number, number, number] = [outerPts[i].x, outerPts[i].y, 0];
    const pIn2: [number, number, number] = [innerPts[i + 1].x, innerPts[i + 1].y, 0];
    const pOut2: [number, number, number] = [outerPts[i + 1].x, outerPts[i + 1].y, 0];

    addQuad(
      pIn1,
      pIn2,
      pOut2,
      pOut1,
      [0, 0, -1],
      [u1, 0],
      [u2, 0],
      [u2, 1],
      [u1, 1]
    );
  }

  // 3. INNER SIDEWALL
  for (let i = 0; i < totalSegments; i++) {
    const u1 = i / totalSegments;
    const u2 = (i + 1) / totalSegments;

    const pBot1: [number, number, number] = [innerPts[i].x, innerPts[i].y, 0];
    const pTop1: [number, number, number] = [innerPts[i].x, innerPts[i].y, t];
    const pBot2: [number, number, number] = [innerPts[i + 1].x, innerPts[i + 1].y, 0];
    const pTop2: [number, number, number] = [innerPts[i + 1].x, innerPts[i + 1].y, t];

    const dx = innerPts[i + 1].x - innerPts[i].x;
    const dy = innerPts[i + 1].y - innerPts[i].y;
    const len = Math.hypot(dx, dy) || 1;
    const nx = dy / len;
    const ny = -dx / len;

    addQuad(
      pBot1,
      pTop1,
      pTop2,
      pBot2,
      [nx, ny, 0],
      [u1, 0],
      [u1, 1],
      [u2, 1],
      [u2, 0]
    );
  }

  // 4. OUTER SIDEWALL
  for (let i = 0; i < totalSegments; i++) {
    const u1 = i / totalSegments;
    const u2 = (i + 1) / totalSegments;

    const pBot1: [number, number, number] = [outerPts[i].x, outerPts[i].y, 0];
    const pTop1: [number, number, number] = [outerPts[i].x, outerPts[i].y, t];
    const pBot2: [number, number, number] = [outerPts[i + 1].x, outerPts[i + 1].y, 0];
    const pTop2: [number, number, number] = [outerPts[i + 1].x, outerPts[i + 1].y, t];

    const dx = outerPts[i + 1].x - outerPts[i].x;
    const dy = outerPts[i + 1].y - outerPts[i].y;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;

    addQuad(
      pBot1,
      pBot2,
      pTop2,
      pTop1,
      [nx, ny, 0],
      [u1, 0],
      [u2, 0],
      [u2, 1],
      [u1, 1]
    );
  }

  // 5. START CAP (theta = 0)
  {
    const pInBot: [number, number, number] = [innerPts[0].x, innerPts[0].y, 0];
    const pOutBot: [number, number, number] = [outerPts[0].x, outerPts[0].y, 0];
    const pInTop: [number, number, number] = [innerPts[0].x, innerPts[0].y, t];
    const pOutTop: [number, number, number] = [outerPts[0].x, outerPts[0].y, t];

    addQuad(
      pInBot,
      pInTop,
      pOutTop,
      pOutBot,
      [0, -1, 0],
      [0, 0],
      [0, 1],
      [1, 1],
      [1, 0]
    );
  }

  // 6. END CAP (theta = thetaMax)
  {
    const last = totalSegments;
    const pInBot: [number, number, number] = [innerPts[last].x, innerPts[last].y, 0];
    const pOutBot: [number, number, number] = [outerPts[last].x, outerPts[last].y, 0];
    const pInTop: [number, number, number] = [innerPts[last].x, innerPts[last].y, t];
    const pOutTop: [number, number, number] = [outerPts[last].x, outerPts[last].y, t];

    const dx = outerPts[last].x - innerPts[last].x;
    const dy = outerPts[last].y - innerPts[last].y;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;

    addQuad(
      pInBot,
      pOutBot,
      pOutTop,
      pInTop,
      [nx, ny, 0],
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1]
    );
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));

  return geometry;
}

export const SpiralArms: FC<SpiralGeometryProps> = ({
  params,
  metrics,
  showFoil = true,
  explodedOffset = 0,
  wireframe = false,
  showCurrentAnimation = false,
  showActiveRegion = true,
  highlightArm = 'none',
}) => {
  const armGeometry = useMemo(() => {
    return createSpiralRibbonGeometry(params, 180);
  }, [params]);

  const matArm1Ref = useRef<THREE.MeshStandardMaterial>(null);
  const matArm2Ref = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    if (showCurrentAnimation) {
      const wavePhase1 = (Math.sin(elapsed * 5) + 1) * 0.5;
      const wavePhase2 = (Math.sin(elapsed * 5 + Math.PI) + 1) * 0.5;

      if (matArm1Ref.current) {
        matArm1Ref.current.emissive = new THREE.Color(0x38bdf8);
        matArm1Ref.current.emissiveIntensity = 0.25 + wavePhase1 * 0.45;
      }
      if (matArm2Ref.current) {
        matArm2Ref.current.emissive = new THREE.Color(0xf43f5e);
        matArm2Ref.current.emissiveIntensity = 0.25 + wavePhase2 * 0.45;
      }
    } else {
      if (matArm1Ref.current) {
        matArm1Ref.current.emissive = new THREE.Color(
          highlightArm === 'arm1' ? 0x0284c7 : 0x000000
        );
        matArm1Ref.current.emissiveIntensity = highlightArm === 'arm1' ? 0.35 : 0;
      }
      if (matArm2Ref.current) {
        matArm2Ref.current.emissive = new THREE.Color(
          highlightArm === 'arm2' ? 0xe11d48 : 0x000000
        );
        matArm2Ref.current.emissiveIntensity = highlightArm === 'arm2' ? 0.35 : 0;
      }
    }
  });

  if (!showFoil) return null;

  const rActive = metrics?.rActiveCm || 0;
  const isTargetInBand = metrics?.isTargetInBand || false;
  // Exploded spacing menggeser foil ke arah +Z (di atas board)
  const zOffset = explodedOffset;

  return (
    <group name="spiral-antenna-two-arms" position={[0, 0, zOffset]}>
      {/* LENGAN 1 (ARM 1) */}
      <mesh
        geometry={armGeometry}
        castShadow
        receiveShadow
        name="arm-1"
      >
        <meshStandardMaterial
          ref={matArm1Ref}
          color="#E2E8F0"
          metalness={0.96}
          roughness={0.16}
          wireframe={wireframe}
          envMapIntensity={1.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* LENGAN 2 (ARM 2): Rotasi 180 derajat (PI radian) terhadap sumbu Z */}
      <mesh
        geometry={armGeometry}
        rotation={[0, 0, Math.PI]}
        castShadow
        receiveShadow
        name="arm-2"
      >
        <meshStandardMaterial
          ref={matArm2Ref}
          color="#D1D5DB"
          metalness={0.96}
          roughness={0.16}
          wireframe={wireframe}
          envMapIntensity={1.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* CINCIN WILAYAH AKTIF RADIASI (ACTIVE RADIATION REGION RING) */}
      {showActiveRegion && rActive > 0 && (
        <group position={[0, 0, params.foilThicknessCm + 0.02]}>
          <mesh>
            <ringGeometry
              args={[
                Math.max(0.1, rActive - 0.08),
                rActive + 0.08,
                96,
              ]}
            />
            <meshBasicMaterial
              color={isTargetInBand ? '#10b981' : '#f43f5e'}
              transparent
              opacity={0.65}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh>
            <ringGeometry
              args={[
                Math.max(0.05, rActive - 0.02),
                rActive + 0.02,
                96,
              ]}
            />
            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={0.9}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      )}
    </group>
  );
};
