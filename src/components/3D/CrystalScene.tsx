import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Environment, Edges, Billboard, Text, PerspectiveCamera, View } from "@react-three/drei";
import { useRef, useState, useLayoutEffect } from "react";
import type { Mesh, Group } from "three";
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon } from "@hugeicons/core-free-icons"
import { Vector3 } from "three";
import { Sound } from "@/Hooks/Sound"


type GeometryType = "tetrahedron" | "octahedron" | "icosahedron" | "icosahedron2";

type VertexLabel = { position: [number, number, number]; label: string };

const PHI = 1.618033988749895;

const SKILLS_BY_GEOMETRY: Record<GeometryType, VertexLabel[]> = {

    tetrahedron: [

        { position: [1, 1, 1], label: "TypeScript" },
        { position: [-1, -1, 1], label: "React" },
        { position: [-1, 1, -1], label: "Tailwind CSS / Bootstrap" },
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
        { position: [0, 1, PHI], label: "Angular" },
        { position: [0, -1, PHI], label: "JavaScript" },
        { position: [1, PHI, 0], label: "HTML5 / CSS3 / SCSS" },
        { position: [-1, PHI, 0], label: "Git / GitFlow" },
        { position: [PHI, 0, 1], label: "" },
        { position: [-PHI, 0, 1], label: "React Native" },
        { position: [0, 1, -PHI], label: "Expo" },
        { position: [0, -1, -PHI], label: "Stripe" },
        { position: [1, -PHI, 0], label: "EmailJS" },
        { position: [-1, -PHI, 0], label: "" },
        { position: [PHI, 0, -1], label: "Web Audio API" },
        { position: [-PHI, 0, -1], label: "LaTeX" },
    ],

    icosahedron2: [
        { position: [0, 1, PHI], label: "Adaptability" },
        { position: [0, -1, PHI], label: "" },
        { position: [1, PHI, 0], label: "" },
        { position: [-1, PHI, 0], label: "Teamwork" },
        { position: [PHI, 0, 1], label: "" },
        { position: [-PHI, 0, 1], label: "" },
        { position: [0, 1, -PHI], label: "Autonomy" },
        { position: [0, -1, -PHI], label: "Problem solving" },
        { position: [1, -PHI, 0], label: "Fast Learner" },
        { position: [-1, -PHI, 0], label: "" },
        { position: [PHI, 0, -1], label: "" },
        { position: [-PHI, 0, -1], label: "Cross-Cultural communication" },
    ],
};

// const SKILL_DESCRIPTIONS: Record<string, String> = {
//     "TypeScript": "Add description here...",
//     "React": "Add description here...",
//     "Tailwind CSS": "Add description here...",
//     "REST APIs": "Add description here...",
//     "Java": "Add description here...",
//     "PHP": "Add description here...",
//     "Spring / Spring Boot": "Add description here...",
//     "PostgreSQL": "Add description here...",
//     "Docker": "Add description here...",
//     "Python / Scikit-learn": "Add description here...",
//     "Angular": "Add description here...",
//     "JavaScript": "Add description here...",
//     "HTML5 / CSS3 / SCSS": "Add description here...",
//     "Git / GitFlow": "Add description here...",
//     "React Native": "Add description here...",
//     "Expo": "Add description here...",
//     "Stripe": "Add description here...",
//     "EmailJS": "Add description here...",
//     "Web Audio API": "Add description here...",
//     "LaTeX": "Add description here...",
// };

type SkillDescription = {
    highlights?: string[];
};

const SKILL_DESCRIPTIONS: Record<string, SkillDescription> = {

    "Python / Scikit-learn": {
        highlights: [
            "Data preprocessing and feature engineering",
            "Classification: Logistic Regression, Decision Trees, Random Forests",
            "Clustering: K-Means",
            "Model evaluation and result interpretation",
        ],
    },
    "PHP": {
        highlights: [
            "full-stack e-commerce website",
            "Backend logic, user authentification, shopping cart management",
            "Secure online payments via the Stripe API",
            "Managing the database",
        ],
    },

};

type SelectedSkill = { geometry: GeometryType; label: string, origin: { x: number; y: number }; };


function Crystal({
    geometry = "octahedron",
    isFrozen,
    onSkillClick,
    viewRef,
    selectedLabel,


}: {
    geometry?: GeometryType
    isFrozen: boolean,
    onSkillClick: (label: string, origin: { x: number; y: number }) => void;
    viewRef: React.RefObject<HTMLDivElement | null>;
    selectedLabel?: string;
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

            {labels.map(({ position, label }) => {

                if (label === selectedLabel) return null;

                return (
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
                );
            })}
        </group>
    );
}

