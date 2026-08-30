import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Environment, Edges, Billboard, Text, PerspectiveCamera, View } from "@react-three/drei";
import { useRef, useState, useLayoutEffect } from "react";
import type { Mesh, Group } from "three";
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon } from "@hugeicons/core-free-icons"
import { Vector3 } from "three";


type GeometryType = "tetrahedron" | "octahedron" | "icosahedron" | "icosahedron2";

type VertexLabel = { position: [number, number, number]; label: string };

const SKILLS_BY_GEOMETRY: Record<GeometryType, VertexLabel[]> = {

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

    icosahedron2: [
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

const SKILL_DESCRIPTIONS: Record<string, string> = {
    "TypeScript": "Description à compléter...",
    "React": "Description à compléter...",
    "Tailwind CSS": "Description à compléter...",
    "REST APIs": "Description à compléter...",
    "Java": "Description à compléter...",
    "PHP": "Description à compléter...",
    "Spring / Spring Boot": "Description à compléter...",
    "PostgreSQL": "Description à compléter...",
    "Docker": "Description à compléter...",
    "Python / Scikit-learn": "Description à compléter...",
    "Angular": "Description à compléter...",
    "JavaScript": "Description à compléter...",
    "HTML5 / CSS3 / SCSS": "Description à compléter...",
    "Git / GitFlow": "Description à compléter...",
    "React Native": "Description à compléter...",
    "Expo": "Description à compléter...",
    "Stripe": "Description à compléter...",
    "EmailJS": "Description à compléter...",
    "Web Audio API": "Description à compléter...",
    "LaTeX": "Description à compléter...",
};

type SelectedSkill = { geometry: GeometryType; label: string, origin: { x: number; y: number }; };


function Crystal({
    geometry = "octahedron",
    isFrozen,
    onSkillClick,
    viewRef,


}: {
    geometry?: GeometryType
    isFrozen: boolean,
    onSkillClick: (label: string, origin: { x: number; y: number }) => void;
    viewRef: React.RefObject<HTMLDivElement | null>;
}) {

    const meshRef = useRef<Mesh>(null);
    const groupRef = useRef<Group>(null);
    const { camera } = useThree();

    useFrame((_, delta) => {
        if (groupRef.current && !isFrozen) {
            groupRef.current.rotation.y += delta * 0.2;
            groupRef.current.rotation.x += delta * 0.2;
            groupRef.current.rotation.z += delta * 0.2;
        }
    });

    const labels = SKILLS_BY_GEOMETRY[geometry];

    const CRYSTAL_RADIUS = 1.5; // doit matcher le radius passé à tetrahedronGeometry/octahedronGeometry/icosahedronGeometry

    const handleLabelClick = (label: string, vertexPosition: [number, number, number]) => (e: ThreeEvent<MouseEvent>) => {
        if (!label) return;
        e.stopPropagation();

        // Direction du label, mais point ramené sur la vraie surface du cristal (pas la position offset du label)
        const surfacePoint = new Vector3(...vertexPosition).normalize().multiplyScalar(CRYSTAL_RADIUS);

        const worldPos = groupRef.current
            ? groupRef.current.localToWorld(surfacePoint)
            : surfacePoint;

        camera.updateMatrixWorld();
        const ndc = worldPos.clone().project(camera);

        const rect = viewRef.current?.getBoundingClientRect();
        if (!rect) return;

        const screenX = rect.left + (ndc.x * 0.5 + 0.5) * rect.width;
        const screenY = rect.top + (1 - (ndc.y * 0.5 + 0.5)) * rect.height;

        onSkillClick(label, { x: screenX, y: screenY });
    };

    return (
        <group ref={groupRef}>

            <mesh ref={meshRef}>
                {geometry === "tetrahedron" && <tetrahedronGeometry args={[1.5, 0]} />}
                {geometry === "octahedron" && <octahedronGeometry args={[1.5, 0]} />}
                {geometry === "icosahedron" && <icosahedronGeometry args={[1.5, 0]} />}
                {geometry === "icosahedron2" && <icosahedronGeometry args={[1.5, 0]} />}
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

                <Billboard key={label || `${position.join(",")}`} position={position}>
                    <Text
                        fontSize={0.22}
                        color="#dec9e9"
                        anchorX="center"
                        anchorY="middle"
                        outlineWidth={0.01}
                        outlineColor="#4e148c"
                        onClick={handleLabelClick(label, position)}
                        onPointerOver={() => {
                            if (label) document.body.style.cursor = "pointer";
                        }}
                        onPointerOut={() => {
                            document.body.style.cursor = "auto";
                        }}
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
    isFrozen,
    onSkillClick,
    viewRef,
}: {
    cameraPosition: [number, number, number];
    geometry?: GeometryType;
    isFrozen: boolean;
    onSkillClick: (label: string, origin: { x: number; y: number }) => void;
    viewRef: React.RefObject<HTMLDivElement | null>;
}) {
    return (
        <>
            <PerspectiveCamera makeDefault position={cameraPosition} fov={50} />
            <ambientLight intensity={1} />
            <pointLight position={[5, 5, 5]} intensity={2} color="#c8a2d8" />
            <pointLight position={[-5, -5, -5]} intensity={1} color="#e6ccff" />
            <Environment resolution={128} frames={1} preset="studio" />
            <Crystal geometry={geometry} isFrozen={isFrozen} onSkillClick={onSkillClick} viewRef={viewRef} />
            <OrbitControls enablePan={false} enableZoom={false} />
        </>
    );
}

function SkillModal({ skill, modalRef, style, onClose }: { skill: SelectedSkill; modalRef: React.RefObject<HTMLDivElement | null>; style: { left: number; top: number; opacity: number } | null; onClose: () => void }) {

    const displayStyle = style ?? { left: skill.origin.x + 20, top: skill.origin.y, opacity: 0 };

    return (
        <div
            className="fixed inset-0 z-50"
            onClick={onClose}
        >
            <div
                ref={modalRef}
                className="absolute bg-[#1a1025] border border-[var(--lavender-purple)] rounded-2xl shadow-[0_0_30px_rgba(222,201,233,0.4)] w-[400px] max-w-[90%] p-6 transition-opacity duration-150"
                style={displayStyle}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl text-lilac-100">{skill.label}</h3>
                    <Button
                        onClick={onClose}
                        className="text-lilac-300 text-xl leading-none"
                        variant="ghost"
                        size="icon-sm"
                    >
                        <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
                        <span className="sr-only">Close</span>
                    </Button>
                </div>
                <p className="text-lilac-200">
                    {SKILL_DESCRIPTIONS[skill.label] ?? "Description à venir."}
                </p>
            </div>
        </div>
    );
}

function ConnectorLine({
    origin,
    target,

}: {
    origin: { x: number; y: number };
    target: { left: number; top: number; width: number; height: number };


}) {

    // const clampedY = Math.min(Math.max(origin.y, target.top), target.top + target.height);
    const clampedY = Math.min(Math.max(origin.y, target.top), target.top + target.height);

    let edgeX: number;
    if (origin.x <= target.left) {
        edgeX = target.left; // origine à gauche -> on touche le bord gauche
    } else if (origin.x >= target.left + target.width) {
        edgeX = target.left + target.width; // origine à droite -> bord droit
    } else {
        edgeX = origin.x; // origine "sous/sur" la modale -> pas de décalage horizontal
    }

    return (
        <svg className="fixed inset-0 w-full h-full pointer-events-none z-40">
            <line x1={origin.x} y1={origin.y} x2={edgeX} y2={clampedY} stroke="var(--lavender-purple)" strokeWidth={4} style={{ filter: "blur(4px)" }} opacity={0.5} />
            <line x1={origin.x} y1={origin.y} x2={edgeX} y2={clampedY} stroke="#dec9e9" strokeWidth={1} />
        </svg>
    );
}

export default function CrystalScene() {
    const tetraViewRef = useRef<HTMLDivElement>(null);
    const octaViewRef = useRef<HTMLDivElement>(null);
    const icoViewRef = useRef<HTMLDivElement>(null);
    const ico2ViewRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [selected, setSelected] = useState<SelectedSkill | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const [modalStyle, setModalStyle] = useState<{ left: number; top: number; width: number; height: number; opacity: number } | null>(null);

    const handleSkillClick = (geometry: GeometryType) => (label: string, origin: { x: number; y: number }) => {
        setSelected({ geometry, label, origin });
        setModalStyle(null);
    };

    const closeModal = () => {
        setSelected(null);
        setModalStyle(null);
    };


    useLayoutEffect(() => {
        if (!selected || !modalRef.current) return;

        const MARGIN = 16;
        const rect = modalRef.current.getBoundingClientRect();

        // Le cristal de droite (icosahedron) ouvre sa modale vers la gauche
        // pour éviter qu'elle ne chevauche le cristal lui-même
        const openLeft = selected.geometry === "icosahedron";

        let left = openLeft
            ? selected.origin.x - rect.width - 30
            : selected.origin.x + 30;
        let top = selected.origin.y - rect.height / 2;

        left = Math.min(left, window.innerWidth - rect.width - MARGIN);
        left = Math.max(left, MARGIN);
        top = Math.min(top, window.innerHeight - rect.height - MARGIN);
        top = Math.max(top, MARGIN);

        setModalStyle({ left, top, width: rect.width, height: rect.height, opacity: 1 });
    }, [selected]);




    return (
        <div ref={containerRef} className="relative w-full ">

            <div className="flex flex-col items-center pt-8 pb-2">

                <div className="gap-4 mb-1">
                    <h2 className="text-3xl text-lilac-1000 text-center">
                        Technical Skills
                    </h2>
                    <p className="text-lilac-1100 text-center max-w-md">
                        Frontend, Backend, Mobile, Data/ML, Tools&DevOps, Integrations
                    </p>
                </div>
            </div>

            <div className="h-[550px] flex">
                <View ref={tetraViewRef} className="w-1/3 h-full">
                    <SceneContent
                        cameraPosition={[8, 0, 0]}
                        geometry="tetrahedron"
                        isFrozen={selected?.geometry === "tetrahedron"}
                        onSkillClick={handleSkillClick("tetrahedron")}
                        viewRef={tetraViewRef}
                    />
                </View>

                <View ref={octaViewRef} className="w-1/3 h-full">
                    <SceneContent
                        cameraPosition={[0, 8, 0]}
                        geometry="octahedron"
                        isFrozen={selected?.geometry === "octahedron"}
                        onSkillClick={handleSkillClick("octahedron")}
                        viewRef={octaViewRef}
                    />
                </View>

                <View ref={icoViewRef} className="w-1/3 h-full">
                    <SceneContent
                        cameraPosition={[0, 0, 8]}
                        geometry="icosahedron"
                        isFrozen={selected?.geometry === "icosahedron"}
                        onSkillClick={handleSkillClick("icosahedron")}
                        viewRef={icoViewRef}
                    />
                </View>
            </div>

            <div className="flex flex-col items-center pt-4 pb-2">
                <div className="gap-4 mb-1" >
                    <h2 className="text-3xl text-lilac-1000 text-center">
                        Soft Skills
                    </h2>
                    <p className="text-lilac-1100 text-center max-w-md">
                        ??
                    </p>
                </div>
            </div>

            <div className="flex justify-center h-[550px]">
                <View ref={ico2ViewRef} className="w-1/2 h-full">
                    <SceneContent
                        cameraPosition={[8, 0, 0]}
                        geometry="icosahedron2"
                        isFrozen={selected?.geometry === "icosahedron2"}
                        onSkillClick={handleSkillClick("icosahedron2")}
                        viewRef={ico2ViewRef}
                    />
                </View>
            </div>


            <Canvas
                dpr={[1, 1.5]}
                className="!fixed !inset-0 !pointer-events-none"
                eventSource={containerRef as React.RefObject<HTMLElement>}
                eventPrefix="client"
            >
                <View.Port />
            </Canvas>

            {selected && (
                <>
                    <SkillModal skill={selected} modalRef={modalRef} style={modalStyle} onClose={closeModal} />
                    {modalStyle && <ConnectorLine origin={selected.origin} target={modalStyle} />}
                </>
            )}



        </div>


    );
}