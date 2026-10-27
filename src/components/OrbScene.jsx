import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import { Float, Line, Sparkles, shaderMaterial } from "@react-three/drei";
import * as THREE from "three";

const RADIUS = 1.28;
const SURFACE_RADIUS = RADIUS * 0.99;

const FresnelMaterial = shaderMaterial(
  {
    uColorA: new THREE.Color("#7fffd9"),
    uIntensity: 0.42,
    uPower: 2.6,
  },
  `
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vNormal = normalize(normalMatrix * normal);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  `
    uniform vec3 uColorA;
    uniform float uIntensity;
    uniform float uPower;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      float fresnel = pow(1.0 - abs(dot(normalize(vNormal), normalize(vViewPosition))), uPower);
      gl_FragColor = vec4(uColorA, fresnel * uIntensity);
    }
  `,
);

const GlobeSurfaceMaterial = shaderMaterial(
  {
    uTime: 0,
    uDeep: new THREE.Color("#01060a"),
    uMid: new THREE.Color("#062730"),
    uCool: new THREE.Color("#6f9bff"),
    uMint: new THREE.Color("#7fffd9"),
    uLime: new THREE.Color("#c8ff3d"),
  },
  `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vObjPosition;

    void main() {
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vNormal = normalize(normalMatrix * normal);
      vViewPosition = -mvPosition.xyz;
      vObjPosition = position;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  `
    uniform float uTime;
    uniform vec3 uDeep;
    uniform vec3 uMid;
    uniform vec3 uCool;
    uniform vec3 uMint;
    uniform vec3 uLime;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vObjPosition;

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);
      float fresnel = pow(1.0 - clamp(dot(normal, viewDir), 0.0, 1.0), 2.4);
      float latitude = clamp(normal.y * 0.5 + 0.5, 0.0, 1.0);
      float keyLight = clamp(dot(normal, normalize(vec3(-0.38, 0.58, 0.72))), 0.0, 1.0);

      float bands = sin(vObjPosition.y * 7.6 + sin(vObjPosition.x * 2.8) * 1.2);
      float mottle = sin(vObjPosition.x * 2.1 + vObjPosition.z * 1.6)
        * cos(vObjPosition.y * 3.4 - vObjPosition.z * 1.1);

      vec3 base = mix(uDeep, uMid, smoothstep(0.04, 0.92, latitude));
      base *= 0.7 + keyLight * 0.6;
      base += uMid * (0.52 + bands * 0.1 + mottle * 0.14);
      base += uCool * (1.0 - smoothstep(-0.4, 0.4, normal.y)) * 0.06;

      float scanPos = sin(uTime * 0.42) * 1.12;
      float scan = smoothstep(0.1, 0.0, abs(normal.y - scanPos));
      base += uMint * scan * 0.16;
      base += uCool * pow(scan, 5.0) * 0.35;

      vec3 rimColor = mix(uCool, uMint, smoothstep(-0.7, 0.25, normal.y));
      rimColor = mix(rimColor, uLime, smoothstep(0.55, 1.0, normal.y) * 0.22);

      float specular = pow(clamp(dot(reflect(-viewDir, normal), normalize(vec3(-0.5, 0.7, 0.6))), 0.0, 1.0), 22.0);

      vec3 color = base
        + rimColor * fresnel * 0.78
        + uMint * pow(fresnel, 4.0) * 0.16
        + vec3(0.72, 1.0, 0.95) * specular * 0.1;

      gl_FragColor = vec4(color, 1.0);
    }
  `,
);

extend({ FresnelMaterial, GlobeSurfaceMaterial });

const NODES = [
  { lat: 37.77, lon: -122.42, color: "#c8ff3d", delay: 0 },
  { lat: 40.71, lon: -74.0, color: "#7fffd9", delay: 1.2 },
  { lat: 51.5, lon: -0.12, color: "#7fffd9", delay: 2.1 },
  { lat: 52.52, lon: 13.4, color: "#c8ff3d", delay: 0.6 },
  { lat: 1.35, lon: 103.81, color: "#7fffd9", delay: 3.4 },
  { lat: 35.67, lon: 139.65, color: "#c8ff3d", delay: 4.2 },
  { lat: -33.86, lon: 151.2, color: "#9aa8ff", delay: 2.8 },
  { lat: 19.07, lon: 72.87, color: "#7fffd9", delay: 1.8 },
  { lat: -23.55, lon: -46.63, color: "#9aa8ff", delay: 5.1 },
  { lat: 48.85, lon: 2.35, color: "#7fffd9", delay: 3.9 },
];

