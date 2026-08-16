import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Edges, Billboard, Text } from "@react-three/drei";
import { useRef } from "react";
import type { Mesh, Group } from "three";

const VERTEX_LABELS: { position: [number, number, number]; label: string }[] = [
    { position: [1.8, 0, 0], label: "React" },
    { position: [-1.8, 0, 0], label: "React" },
    { position: [0, 1.8, 0], label: "React" },
    { position: [0, -1.8, 0], label: "React" },
    { position: [0, 0, 1.8], label: "React" },
    { position: [0, 0, 1.8], label: "React" },
    { position: [0, 0, -1.8], label: "React" },
]

function Crystal() {
    const meshRef = useRef<Mesh>(null);
    const groupRef = useRef<Group>(null);

    useFrame((_, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.3;
            groupRef.current.rotation.x += delta * 0.1;
            groupRef.current.rotation.z += delta * 0.3;
        }
    });

    return (
        <group ref={groupRef}>

            <mesh ref={meshRef}>
                <octahedronGeometry args={[1.5, 0]} />
                <meshPhysicalMaterial
                    flatShading={true}
                    color='#6247aa'
                    transmission={0.9}
                    roughness={0.1}
                    thickness={1.5}
                    emissive="#dac3e8"
                    emissiveIntensity={0.1}
                />
                
                <Edges color="#dec9e9" threshold={0.3} />
            </mesh>

            {VERTEX_LABELS.map(({ position, label }) => (

                <Billboard key={label} position={position}>
                    <Text
                        fontSize={0.22}
                        color="#dec9e9"
                        anchorX="center"
                        anchorY="middle"
                        // outlineWidth={0.01}
                        // outlineColor="#4e148c"
                    >
                        {label}
                    </Text>
                </Billboard>

            ))}
        </group>
    );
}

export default function CrystalScene() {
    return (
        <div className="w-full h-[500px]">
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                <ambientLight intensity={1} />
                <pointLight position={[5, 5, 5]} intensity={2} color="#c8a2d8" />
                <pointLight position={[-5, -5, -5]} intensity={1} color="#e6ccff" />
                <Environment preset="studio" />
                <Crystal />
                <OrbitControls enableZoom={true} enablePan={false} />
            </Canvas>
        </div>
    );
}