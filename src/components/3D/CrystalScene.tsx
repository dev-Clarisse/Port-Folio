import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Edges, Billboard, Text, PerspectiveCamera, View } from "@react-three/drei";
import { useRef } from "react";
import type { Mesh, Group } from "three";

type GeometryType = "octahedron" | "octahedron2" | "octahedron3";

type VertexLabel = { position: [number, number, number]; label: string };

const LABELS_BY_GEOMETRY: Record<GeometryType, VertexLabel[]> = {

    octahedron: [
        { position: [1.8, 0, 0], label: "Spring Boot" },
        { position: [-1.8, 0, 0], label: "REST APIs" },
        { position: [0, 1.8, 0], label: "Git / GitFlow" },
        { position: [0, -1.8, 0], label: "React" },
        { position: [0, 0, 1.8], label: "Tailwind CSS" },
        { position: [0, 0, -1.8], label: "Scikit-learn" },
    ],

    octahedron3: [
        { position: [1.8, 0, 0], label: "Spring Boot" },
        { position: [-1.8, 0, 0], label: "REST APIs" },
        { position: [0, 1.8, 0], label: "Git / GitFlow" },
        { position: [0, -1.8, 0], label: "React" },
        { position: [0, 0, 1.8], label: "Tailwind CSS" },
        { position: [0, 0, -1.8], label: "Scikit-learn" },
    ],

    octahedron2: [
        { position: [1.8, 0, 0], label: "Angular" },
        { position: [-1.8, 0, 0], label: "Java" },
        { position: [0, 1.8, 0], label: "JavaScript / TypeScript" },
        { position: [0, -1.8, 0], label: "HTML5 / CSS3 / SCSS" },
        { position: [0, 0, 1.8], label: "Python" },
        { position: [0, 0, -1.8], label: "PHP" },
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
                {geometry === "octahedron" && <octahedronGeometry args={[1.5, 0]} />}
                {geometry === "octahedron2" && <octahedronGeometry args={[1.5, 0]} />}
                {geometry === "octahedron3" && <octahedronGeometry args={[1.5, 0]} />}
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
            <Environment preset="studio" />
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
                <SceneContent cameraPosition={[8, 0, 0]} geometry="octahedron2" />
            </View>

            <View className="w-1/3 h-full">
                <SceneContent cameraPosition={[0, 8, 0]} geometry="octahedron" />
            </View>

            <View className="w-1/3 h-full">
                <SceneContent cameraPosition={[0, 0, 8]} geometry="octahedron3" />
            </View>

            <Canvas
                className="!absolute !inset-0 !pointer-events-none"
                eventSource={containerRef as React.RefObject<HTMLElement>}
                eventPrefix="client"
            >
                <View.Port />
            </Canvas>
        </div>


    );
}