const CONNECTIONS = [
  { from: [37.77, -122.42], to: [40.71, -74], color: "#7fffd9", delay: 0 },
  { from: [51.5, -0.12], to: [52.52, 13.4], color: "#c8ff3d", delay: 0.18 },
  { from: [1.35, 103.81], to: [35.67, 139.65], color: "#7fffd9", delay: 0.31 },
  { from: [19.07, 72.87], to: [1.35, 103.81], color: "#c8ff3d", delay: 0.52 },
  { from: [37.77, -122.42], to: [35.67, 139.65], color: "#9aa8ff", delay: 0.66 },
  { from: [48.85, 2.35], to: [-23.55, -46.63], color: "#7fffd9", delay: 0.81 },
  { from: [-33.86, 151.2], to: [1.35, 103.81], color: "#9aa8ff", delay: 0.44 },
];

function latLonToVector3(lat, lon, radius = RADIUS + 0.015) {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon);

  return new THREE.Vector3(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

function GlobePoints({ count = 1900, size = 0.01, color = "#7fffd9", opacity = 0.64 }) {
  const positions = useMemo(() => {
    const array = new Float32Array(count * 3);
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < count; i += 1) {
      const y = 1 - (i / (count - 1)) * 2;
      const radius = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = goldenAngle * i;

      array[i * 3] = Math.cos(theta) * radius * RADIUS;
      array[i * 3 + 1] = y * RADIUS;
      array[i * 3 + 2] = Math.sin(theta) * radius * RADIUS;
    }

    return array;
  }, [count]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={size}
        sizeAttenuation
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}

function GlobeGrid() {
  const latitudes = [-62, -38, -14, 10, 34, 58, 74];
  const longitudes = [0, 30, 60, 90, 120, 150];

  return (
    <group>
      {latitudes.map((latitude) => {
        const phi = THREE.MathUtils.degToRad(latitude);
        const y = Math.sin(phi) * RADIUS;
        const ringRadius = Math.cos(phi) * RADIUS;

        return (
          <mesh key={latitude} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[ringRadius, 0.0028, 6, 160]} />
            <meshBasicMaterial
              color={latitude === 10 ? "#c8ff3d" : "#7fffd9"}
              transparent
              opacity={latitude === 10 ? 0.44 : 0.2}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              toneMapped={false}
            />
          </mesh>
        );
      })}

      {longitudes.map((longitude) => (
        <mesh key={longitude} rotation={[0, THREE.MathUtils.degToRad(longitude), 0]}>
          <torusGeometry args={[RADIUS, 0.0024, 6, 160]} />
          <meshBasicMaterial
            color={longitude === 0 ? "#9aa8ff" : "#7fffd9"}
            transparent
            opacity={longitude === 0 ? 0.34 : 0.16}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function GlobeNode({ node }) {
  const halo = useRef(null);
  const ring = useRef(null);
  const position = useMemo(
    () => latLonToVector3(node.lat, node.lon, RADIUS + 0.028),
    [node.lat, node.lon],
  );

  useFrame(({ clock }) => {
    const time = clock.elapsedTime;
    const pulse = (Math.sin(time * 2.2 + node.delay) + 1) * 0.5;

    if (halo.current) {
      halo.current.scale.setScalar(1 + pulse * 1.4);
      halo.current.material.opacity = 0.16 - pulse * 0.08;
    }

    if (ring.current) {
      const ringPulse = (time * 0.38 + node.delay * 0.08) % 1;
      ring.current.scale.setScalar(0.5 + ringPulse * 2.4);
      ring.current.material.opacity = (1 - ringPulse) * 0.28;
    }
  });

  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.019, 10, 10]} />
        <meshBasicMaterial color={node.color} toneMapped={false} />
      </mesh>
      <mesh ref={halo}>
        <sphereGeometry args={[0.045, 10, 10]} />
        <meshBasicMaterial
          color={node.color}
          transparent
          opacity={0.16}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={ring}>
        <ringGeometry args={[0.055, 0.062, 24]} />
        <meshBasicMaterial
          color={node.color}
          transparent
          opacity={0.28}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function ArcPulse({ curve, delay, color }) {
  const pulse = useRef(null);

  useFrame(({ clock }) => {
    if (!pulse.current) return;
    const t = (clock.elapsedTime * 0.14 + delay) % 1;
    const point = curve.getPointAt(t);
    pulse.current.position.copy(point);
    pulse.current.scale.setScalar(0.65 + Math.sin(t * Math.PI) * 0.8);
  });

  return (
    <mesh ref={pulse}>
      <sphereGeometry args={[0.024, 8, 8]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </mesh>
  );
}

function ArcNetwork() {
  const arcs = useMemo(
    () =>
      CONNECTIONS.map((connection) => {
        const start = latLonToVector3(connection.from[0], connection.from[1]);
        const end = latLonToVector3(connection.to[0], connection.to[1]);
        const mid = start
          .clone()
          .add(end)
          .multiplyScalar(0.5)
          .normalize()
          .multiplyScalar(RADIUS + 0.56 + start.distanceTo(end) * 0.12);

        return {
          ...connection,
          curve: new THREE.QuadraticBezierCurve3(start, mid, end),
        };
      }),
    [],
  );

  return (
    <group>
      {arcs.map((arc, index) => (
        <group key={`${arc.from[0]}-${index}`}>
          <Line
            points={arc.curve.getPoints(48)}
            color={arc.color}
            lineWidth={1.1}
            transparent
            opacity={0.46}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
          <ArcPulse curve={arc.curve} delay={arc.delay} color={arc.color} />
        </group>
      ))}
    </group>
  );
}

function ScanWave({ interaction }) {
  const inner = useRef(null);
  const outer = useRef(null);

  useFrame((state, delta) => {
    if (!interaction.current) return;

    if (state.clock.elapsedTime % 8 < 0.025) {
      interaction.current.pulse = 1;
    }

    interaction.current.pulse = Math.max(0, interaction.current.pulse - delta * 0.95);
    const progress = 1 - interaction.current.pulse;

    if (inner.current) {
      inner.current.scale.setScalar(1.03 + progress * 0.95);
      inner.current.material.opacity = interaction.current.pulse * 0.72;
    }

    if (outer.current) {
      outer.current.scale.setScalar(1.08 + progress * 1.35);
      outer.current.material.opacity = interaction.current.pulse * 0.34;
    }
  });

  return (
    <group>
      <mesh ref={inner}>
        <ringGeometry args={[RADIUS + 0.07, RADIUS + 0.085, 160]} />
        <meshBasicMaterial
          color="#7fffd9"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={outer} position={[0, 0, 0.02]}>
        <ringGeometry args={[RADIUS + 0.1, RADIUS + 0.115, 160]} />
        <meshBasicMaterial
          color="#d9fff9"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function OrbitRing({ radius, tilt, speed, color, opacity = 0.26 }) {
  const orbit = useRef(null);
  const satellite = useRef(null);

  useFrame((state, delta) => {
    if (orbit.current) orbit.current.rotation.z += delta * speed;
    if (satellite.current) {
      const pulse = 0.7 + Math.sin(state.clock.elapsedTime * 2.2 + radius) * 0.3;
      satellite.current.scale.setScalar(pulse);
    }
  });

  return (
    <group rotation={tilt}>
      <mesh>
        <torusGeometry args={[radius, 0.003, 8, 220]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={opacity}
          depthWrite={false}
        />
      </mesh>
      <group ref={orbit}>
        <mesh ref={satellite} position={[radius, 0, 0]}>
          <sphereGeometry args={[0.032, 12, 12]} />
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

function ScanRing() {
  const ring = useRef(null);

  useFrame(({ clock }) => {
    if (!ring.current) return;

    const span = RADIUS * 0.84;
    const y = Math.sin(clock.elapsedTime * 0.42) * span;
    const ringRadius = Math.sqrt(Math.max(0.02, RADIUS * RADIUS - y * y)) * 1.008;

    ring.current.position.y = y;
    ring.current.scale.set(ringRadius, ringRadius, 1);
    ring.current.material.opacity = 0.28 + Math.sin(clock.elapsedTime * 1.8) * 0.05;
  });

  return (
    <mesh ref={ring} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[1, 0.0032, 6, 180]} />
      <meshBasicMaterial
        color="#7fffd9"
        transparent
        opacity={0.28}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </mesh>
  );
}

function Core({ interaction }) {
  const group = useRef(null);
  const globe = useRef(null);
  const inner = useRef(null);
  const halo = useRef(null);

  useFrame((state, delta) => {
    const { pointer, clock } = state;
    if (!group.current) return;

    const dragY = interaction.current?.spinY || 0;
    const dragX = interaction.current?.spinX || 0;
    const targetY = dragY + pointer.x * 0.22 + Math.sin(clock.elapsedTime * 0.22) * 0.07;
    const targetX = dragX - pointer.y * 0.14 + Math.cos(clock.elapsedTime * 0.17) * 0.035;

    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetY, 0.065);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetX, 0.065);
    group.current.position.y = Math.sin(clock.elapsedTime * 0.58) * 0.045;

    if (globe.current) {
      globe.current.rotation.y += delta * 0.035;
    }

    if (inner.current) {
      inner.current.rotation.y -= delta * 0.026;
      inner.current.rotation.z += delta * 0.012;
      if (inner.current.material?.uniforms?.uTime) {
        inner.current.material.uniforms.uTime.value = clock.elapsedTime;
      }
    }

    if (halo.current) {
      const scale = 1.45 + Math.sin(clock.elapsedTime * 0.82) * 0.03;
      halo.current.scale.setScalar(scale);
    }
  });

  return (
    <group ref={group}>
      <Float speed={1.1} rotationIntensity={0.08} floatIntensity={0.25}>
        <group ref={globe}>
          <mesh ref={inner}>
            <sphereGeometry args={[SURFACE_RADIUS, 96, 64]} />
            <globeSurfaceMaterial toneMapped={false} />
          </mesh>

          <mesh scale={1.006}>
            <sphereGeometry args={[SURFACE_RADIUS, 48, 48]} />
            <fresnelMaterial
              transparent
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>

          <GlobePoints />
          <GlobePoints count={320} size={0.02} color="#d9fff9" opacity={0.85} />
          <GlobeGrid />
          <ArcNetwork />

          {NODES.map((node) => (
            <GlobeNode key={`${node.lat}-${node.lon}`} node={node} />
          ))}
        </group>
      </Float>

      <ScanRing />

      <mesh ref={halo}>
        <sphereGeometry args={[RADIUS, 32, 32]} />
        <meshBasicMaterial
          color="#7fffd9"
          transparent
          opacity={0.02}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      <OrbitRing radius={1.86} tilt={[1.16, 0.2, 0.3]} speed={0.12} color="#7fffd9" opacity={0.3} />
      <OrbitRing radius={2.18} tilt={[0.76, 1.02, 0.35]} speed={-0.08} color="#9aa8ff" opacity={0.12} />
      <OrbitRing radius={2.45} tilt={[1.5, 0.2, 1.06]} speed={0.05} color="#c8ff3d" opacity={0.14} />

      <ScanWave interaction={interaction} />

      <Sparkles
        count={90}
        scale={[5.5, 5.5, 5.5]}
        size={1.2}
        speed={0.26}
        opacity={0.32}
        color="#bffff2"
        noise={0.35}
      />
    </group>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.24} />
      <directionalLight position={[4, 5, 4]} intensity={2.4} color="#f7ffe9" />
      <pointLight position={[-3.2, 2.2, 2.6]} intensity={14} color="#baff72" />
      <pointLight position={[3.6, -2.4, 2.4]} intensity={20} color="#c8ff3d" />
      <pointLight position={[0, -3, -2]} intensity={9} color="#e6ffb0" />
    </>
  );
}

export default function OrbScene() {
  const interaction = useRef({ spinX: 0, spinY: 0, pulse: 1 });
  const container = useRef(null);

  useEffect(() => {
    const element = container.current;
    if (!element) return;

    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let moved = 0;

    const onDragStart = (event) => {
      if (event.button !== 0) return;
      dragging = true;
      moved = 0;
      lastX = event.clientX;
      lastY = event.clientY;
      element.classList.add("is-dragging");
      element.setPointerCapture?.(event.pointerId);
    };

    const onDragMove = (event) => {
      if (!dragging) return;

      const deltaX = event.clientX - lastX;
      const deltaY = event.clientY - lastY;
      lastX = event.clientX;
      lastY = event.clientY;
      moved += Math.abs(deltaX) + Math.abs(deltaY);

      interaction.current.spinY += deltaX * 0.0055;
      interaction.current.spinX = THREE.MathUtils.clamp(
        interaction.current.spinX + deltaY * 0.0035,
        -0.7,
        0.7,
      );
    };

    const onDragEnd = (event) => {
      dragging = false;
      element.classList.remove("is-dragging");
      if (element.hasPointerCapture?.(event.pointerId)) {
        element.releasePointerCapture(event.pointerId);
      }
    };

    const onScan = () => {
      if (moved < 6) interaction.current.pulse = 1;
    };

    element.addEventListener("pointerdown", onDragStart);
    window.addEventListener("pointermove", onDragMove);
    window.addEventListener("pointerup", onDragEnd);
    element.addEventListener("click", onScan);

    return () => {
      element.removeEventListener("pointerdown", onDragStart);
      window.removeEventListener("pointermove", onDragMove);
      window.removeEventListener("pointerup", onDragEnd);
      element.removeEventListener("click", onScan);
    };
  }, []);

  return (
    <div className="orb-scene" ref={container}>
      <Canvas
        camera={{ position: [0, 0, 6.6], fov: 38 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        className="orb-canvas"
      >
        <Suspense fallback={null}>
          <Lights />
          <Core interaction={interaction} />
        </Suspense>
      </Canvas>
    </div>
  );
}
