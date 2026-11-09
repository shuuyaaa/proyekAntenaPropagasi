import type { FC } from 'react';
import { Html } from '@react-three/drei';
import type { AntennaParams, RFMetrics } from '../types/antenna';

interface DimensionOverlayProps {
  params: AntennaParams;
  metrics: RFMetrics;
  showGrid?: boolean;
  showDimensions?: boolean;
  showAxes?: boolean;
}

export const DimensionOverlay: FC<DimensionOverlayProps> = ({
  params,
  metrics,
  showGrid = true,
  showDimensions = true,
  showAxes = true,
}) => {
  const { substrateWidthCm, substrateLengthCm, rInCm } = params;
  const { rOutCm, rActiveCm } = metrics;

  const halfW = substrateWidthCm / 2;
  const halfL = substrateLengthCm / 2;
  const caliperOffset = 0.8; // cm

  return (
    <group name="dimension-overlay">
      {/* 1. GRID BANTU (PADA BIDANG Z = 0.002 cm) */}
      {showGrid && (
        <group position={[0, 0, 0.002]}>
          <gridHelper
            args={[substrateWidthCm, 10, 0x38bdf8, 0x334155]}
            rotation={[Math.PI / 2, 0, 0]}
          />
          {/* Lingkaran batas r_in */}
          <mesh rotation={[0, 0, 0]}>
            <ringGeometry args={[rInCm - 0.01, rInCm + 0.01, 64]} />
            <meshBasicMaterial color="#f59e0b" transparent opacity={0.5} />
          </mesh>
          {/* Lingkaran batas r_out */}
          <mesh rotation={[0, 0, 0]}>
            <ringGeometry args={[rOutCm - 0.015, rOutCm + 0.015, 64]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.5} />
          </mesh>
        </group>
      )}

      {/* 2. SUMBU KOORDINAT 3D */}
      {showAxes && (
        <group position={[0, 0, 0.005]}>
          <axesHelper args={[halfW * 0.45]} />
        </group>
      )}

      {/* 3. PENANDA DIMENSI KALIPER DALAM SATUAN CENTIMETER (cm) */}
      {showDimensions && (
        <group name="caliper-labels">
          {/* Garis Dimensi Horizontal Bawah */}
          <group position={[0, -halfL - caliperOffset, 0]}>
            <lineSegments>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  args={[
                    new Float32Array([
                      -halfW, 0, 0,
                      halfW, 0, 0,
                      -halfW, -0.2, 0,
                      -halfW, 0.2, 0,
                      halfW, -0.2, 0,
                      halfW, 0.2, 0,
                    ]),
                    3,
                  ]}
                />
              </bufferGeometry>
              <lineBasicMaterial color="#38bdf8" linewidth={1.5} />
            </lineSegments>

            <Html position={[0, -0.4, 0]} center distanceFactor={22}>
              <div className="dimension-pill">
                <span>{substrateWidthCm.toFixed(1)} cm</span>
              </div>
            </Html>
          </group>

          {/* Garis Dimensi Vertikal Kanan */}
          <group position={[halfW + caliperOffset, 0, 0]}>
            <lineSegments>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  args={[
                    new Float32Array([
                      0, -halfL, 0,
                      0, halfL, 0,
                      -0.2, -halfL, 0,
                      0.2, -halfL, 0,
                      -0.2, halfL, 0,
                      0.2, halfL, 0,
                    ]),
                    3,
                  ]}
                />
              </bufferGeometry>
              <lineBasicMaterial color="#38bdf8" linewidth={1.5} />
            </lineSegments>

            <Html position={[0.4, 0, 0]} center distanceFactor={22}>
              <div className="dimension-pill">
                <span>{substrateLengthCm.toFixed(1)} cm</span>
              </div>
            </Html>
          </group>

          {/* Penanda Diameter Luar Antena Spiral 2*r_out */}
          <group position={[0, halfL + caliperOffset, 0]}>
            <lineSegments>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  args={[
                    new Float32Array([
                      -rOutCm, 0, 0,
                      rOutCm, 0, 0,
                      -rOutCm, -0.15, 0,
                      -rOutCm, 0.15, 0,
                      rOutCm, -0.15, 0,
                      rOutCm, 0.15, 0,
                    ]),
                    3,
                  ]}
                />
              </bufferGeometry>
              <lineBasicMaterial color="#f59e0b" linewidth={1.5} />
            </lineSegments>

            <Html position={[0, 0.4, 0]} center distanceFactor={22}>
              <div className="dimension-pill-rf">
                <span>2·r_out = {(2 * rOutCm).toFixed(1)} cm</span>
              </div>
            </Html>
          </group>

          {/* Penanda Cincin Aktif 658 MHz */}
          {rActiveCm > 0 && (
            <group position={[0, 0, 0.01]}>
              <Html position={[rActiveCm * 0.7, rActiveCm * 0.7, 0]} center distanceFactor={24}>
                <div className="dimension-pill-active">
                  <span>r_aktif = {rActiveCm.toFixed(2)} cm (CH 44)</span>
                </div>
              </Html>
            </group>
          )}
        </group>
      )}
    </group>
  );
};