function SceneContent({
    cameraPosition,
    geometry,
    isFrozen,
    onSkillClick,
    viewRef,
    selectedLabel,
}: {
    cameraPosition: [number, number, number];
    geometry?: GeometryType;
    isFrozen: boolean;
    onSkillClick: (label: string, origin: { x: number; y: number }) => void;
    viewRef: React.RefObject<HTMLDivElement | null>;
    selectedLabel?: string;
}) {
    return (
        <>
            <PerspectiveCamera makeDefault position={cameraPosition} fov={50} />
            <ambientLight intensity={1} />
            <pointLight position={[5, 5, 5]} intensity={2} color="#c8a2d8" />
            <pointLight position={[-5, -5, -5]} intensity={1} color="#e6ccff" />
            <Environment resolution={128} frames={1} preset="studio" />
            <Crystal geometry={geometry} isFrozen={isFrozen} onSkillClick={onSkillClick} viewRef={viewRef} selectedLabel={selectedLabel} />
            <OrbitControls enablePan={false} enableZoom={false} />
        </>
    );
}

function SkillModal({ skill, modalRef, style, onClose }: { skill: SelectedSkill; modalRef: React.RefObject<HTMLDivElement | null>; style: { left: number; top: number } | null; onClose: () => void }) {

    const displayStyle = style ?? { left: skill.origin.x + 20, top: skill.origin.y };
    const desc = SKILL_DESCRIPTIONS[skill.label];

    return (
        <div
            className="fixed inset-0 z-50"
            onClick={onClose}
        >

            <div
                ref={modalRef}
                className="absolute bg-[#1a1025]/90 border border-[var(--lavender-purple)] rounded-2xl shadow-[0_0_30px_rgba(222,201,233,0.4)] w-[400px] max-w-[90%] max-h-[70vh] overflow-y-auto p-6 transition-opacity duration-150 [scrollbar-width:thin] [scrollbar-color:var(--lavender-purple)_transparent]"
                style={displayStyle}
                onClick={(e) => e.stopPropagation()}
            >


                <div className="flex justify-between items-start mb-4">

                    <h3 className="text-2xl text-[var(--lavender-purple)]">{skill.label}</h3>
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
                
                {desc?.highlights ? (
                    <ul className="list-disc list-inside text-lilac-200 space-y-1">
                        {desc.highlights.map((h) => <li key={h}>{h}</li>)}
                    </ul>
                ) : (
                    <p className="text-lilac-200">Description à venir.</p>
                )}

            </div>
        </div>
    );
}



function buildElbowPath(
    origin: { x: number; y: number },
    edgeX: number,
    anchorY: number,
    firstSegmentLength: number
) {
    const dirX = edgeX >= origin.x ? 1 : -1;

    if (Math.abs(anchorY - origin.y) < 0.01) {
        return `M ${origin.x} ${origin.y} L ${edgeX} ${anchorY}`;
    }

    const bendX = origin.x + dirX * firstSegmentLength;

    return `
        M ${origin.x} ${origin.y}
        L ${bendX} ${origin.y}
        L ${edgeX} ${anchorY}
    `;
}

function ConnectorLine({
    origin,
    target,
}: {
    origin: { x: number; y: number };
    target: { left: number; top: number; width: number; height: number };
}) {
    const CORNER_MARGIN = 24;
    const RISE = 40;
    const FIRST_SEGMENT_LENGTH = 35;

    let edgeX: number;
    if (origin.x <= target.left) {
        edgeX = target.left;
    } else if (origin.x >= target.left + target.width) {
        edgeX = target.left + target.width;
    } else {
        edgeX = origin.x;
    }

    const edgeTop = target.top + CORNER_MARGIN;
    const edgeBottom = target.top + target.height - CORNER_MARGIN;

    const anchorY = edgeTop <= edgeBottom
        ? Math.min(Math.max(origin.y - RISE, edgeTop), edgeBottom)
        : target.top + target.height / 2;

    const d = buildElbowPath(origin, edgeX, anchorY, FIRST_SEGMENT_LENGTH);

    return (
        <svg className="fixed inset-0 w-full h-full pointer-events-none z-40">
            <path d={d} fill="none" stroke="var(--lavender-purple)" strokeWidth={4} style={{ filter: "blur(4px)" }} opacity={0.5} />
            <path d={d} fill="none" stroke="#dec9e9" strokeWidth={1} />
        </svg>
    );
}


function FocusBlurOverlay({ rect }: { rect: DOMRect | null }) {
    return (
        <div
            className={`fixed inset-0 z-30 pointer-events-none transition-opacity duration-500 ${rect ? "opacity-100" : "opacity-0"
                }`}
        >
            {rect && (
                <>
                    {/* Bande du haut */}
                    <div
                        className="absolute backdrop-blur-md bg-black/10"
                        style={{ top: 0, left: 0, right: 0, height: rect.top }}
                    />
                    {/* Bande du bas */}
                    <div
                        className="absolute backdrop-blur-md bg-black/10"
                        style={{ top: rect.top + rect.height, left: 0, right: 0, bottom: 0 }}
                    />
                    {/* Bande de gauche */}
                    <div
                        className="absolute backdrop-blur-md bg-black/10"
                        style={{ top: rect.top, left: 0, width: rect.left, height: rect.height }}
                    />
                    {/* Bande de droite */}
                    <div
                        className="absolute backdrop-blur-md bg-black/10"
                        style={{ top: rect.top, left: rect.left + rect.width, right: 0, height: rect.height }}
                    />
                </>
            )}
        </div>
    );
}

