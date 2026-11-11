"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getHeroImages } from "@/lib/images";

const vertexShader = `
  uniform float uScrollVelocity;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 pos = position;
    // Curved cylinder bend during high-velocity scroll
    float bend = sin(uv.y * 3.14159265) * (uScrollVelocity * 0.08);
    pos.z += bend;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture1;
  uniform sampler2D uTexture2;
  uniform float uProgress;
  uniform float uMouseVelocity;
  uniform float uTime;
  varying vec2 vUv;

  // Simple pseudo noise
  float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    vec2 uv = vUv;

    // Subtle RGB shift on mouse velocity
    float shift = clamp(uMouseVelocity * 0.012, -0.02, 0.02);

    vec4 tex1R = texture2D(uTexture1, uv + vec2(shift, 0.0));
    vec4 tex1G = texture2D(uTexture1, uv);
    vec4 tex1B = texture2D(uTexture1, uv - vec2(shift, 0.0));
    vec4 color1 = vec4(tex1R.r, tex1G.g, tex1B.b, 1.0);

    vec4 tex2R = texture2D(uTexture2, uv + vec2(shift, 0.0));
    vec4 tex2G = texture2D(uTexture2, uv);
    vec4 tex2B = texture2D(uTexture2, uv - vec2(shift, 0.0));
    vec4 color2 = vec4(tex2R.r, tex2G.g, tex2B.b, 1.0);

    // Noise dissolve calculation
    float noise = rand(uv * 10.0 + fract(uTime * 0.05));
    float dissolve = smoothstep(uProgress - 0.1, uProgress + 0.1, noise);

    vec4 finalColor = mix(color2, color1, dissolve);
    gl_FragColor = finalColor;
  }
`;

function ShaderPlane() {
  const meshRef = useRef<THREE.Mesh>(null);
  const textureLoader = useMemo(() => new THREE.TextureLoader(), []);

  const textures = useMemo<[THREE.Texture, THREE.Texture]>(() => {
    const heroPool = getHeroImages();
    const src1 = heroPool[0]?.src1280 || "/brand/og-image.jpg";
    const src2 = heroPool[1]?.src1280 || src1;

    const t1 = textureLoader.load(src1);
    const t2 = textureLoader.load(src2);
    t1.minFilter = THREE.LinearFilter;
    t2.minFilter = THREE.LinearFilter;
    return [t1, t2];
  }, [textureLoader]);

  const scrollVelocity = useRef(0);
  const mouseVelocity = useRef(0);
  const lastScrollY = useRef(0);
  const lastMousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let lastTime = performance.now();

    const onScroll = () => {
      const currentScrollY = window.scrollY;
      const now = performance.now();
      const dt = Math.max(now - lastTime, 16);
      const dy = currentScrollY - lastScrollY.current;
      scrollVelocity.current = (dy / dt) * 0.5;
      lastScrollY.current = currentScrollY;
      lastTime = now;
    };

    const onMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      mouseVelocity.current = Math.sqrt(dx * dx + dy * dy);
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
      textures[0].dispose();
      textures[1].dispose();
    };
  }, [textures]);

  const uniforms = useMemo(
    () => ({
      uTexture1: { value: null },
      uTexture2: { value: null },
      uProgress: { value: 0 },
      uScrollVelocity: { value: 0 },
      uMouseVelocity: { value: 0 },
      uTime: { value: 0 },
    }),
    []
  );

  useFrame((state) => {
    if (!meshRef.current || !textures) return;

    scrollVelocity.current *= 0.92;
    mouseVelocity.current *= 0.9;

    const mat = meshRef.current.material as THREE.ShaderMaterial;
    mat.uniforms.uTexture1.value = textures[0];
    mat.uniforms.uTexture2.value = textures[1];
    mat.uniforms.uScrollVelocity.value = scrollVelocity.current;
    mat.uniforms.uMouseVelocity.value = mouseVelocity.current;
    mat.uniforms.uTime.value = state.clock.getElapsedTime();

    mat.uniforms.uProgress.value = (Math.sin(state.clock.getElapsedTime() * 0.5) + 1) * 0.5;
  });

  if (!textures) return null;

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[3.8, 2.4, 32, 32]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
}

export default function WebGLCanvas() {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isMobile = window.innerWidth < 768;

    const id = requestAnimationFrame(() => {
      try {
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        if (gl && !prefersReducedMotion && !isMobile) {
          setIsSupported(true);
        }
      } catch {
        setIsSupported(false);
      }
    });
    return () => cancelAnimationFrame(id);
  }, []);

  if (!isSupported) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 w-full h-screen z-0 opacity-20 transition-opacity duration-1000"
    >
      <Canvas
        camera={{ position: [0, 0, 2.8], fov: 45 }}
        gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
      >
        <ShaderPlane />
      </Canvas>
    </div>
  );
}

