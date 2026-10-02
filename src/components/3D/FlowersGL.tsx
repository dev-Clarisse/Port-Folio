import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import flowersImg from "@/assets/Flowers.webp";

function FlowersPlane() {
    const ref = useRef<THREE.Mesh>(null!);
    const texture = useTexture(flowersImg);
    const mouse = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
        };
        window.addEventListener("mousemove", onMove);
        return () => window.removeEventListener("mousemove", onMove);
    }, []);

    useFrame(({ clock }) => {
        const { x, y } = mouse.current;
        ref.current.position.y = 0.25 + Math.sin(clock.getElapsedTime()) * 0.03;
        ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, x * 0.2, 0.05);
        ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, y * 0.2, 0.05);
    });

    return (
        <mesh ref={ref}>
            <planeGeometry args={[2.4, 2.4]} />
            <meshBasicMaterial map={texture} transparent toneMapped={false} />
        </mesh>
    );
}

export default function FlowersGL() {
    return (
        <Canvas
            className="w-full h-full drop-shadow-[0_0_30px_var(--color-lilac-500)] pointer-events-none"
            style={{ width: "100%", height: "100%", pointerEvents: "none" }}
            camera={{ position: [0, 0, 2.4], fov: 50 }}
            gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
            dpr={[1, 1.5]}
            onCreated={({ gl }) => {
                const canvas = gl.domElement;
                canvas.addEventListener("webglcontextlost", (e) => e.preventDefault());
            }}
        >
            <FlowersPlane />
        </Canvas>
    );
}