import React, { useMemo } from 'react';
import * as THREE from 'three';

interface RadiationPatternProps {
  visible?: boolean;
  scale?: number;
}

/**
 * Visualisasi Pola Radiasi 3D (Broadside Bidirectional Circular Polarization)
 * Antena spiral Archimedes planar memancarkan radiasi broadside
 * tegak lurus bidang spiral (+Z ke atas dan -Z ke bawah) dengan polarisasi sirkular (CP).
 */
export const RadiationPattern: React.FC<RadiationPatternProps> = ({
  visible = false,
  scale = 35,
}) => {
  const lobeGeometry = useMemo(() => {
    // Bangun bentuk lobus radiasi broadside: r(theta, phi) = scale * cos(theta)^1.2
    const uSegments = 40; // azimuthal phi
    const vSegments = 30; // polar theta (0 sampai pi/2)
    const positions: number[] = [];
    const normals: number[] = [];
    const colors: number[] = [];

    // LOBUS ATAS (+Z)
    for (let i = 0; i <= vSegments; i++) {
      const theta = (i / vSegments) * (Math.PI / 2); // 0 to 90 deg
      const rad = Math.cos(theta) * scale;

      for (let j = 0; j <= uSegments; j++) {
        const phi = (j / uSegments) * 2 * Math.PI;

        const x = rad * Math.sin(theta) * Math.cos(phi);
        const y = rad * Math.sin(theta) * Math.sin(phi);
        const z = rad * Math.cos(theta);

        positions.push(x, y, z);

        // normal
        const norm = new THREE.Vector3(x, y, z).normalize();
        normals.push(norm.x, norm.y, norm.z);

        // Heatmap warna radiasi: puncak merah/oranye di theta=0, memudar ke cyan/biru di sudut samping
        const gain = Math.cos(theta);
        const col = new THREE.Color().setHSL(0.55 - gain * 0.55, 0.9, 0.55);
        colors.push(col.r, col.g, col.b);
      }
    }

    const indices: number[] = [];
    const stride = uSegments + 1;
    for (let i = 0; i < vSegments; i++) {
      for (let j = 0; j < uSegments; j++) {
        const a = i * stride + j;
        const b = (i + 1) * stride + j;
        const c = (i + 1) * stride + (j + 1);
        const d = i * stride + (j + 1);

        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geo.setIndex(indices);
    return geo;
  }, [scale]);

  if (!visible) return null;

  return (
    <group name="radiation-pattern-3d">
      {/* Lobus Atas (+Z Broadside Main Lobe) */}
      <mesh geometry={lobeGeometry}>
        <meshPhysicalMaterial
          vertexColors
          transparent
          opacity={0.55}
          roughness={0.2}
          transmission={0.4}
          side={THREE.DoubleSide}
          wireframe={false}
          depthWrite={false}
        />
      </mesh>

      {/* Wireframe overlay untuk struktur grid radiasi */}
      <mesh geometry={lobeGeometry}>
        <meshBasicMaterial
          color="#38bdf8"
          wireframe
          transparent
          opacity={0.25}
        />
      </mesh>

      {/* Lobus Bawah (-Z Broadside Back Lobe) */}
      <group rotation={[Math.PI, 0, 0]}>
        <mesh geometry={lobeGeometry}>
          <meshPhysicalMaterial
            vertexColors
            transparent
            opacity={0.45}
            roughness={0.2}
            transmission={0.4}
            side={THREE.DoubleSide}
            wireframe={false}
            depthWrite={false}
          />
        </mesh>
        <mesh geometry={lobeGeometry}>
          <meshBasicMaterial
            color="#ec4899"
            wireframe
            transparent
            opacity={0.2}
          />
        </mesh>
      </group>

      {/* Panah Vektor Polarisasi Sirkular (RHCP) */}
      <group position={[0, 0, scale + 4]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[5, 0.4, 16, 32, Math.PI * 1.5]} />
          <meshStandardMaterial color="#facc15" emissive="#eab308" emissiveIntensity={0.6} />
        </mesh>
        <mesh position={[5, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <coneGeometry args={[1, 2, 16]} />
          <meshStandardMaterial color="#facc15" />
        </mesh>
      </group>
    </group>
  );
};

