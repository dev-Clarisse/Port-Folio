import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import flowersImg from "@/assets/Flowers.webp";

function FlowersPlane() {
  const ref = useRef<THREE.Mesh>(null!);
  const texture = useTexture(flowersImg);

  // Petite flottaison fluide + réaction douce au curseur
  useFrame(({ clock, pointer }) => {
    const t = clock.getElapsedTime();
    ref.current.position.y = Math.sin(t * 1.5) * 0.08;
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, pointer.x * 0.25, 0.05);
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, -pointer.y * 0.25, 0.05);
  });

  return (
    <mesh ref={ref}>
      <planeGeometry args={[2.2, 2.2]} />
      <meshBasicMaterial map={texture} transparent toneMapped={false} />
    </mesh>
  );
}

export default function FlowersGL() {
  return (
    <Canvas
      className="w-full h-full drop-shadow-[0_0_30px_var(--color-lilac-500)]"
      camera={{ position: [0, 0, 2.4], fov: 50 }}
      gl={{ alpha: true }}
      dpr={[1, 2]}
    >
      <FlowersPlane />
    </Canvas>
  );
}