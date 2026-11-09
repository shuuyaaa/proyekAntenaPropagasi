import type { FC } from 'react';
import * as THREE from 'three';
import type { AntennaParams } from '../types/antenna';

interface SubstrateBoardProps {
  params: AntennaParams;
  showSubstrate?: boolean;
  wireframe?: boolean;
}

export const SubstrateBoard: FC<SubstrateBoardProps> = ({
  params,
  showSubstrate = true,
  wireframe = false,
}) => {
  const { substrateWidthCm, substrateLengthCm, substrateThicknessCm } = params;

  if (!showSubstrate) return null;

  // Substrat diletakkan tepat di bawah z = 0 (z = -thickness/2)
  const centerZ = -substrateThicknessCm / 2;
  const cornerOffset = substrateWidthCm / 2 - 0.8; // 8 mm dari sudut

  return (
    <group name="substrate-assembly">
      {/* Papan Dielektrik Akrilik Bening / FR4 dalam Centimeter */}
      <mesh
        position={[0, 0, centerZ]}
        receiveShadow
        castShadow
        name="substrate-mesh"
      >
        <boxGeometry
          args={[substrateWidthCm, substrateLengthCm, substrateThicknessCm]}
        />
        <meshPhysicalMaterial
          color="#dbeafe"
          transmission={0.88}
          opacity={0.85}
          transparent={true}
          roughness={0.14}
          metalness={0.05}
          ior={1.49}
          thickness={substrateThicknessCm}
          wireframe={wireframe}
          clearcoat={0.9}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Garis bevel tepi substrate */}
      <lineSegments position={[0, 0, centerZ]}>
        <edgesGeometry
          args={[new THREE.BoxGeometry(substrateWidthCm, substrateLengthCm, substrateThicknessCm)]}
        />
        <lineBasicMaterial color="#94a3b8" transparent opacity={0.4} />
      </lineSegments>

      {/* 4 Lubang Baut / Corner Standoffs (M3 mounting pads) */}
      {[
        [-cornerOffset, -cornerOffset],
        [cornerOffset, -cornerOffset],
        [-cornerOffset, cornerOffset],
        [cornerOffset, cornerOffset],
      ].map(([x, y], idx) => (
        <group key={`corner-${idx}`} position={[x, y, centerZ]}>
          <mesh position={[0, 0, substrateThicknessCm / 2 + 0.002]}>
            <ringGeometry args={[0.18, 0.35, 24]} />
            <meshStandardMaterial
              color="#d97706"
              metalness={0.9}
              roughness={0.2}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh position={[0, 0, -substrateThicknessCm / 2 - 0.002]}>
            <ringGeometry args={[0.18, 0.35, 24]} />
            <meshStandardMaterial
              color="#d97706"
              metalness={0.9}
              roughness={0.2}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry
              args={[0.16, 0.16, substrateThicknessCm + 0.04, 20]}
            />
            <meshStandardMaterial
              color="#475569"
              metalness={0.85}
              roughness={0.3}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
};