export default function CrystalScene() {
    const tetraViewRef = useRef<HTMLDivElement>(null);
    const octaViewRef = useRef<HTMLDivElement>(null);
    const icoViewRef = useRef<HTMLDivElement>(null);
    const ico2ViewRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [selected, setSelected] = useState<SelectedSkill | null>(null);
    const modalRef = useRef<HTMLDivElement | null>(null);
    const [modalStyle, setModalStyle] = useState<{ left: number; top: number; width: number; height: number } | null>(null);
    const [activeRect, setActiveRect] = useState<DOMRect | null>(null);
    const playClick = Sound("/sounds/clic.mp3");

    const viewRefsByGeometry: Record<GeometryType, React.RefObject<HTMLDivElement | null>> = {
        tetrahedron: tetraViewRef,
        octahedron: octaViewRef,
        icosahedron: icoViewRef,
        icosahedron2: ico2ViewRef,
    };

    const handleSkillClick = (geometry: GeometryType) => (label: string, origin: { x: number; y: number }) => {
        setSelected({ geometry, label, origin });
        setModalStyle(null);
        playClick();
    };

    const closeModal = () => {
        setSelected(null);
        setModalStyle(null);
        playClick();
    };

    const CONNECTOR_OFFSET = 55;


    useLayoutEffect(() => {

        if (!selected) {
            setActiveRect(null);
            return;
        }
        const updateRect = () => {
            const el = viewRefsByGeometry[selected.geometry].current;
            if (el) setActiveRect(el.getBoundingClientRect());
        };

        updateRect();
        window.addEventListener("resize", updateRect);
        window.addEventListener("scroll", updateRect, true);
        return () => {
            window.removeEventListener("resize", updateRect);
            window.removeEventListener("scroll", updateRect, true);
        };
    }, [selected]);

    useLayoutEffect(() => {
        if (selected) {
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = "hidden";

            return () => {
                document.body.style.overflow = originalOverflow;
            };
        }
    }, [selected]);

    useLayoutEffect(() => {

        if (!selected || !modalRef.current) return;
        const MARGIN = 16;
        const rect = modalRef.current.getBoundingClientRect();


        const openLeft = selected.geometry === "icosahedron";

        let left = openLeft
            ? selected.origin.x - rect.width - CONNECTOR_OFFSET
            : selected.origin.x + CONNECTOR_OFFSET;
        let top = selected.origin.y - rect.height / 2;

        left = Math.min(left, window.innerWidth - rect.width - MARGIN);
        left = Math.max(left, MARGIN);
        top = Math.min(top, window.innerHeight - rect.height - MARGIN);
        top = Math.max(top, MARGIN);

        setModalStyle({ left, top, width: rect.width, height: rect.height });
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
                        selectedLabel={selected?.geometry === "tetrahedron" ? selected.label : undefined}
                    />
                </View>

                <View ref={octaViewRef} className="w-1/3 h-full">
                    <SceneContent
                        cameraPosition={[0, 8, 0]}
                        geometry="octahedron"
                        isFrozen={selected?.geometry === "octahedron"}
                        onSkillClick={handleSkillClick("octahedron")}
                        viewRef={octaViewRef}
                        selectedLabel={selected?.geometry === "octahedron" ? selected.label : undefined}
                    />
                </View>

                <View ref={icoViewRef} className="w-1/3 h-full">
                    <SceneContent
                        cameraPosition={[0, 0, 8]}
                        geometry="icosahedron"
                        isFrozen={selected?.geometry === "icosahedron"}
                        onSkillClick={handleSkillClick("icosahedron")}
                        viewRef={icoViewRef}
                        selectedLabel={selected?.geometry === "icosahedron" ? selected.label : undefined}
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
                        selectedLabel={selected?.geometry === "icosahedron2" ? selected.label : undefined}
                    />
                </View>
            </div>


            <Canvas
                dpr={[1, 1.5]}
                className="!fixed !inset-0 !pointer-events-none z-10"
                eventSource={containerRef as React.RefObject<HTMLElement>}
                eventPrefix="client"
            >
                <View.Port />
            </Canvas>

            <FocusBlurOverlay rect={activeRect} />

            {selected && (
                <>
                    <SkillModal skill={selected} modalRef={modalRef} style={modalStyle} onClose={closeModal} />
                    {modalStyle && <ConnectorLine origin={selected.origin} target={modalStyle} />}
                </>
            )}

        </div>


    );
}