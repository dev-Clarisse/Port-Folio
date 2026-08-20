import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Edges, Billboard, Text, PerspectiveCamera, View } from "@react-three/drei";
import { useRef } from "react";
import type { Mesh, Group } from "three";

type GeometryType = "tetrahedron" | "octahedron" | "icosahedron";

type VertexLabel = { position: [number, number, number]; label: string };

const LABELS_BY_GEOMETRY: Record<GeometryType, VertexLabel[]> = {

    tetrahedron: [

        { position: [1, 1, 1], label: "TypeScript" },
        { position: [-1, -1, 1], label: "React" },
        { position: [-1, 1, -1], label: "Tailwind CSS" },
        { position: [1, -1, -1], label: "REST APIs" },
    ],

    octahedron: [
        { position: [1.8, 0, 0], label: "Java" },
        { position: [-1.8, 0, 0], label: "PHP" },
        { position: [0, 1.8, 0], label: "Spring / Spring Boot" },
        { position: [0, -1.8, 0], label: "PostgreSQL" },
        { position: [0, 0, 1.8], label: "Docker" },
        { position: [0, 0, -1.8], label: "Python / Scikit-learn" },
    ],

    icosahedron: [
        { position: [0, 1, 1.5], label: "Angular" },
        { position: [0, -1, 1.5], label: "JavaScript" },
        { position: [1, 1.5, 0], label: "HTML5 / CSS3 / SCSS" },
        { position: [-1, 1.5, 0], label: "Git / GitFlow" },
        { position: [1.5, 0, 1], label: "" },
        { position: [-1.5, 0, 1], label: "React Native" },
        { position: [0, 1, -1.5], label: "Expo" },
        { position: [0, -1, -1.5], label: "Stripe" },
        { position: [1, -1.5, 0], label: "EmailJS" },
        { position: [-1, -1.5, 0], label: "" },
        { position: [1.5, 0, -1], label: "Web Audio API" },
        { position: [-1.5, 0, -1], label: "LaTeX" },
    ],
};


function Crystal({ geometry = "octahedron" }: { geometry?: GeometryType }) {
    const meshRef = useRef<Mesh>(null);
    const groupRef = useRef<Group>(null);

    useFrame((_, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.2;
            groupRef.current.rotation.x += delta * 0.2;
            groupRef.current.rotation.z += delta * 0.2;
        }
    });

    const labels = LABELS_BY_GEOMETRY[geometry];

    return (
        <group ref={groupRef}>

            <mesh ref={meshRef}>
                {geometry === "tetrahedron" && <tetrahedronGeometry args={[1.5, 0]} />}
                {geometry === "octahedron" && <octahedronGeometry args={[1.5, 0]} />}
                {geometry === "icosahedron" && <icosahedronGeometry args={[1.5, 0]} />}
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

            {labels.map(({ position, label }) => (

                <Billboard key={label} position={position}>
                    <Text
                        fontSize={0.22}
                        color="#dec9e9"
                        anchorX="center"
                        anchorY="middle"
                        outlineWidth={0.01}
                        outlineColor="#4e148c"
                    >
                        {label}
                    </Text>
                </Billboard>

            ))}
        </group>
    );
}

function SceneContent({
    cameraPosition,
    geometry,
}: {
    cameraPosition: [number, number, number];
    geometry?: GeometryType;
}) {
    return (
        <>
            <PerspectiveCamera makeDefault position={cameraPosition} fov={50} />
            <ambientLight intensity={1} />
            <pointLight position={[5, 5, 5]} intensity={2} color="#c8a2d8" />
            <pointLight position={[-5, -5, -5]} intensity={1} color="#e6ccff" />
            <Environment resolution={128} frames={1} preset="studio" />
            <Crystal geometry={geometry} />
            <OrbitControls enablePan={false} enableZoom={false} />
        </>
    );
}

export default function CrystalScene() {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <div ref={containerRef} className="relative w-full h-[600px] flex gap-4">
            <View className="w-1/3 h-full">
                <SceneContent cameraPosition={[8, 0, 0]} geometry="tetrahedron" />
            </View>

            <View className="w-1/3 h-full">
                <SceneContent cameraPosition={[0, 8, 0]} geometry="octahedron" />
            </View>

            <View className="w-1/3 h-full">
                <SceneContent cameraPosition={[0, 0, 8]} geometry="icosahedron" />
            </View>

            <Canvas
                dpr={[1, 1.5]}
                className="!absolute !inset-0 !pointer-events-none"
                eventSource={containerRef as React.RefObject<HTMLElement>}
                eventPrefix="client"
            >
                <View.Port />
            </Canvas>
        </div>


    );
}