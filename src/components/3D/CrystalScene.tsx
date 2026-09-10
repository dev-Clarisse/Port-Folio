import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Edges, Billboard, Text, PerspectiveCamera, View } from "@react-three/drei";
import { useRef, useState, useLayoutEffect, useEffect, useCallback, memo } from "react";
import type { Mesh, Group } from "three";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { Vector3 } from "three";
import { Sound } from "@/Hooks/Sound";

type GeometryType = "tetrahedron" | "octahedron" | "icosahedron" | "icosahedron2";
type VertexLabel = { position: [number, number, number]; label: string };

const PHI = 1.618033988749895;

const SKILLS_BY_GEOMETRY: Record<GeometryType, VertexLabel[]> = {
  tetrahedron: [
    { position: [1, 1, 1], label: "JavaScript / TypeScript" },
    { position: [-1, -1, 1], label: "React / React Native" },
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
    { position: [0, -1, PHI], label: "" },
    { position: [1, PHI, 0], label: "HTML5 / CSS3 / SCSS" },
    { position: [-1, PHI, 0], label: "Git / GitFlow" },
    { position: [PHI, 0, 1], label: "" },
    { position: [-PHI, 0, 1], label: "PostMan" },
    { position: [0, 1, -PHI], label: "Expo / Expo Go" },
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

type SkillDescription = { highlights?: string[] };

const SKILL_DESCRIPTIONS: Record<string, SkillDescription> = {
  "Python / Scikit-learn": {
    highlights: [
      "Data preprocessing and feature engineering",
      "Classification: Logistic Regression, Decision Trees, Random Forests",
      "Clustering: K-Means",
      "Model evaluation and result interpretation",
    ],
  },
  PHP: {
    highlights: [
      "full-stack e-commerce website",
      "Backend logic, user authentification, shopping cart management",
      "Secure online payments via the Stripe API",
      "Managing the database",
    ],
  },
  "Spring / Spring Boot": {
    highlights: [
      "Restful backend for a restaurant application",
      "Building REST APIs",
      "Managing customer orders, track ingredient, inventory levels, handle automated supllier restocking requests",
      "Built a modular portal , JWT authentification, PostgreSQL storage, Spring Boot, Angular 17",
    ],
  },
  PostgreSQL: {
    highlights: [
      "Built a modular portal , JWT authentification, PostgreSQL storage, Spring Boot, Angular 17",
      "Designing relational schemas to store and manage dynamic content such as quote collections in Android development projects",
    ],
  },
  Docker: {
    highlights: [
      "Use in various school and personal projects",
      "Designing relational schemas to store and manage dynamic content such as quote collections in Android development projects",
    ],
  },
  Angular: {
    highlights: [
      "Built a modular portal , JWT authentification, PostgreSQL storage, Spring Boot, Angular 17",
      "dynamic movie discovery web app, interactive features such as rating movies",
    ],
  },
  Stripe: {
    highlights: ["Secure online payments via the Stripe API in a full-stack e-commerce website"],
  },
  "Git / GitFlow": {
    highlights: [
      "Use in various school and personal projects",
      "Creating feature branches, submitting pull requests, performing code reviews",
      "Resolving merge conflicts to maintain a clean codebase",
    ],
  },
  Java: {
    highlights: [
      "Use in various school and personal projects",
      "Backend language, developing REST APIs, handling data persistence",
      "Applying core design patterns to build scalable logic",
    ],
  },
  EmailJS: {
    highlights: ["Engineered a portfolio using React, TypeScript and Vite", "Integrated EmailJS for dynamic contact forms"],
  },
  "Web Audio API": {
    highlights: [
      "Engineered a portfolio using React, TypeScript and Vite",
      "Integrated Web Audio API for a more immersive experience",
    ],
  },
  LaTeX: {
    highlights: [
      "Document compilation and automated typesetting using LaTeX within an Ubuntu terminal environment",
      "Write LaTeX source code directly and compile documents using command-line interface (CLI) tools",
      "Utilizing Linux terminal commands to efficiently manage files and automate compilation workflows",
    ],
  },
  "JavaScript / TypeScript": {
    highlights: ["Engineered a portfolio using React, TypeScript and Vite", "Using in various school and personal projects"],
  },
  "REST APIs": {
    highlights: [
      "Designing, building and consuming RESTful APIs accros multiple full-stack and backend projects",
      "Analysing responses, debug status codes, and verify backend business logic",
    ],
  },
  "React / React Native": {
    highlights: [
      "Building responsive web and mobile interfaces",
      "Developing my portfolio, focusing on component-based architecture and modern UI principles",
      "Built a mobile application using React Native and Expo Go, leveraging cross-platform components, state management, and device testing workflows",
    ],
  },
  "Expo / Expo Go": {
    highlights: [
      "Built a mobile application using React Native and Expo Go, leveraging cross-platform components, state management, and device testing workflows",
    ],
  },
  "Tailwind CSS / Bootstrap": {
    highlights: [
      "Using in a full-stack e-commerce website",
      "Engineered a portfolio using React, TypeScript and Vite",
      "Building a complete website for a family member",
    ],
  },
  "HTML5 / CSS3 / SCSS": {
    highlights: [
      "building semantic, accessible, and responsive web layouts",
      "Using in various school and personal projects",
      "Building a complete website for a family member",
    ],
  },
  PostMan: {
    highlights: ["To testing and validate endpoints, I use Postman to construct HTTP requests"],
  },
  Adaptability: {
    highlights: ["adjusting to new work environments", "changing project requirements while maintaining high productivity and quality"],
  },
  Teamwork: {
    highlights: [
      "Open communication, peer code reviews, active participation in Agile workflows",
      "Collaborate effectively within multi-disciplinary teams",
    ],
  },
  Autonomy: {
    highlights: [
      "Taking full ownership of tasks from planning to completion",
      "Managing time efficiently and delivering solid results with minimal supervision",
    ],
  },
  "Problem solving": {
    highlights: ["Resolving merge conflicts to maintain a clean codebase", "Approaching complex technical bugs and system challenges"],
  },
  "Fast Learner": {
    highlights: ["Rapidly absorb new programming languages, frameworks, and tools"],
  },
  "Cross-Cultural communication": {
    highlights: [
      "Communicated professionally and empathetically with international clients via email, helping them troubleshoot issues",
    ],
  },
};

type SelectedSkill = { geometry: GeometryType; label: string; origin: { x: number; y: number } };

function ViewportUpdater() {
  const { invalidate } = useThree();

  useEffect(() => {
    const handleScroll = () => {
      invalidate();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [invalidate]);

  return null;
}

function Crystal({
  geometry = "octahedron",
  isFrozen,
  onSkillClick,
  viewRef,
  selectedLabel,
}: {
  geometry?: GeometryType;
  isFrozen: boolean;
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
  const CRYSTAL_RADIUS = 1.5;

  const handleLabelClick = (label: string, vertexPosition: [number, number, number]) => (e: ThreeEvent<MouseEvent>) => {
    if (!label) return;
    e.stopPropagation();

    const surfacePoint = new Vector3(...vertexPosition).normalize().multiplyScalar(CRYSTAL_RADIUS);
    const worldPos = groupRef.current ? groupRef.current.localToWorld(surfacePoint) : surfacePoint;

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
          color="#6247aa"
          transmission={0.9}
          roughness={0.1}
          thickness={1.5}
          emissive="#dac3e8"
          emissiveIntensity={0.15}
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
      <ViewportUpdater />
      <PerspectiveCamera makeDefault position={cameraPosition} fov={50} />
      <ambientLight intensity={1.2} />
      <directionalLight position={[10, 10, 5]} intensity={2.5} color="#ffffff" />
      <directionalLight position={[-10, -10, -5]} intensity={1.2} color="#c8a2d8" />
      <pointLight position={[5, 5, 5]} intensity={2} color="#c8a2d8" />
      <pointLight position={[-5, -5, -5]} intensity={1} color="#e6ccff" />
      <Crystal geometry={geometry} isFrozen={isFrozen} onSkillClick={onSkillClick} viewRef={viewRef} selectedLabel={selectedLabel} />
      <OrbitControls enablePan={false} enableZoom={false} />
    </>
  );
}

function SkillModal({
  skill,
  modalRef,
  style,
  onClose,
}: {
  skill: SelectedSkill;
  modalRef: React.RefObject<HTMLDivElement | null>;
  style: { left: number; top: number } | null;
  onClose: () => void;
}) {
  const displayStyle = style ?? { left: skill.origin.x + 20, top: skill.origin.y };
  const desc = SKILL_DESCRIPTIONS[skill.label];

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div
        ref={modalRef}
        className="absolute bg-[#1a1025]/90 border border-[var(--lavender-purple)] rounded-2xl shadow-[0_0_30px_rgba(222,201,233,0.4)] w-[400px] max-w-[90%] max-h-[70vh] overflow-y-auto p-6 transition-opacity duration-150 [scrollbar-width:thin] [scrollbar-color:var(--lavender-purple)_transparent]"
        style={displayStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl text-[var(--lavender-purple)]">{skill.label}</h3>
          <Button onClick={onClose} className="text-lilac-300 text-xl leading-none" variant="ghost" size="icon-sm">
            <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        {desc?.highlights ? (
          <ul className="list-disc list-inside text-lilac-200 space-y-1">
            {desc.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        ) : (
          <p className="text-lilac-200">Description à venir.</p>
        )}
      </div>
    </div>
  );
}

function buildElbowPath(origin: { x: number; y: number }, edgeX: number, anchorY: number, firstSegmentLength: number) {
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

  const anchorY =
    edgeTop <= edgeBottom ? Math.min(Math.max(origin.y - RISE, edgeTop), edgeBottom) : target.top + target.height / 2;

  const d = buildElbowPath(origin, edgeX, anchorY, FIRST_SEGMENT_LENGTH);

  return (
    <svg className="fixed inset-0 w-full h-full pointer-events-none z-40">
      <path d={d} fill="none" stroke="var(--lavender-purple)" strokeWidth={4} style={{ filter: "blur(4px)" }} opacity={0.5} />
      <path d={d} fill="none" stroke="#dec9e9" strokeWidth={1} />
    </svg>
  );
}

const FocusBlurOverlay = memo(({ rect }: { rect: DOMRect | null }) => {
  if (!rect) return null;

  const clipStyle = {
    clipPath: `polygon(
      0% 0%, 0% 100%, 
      ${rect.left}px 100%, 
      ${rect.left}px ${rect.top}px, 
      ${rect.left + rect.width}px ${rect.top}px, 
      ${rect.left + rect.width}px ${rect.top + rect.height}px, 
      ${rect.left}px ${rect.top + rect.height}px, 
      ${rect.left}px 100%, 
      100% 100%, 100% 0%
    )`,
  };

  return (
    <div
      className="fixed inset-0 z-30 pointer-events-none backdrop-blur-md bg-black/20 transition-opacity duration-300"
      style={clipStyle}
    />
  );
});
FocusBlurOverlay.displayName = "FocusBlurOverlay";

const TECHNICAL_CRYSTALS: { geometry: GeometryType; cameraPosition: [number, number, number] }[] = [
  { geometry: "tetrahedron", cameraPosition: [8, 0, 0] },
  { geometry: "octahedron", cameraPosition: [0, 8, 0] },
  { geometry: "icosahedron", cameraPosition: [0, 0, 8] },
];

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

  const [hasMounted, setHasMounted] = useState(false);
  const [isInViewport, setIsInViewport] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting);
        if (entry.isIntersecting) setHasMounted(true);
      },
      { rootMargin: "300px 0px", threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const viewRefsByGeometry: Record<GeometryType, React.RefObject<HTMLDivElement | null>> = {
    tetrahedron: tetraViewRef,
    octahedron: octaViewRef,
    icosahedron: icoViewRef,
    icosahedron2: ico2ViewRef,
  };

  const handleSkillClick = useCallback(
    (geometry: GeometryType) => (label: string, origin: { x: number; y: number }) => {
      const targetRef = viewRefsByGeometry[geometry].current;
      if (targetRef) {
        setActiveRect(targetRef.getBoundingClientRect());
      }
      setSelected({ geometry, label, origin });
      setModalStyle(null);
      playClick();
    },
    [playClick]
  );

  const closeModal = useCallback(() => {
    setSelected(null);
    setModalStyle(null);
    setActiveRect(null);
    playClick();
  }, [playClick]);

  const CONNECTOR_OFFSET = 55;

  useLayoutEffect(() => {
    if (!selected) return;

    const updateRect = () => {
      const el = viewRefsByGeometry[selected.geometry].current;
      if (el) setActiveRect(el.getBoundingClientRect());
    };

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

    let left = openLeft ? selected.origin.x - rect.width - CONNECTOR_OFFSET : selected.origin.x + CONNECTOR_OFFSET;
    let top = selected.origin.y - rect.height / 2;

    left = Math.min(left, window.innerWidth - rect.width - MARGIN);
    left = Math.max(left, MARGIN);
    top = Math.min(top, window.innerHeight - rect.height - MARGIN);
    top = Math.max(top, MARGIN);

    setModalStyle({ left, top, width: rect.width, height: rect.height });
  }, [selected]);

  const isCrystalFrozen = (geometry: GeometryType) => selected?.geometry === geometry || !isInViewport;

  return (
    <div ref={containerRef} className="relative w-full ">
      <div className="flex flex-col items-center pt-8 pb-2">
        <div className="gap-4 mb-1">
          <h2 className="text-3xl text-lilac-1000 text-center">Technical Skills</h2>
          <p className="text-lilac-1100 text-center max-w-md">Frontend, Backend, Mobile, Data/ML, Tools&DevOps, Integrations</p>
        </div>
      </div>

      <div className="h-[550px] flex">
        {TECHNICAL_CRYSTALS.map(({ geometry, cameraPosition }) => (
          <View
            key={geometry}
            ref={viewRefsByGeometry[geometry]}
            className="relative w-1/3 h-full overflow-hidden [clip-path:inset(0)]"
          >
            {hasMounted && (
              <SceneContent
                cameraPosition={cameraPosition}
                geometry={geometry}
                isFrozen={isCrystalFrozen(geometry)}
                onSkillClick={handleSkillClick(geometry)}
                viewRef={viewRefsByGeometry[geometry]}
                selectedLabel={selected?.geometry === geometry ? selected.label : undefined}
              />
            )}
          </View>
        ))}
      </div>

      <div className="flex flex-col items-center pt-4 pb-2">
        <div className="gap-4 mb-1">
          <h2 className="text-3xl text-lilac-1000 text-center">Soft Skills</h2>
          <p className="text-lilac-1100 text-center max-w-md">Character traits and communication abilities</p>
        </div>
      </div>

      <div className="flex justify-center h-[550px]">
        <View
          ref={ico2ViewRef}
          className="relative w-1/2 h-full overflow-hidden [clip-path:inset(0)]"
        >
          {hasMounted && (
            <SceneContent
              cameraPosition={[8, 0, 0]}
              geometry="icosahedron2"
              isFrozen={isCrystalFrozen("icosahedron2")}
              onSkillClick={handleSkillClick("icosahedron2")}
              viewRef={ico2ViewRef}
              selectedLabel={selected?.geometry === "icosahedron2" ? selected.label : undefined}
            />
          )}
        </View>
      </div>

      {hasMounted && (
        <Canvas
          dpr={[1, 1.5]}
          style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", pointerEvents: "none", zIndex: 10 }}
          eventSource={containerRef as React.RefObject<HTMLElement>}
          eventPrefix="client"
          frameloop={isInViewport ? "always" : "demand"}
          onCreated={({ gl }) => {
            gl.setScissorTest(true);
          }}
        >
          <View.Port />
        </Canvas>
      )}

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