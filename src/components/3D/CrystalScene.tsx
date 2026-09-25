import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Edges, Billboard, Text, PerspectiveCamera, View } from "@react-three/drei";
import { useRef, useState, useLayoutEffect, useEffect, useCallback, memo } from "react";
import type { Mesh, Group } from "three";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { Vector3 } from "three";
import { Sound } from "@/Hooks/Sound";
import { FileText } from "lucide-react";

type GeometryType = "tetrahedron" | "octahedron" | "icosahedron" | "octahedron2" | "octahedron3";
type VertexLabel = { position: [number, number, number]; label: string };

const PHI = 1.618033988749895;

const SKILLS_BY_GEOMETRY: Record<GeometryType, VertexLabel[]> = {
  tetrahedron: [
    { position: [1.8, 1.8, 1.8], label: "JavaScript / TypeScript" },
    { position: [-1.8, -1.8, 1.8], label: "React / React Native" },
    { position: [-1.8, 1.8, -1.8], label: "Tailwind CSS / Bootstrap" },
    { position: [1.8, -1.8, -1.8], label: "REST APIs" },
  ],
  octahedron: [
    { position: [2.8, 0, 0], label: "Java" },
    { position: [-2.8, 0, 0], label: "PHP" },
    { position: [0, 2.8, 0], label: "Spring / Spring Boot" },
    { position: [0, -2.8, 0], label: "PostgreSQL" },
    { position: [0, 0, 2.8], label: "Docker" },
    { position: [0, 0, -2.8], label: "Python / Scikit-learn" },
  ],
  icosahedron: [
    { position: [0, 1.8, PHI * 1.8], label: "Angular" },
    { position: [0, -1.8, PHI * 1.8], label: "HTML5 / CSS3 / SCSS" },
    { position: [1.8, PHI * 1.8, 0], label: "" },
    { position: [-1.8, PHI * 1.8, 0], label: "" },
    { position: [PHI * 1.8, 0, 1.8], label: "Git / GitFlow" },
    { position: [-PHI * 1.8, 0, 1.8], label: "PostMan" },
    { position: [0, 1.8, -PHI * 1.8], label: "Expo / Expo Go" },
    { position: [0, -1.8, -PHI * 1.8], label: "Stripe" },
    { position: [1.8, -PHI * 1.8, 0], label: "" },
    { position: [-1.8, -PHI * 1.8, 0], label: "" },
    { position: [PHI * 1.8, 0, -1.8], label: "Web Audio API" },
    { position: [-PHI * 1.8, 0, -1.8], label: "LaTeX" },
  ],
  octahedron2: [
    { position: [2.8, 0, 0], label: "Adaptability" },
    { position: [-2.8, 0, 0], label: "Teamwork" },
    { position: [0, 2.8, 0], label: "Autonomy" },
    { position: [0, -2.8, 0], label: "Problem solving" },
    { position: [0, 0, 2.8], label: "Fast Learner" },
    { position: [0, 0, -2.8], label: "Cross-Cultural communication" },
  ],
  octahedron3: [
    { position: [2.8, 0, 0], label: "" },
    { position: [-2.8, 0, 0], label: "" },
    { position: [0, 2.8, 0], label: "English" },
    { position: [0, -2.8, 0], label: "Spanish" },
    { position: [0, 0, 2.8], label: "" },
    { position: [0, 0, -2.8], label: "French" },
  ],
};

type SkillDescription = { highlights?: string[]; pdfUrl?: string };

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
      "Full-stack e-commerce website",
      "Backend logic, user authentication, shopping cart management",
      "Secure online payments via the Stripe API",
      "Managing the database",
    ],
  },
  "Spring / Spring Boot": {
    highlights: [
      "RESTful backend for a restaurant application",
      "Building REST APIs",
      "Managing customer orders, tracking inventory levels, and automated supplier restocking requests",
      "Built a modular portal, JWT authentication, PostgreSQL storage, Spring Boot, Angular 17",
    ],
  },
  PostgreSQL: {
    highlights: [
      "Built a modular portal, JWT authentication, PostgreSQL storage, Spring Boot, Angular 17",
      "Designing relational schemas to store and manage dynamic content in Android development projects",
    ],
  },
  Docker: {
    highlights: [
      "Use in various school and personal projects",
      "Containerizing applications for consistent deployment across environments",
    ],
  },
  Angular: {
    highlights: [
      "Built a modular portal, JWT authentication, PostgreSQL storage, Spring Boot, Angular 17",
      "Dynamic movie discovery web app, interactive features such as rating movies",
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
    highlights: ["Engineered a portfolio using React, TypeScript and Vite", "Used in various school and personal projects"],
  },
  "REST APIs": {
    highlights: [
      "Designing, building and consuming RESTful APIs across multiple full-stack and backend projects",
      "Analyzing responses, debugging status codes, and verifying backend business logic",
    ],
  },
  "React / React Native": {
    highlights: [
      "Building responsive web and mobile interfaces",
      "Developing my portfolio, focusing on component-based architecture and modern UI principles",
      "Built a mobile application using React Native and Expo Go, leveraging cross-platform components and state management",
    ],
  },
  "Expo / Expo Go": {
    highlights: [
      "Built a mobile application using React Native and Expo Go, leveraging cross-platform components, state management, and device testing workflows",
    ],
  },
  "Tailwind CSS / Bootstrap": {
    highlights: [
      "Used in a full-stack e-commerce website",
      "Engineered a portfolio using React, TypeScript and Vite",
      "Building a complete website for a family member",
    ],
  },
  "HTML5 / CSS3 / SCSS": {
    highlights: [
      "Building semantic, accessible, and responsive web layouts",
      "Used in various school and personal projects",
    ],
  },
  PostMan: {
    highlights: ["To test and validate endpoints, constructing HTTP requests and inspecting API responses"],
  },
  Adaptability: {
    highlights: ["Adjusting to new work environments", "Changing project requirements while maintaining high productivity and quality"],
  },
  Teamwork: {
    highlights: [
      "Open communication, peer code reviews, active participation in Agile workflows",
      "Collaborating effectively within multi-disciplinary teams",
    ],
  },
  Autonomy: {
    highlights: [
      "Taking full ownership of tasks from planning to completion",
      "Managing time efficiently and delivering solid results with minimal supervision",
    ],
  },
  "Problem solving": {
    highlights: ["Resolving complex technical bugs and system challenges", "Debugging code and optimizing performance"],
  },
  "Fast Learner": {
    highlights: ["Rapidly absorbing new programming languages, frameworks, and tools"],
  },
  "Cross-Cultural communication": {
    highlights: [
      "Communicated professionally and empathetically with international clients via email, helping them troubleshoot issues",
    ],
  },
  English: {
    highlights: [
      "B2+ level",
      "Cambridge English Skills Test: 167",
    ],
    pdfUrl: "/pdfs/EST_Candidate_Test_Report.pdf",
  },
  Spanish: {
    highlights: ["A2 Level"],
  },
  French: {
    highlights: ["Native speaker"],
    pdfUrl: "/pdfs/attestation_score_Voltaire.pdf",
  },
};

type SelectedSkill = { geometry: GeometryType; label: string; origin: { x: number; y: number } };

function ViewportUpdater() {
  const { invalidate } = useThree();

  useEffect(() => {
    const handleScroll = () => invalidate();
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
  // Augmentation de la taille des cristaux
  const CRYSTAL_RADIUS = 2.8;

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
        {geometry === "tetrahedron" && <tetrahedronGeometry args={[CRYSTAL_RADIUS, 0]} />}
        {geometry === "octahedron" && <octahedronGeometry args={[CRYSTAL_RADIUS, 0]} />}
        {geometry === "icosahedron" && <icosahedronGeometry args={[CRYSTAL_RADIUS, 0]} />}
        {geometry === "octahedron2" && <octahedronGeometry args={[CRYSTAL_RADIUS, 0]} />}
        {geometry === "octahedron3" && <octahedronGeometry args={[CRYSTAL_RADIUS, 0]} />}
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

        const LABEL_OFFSET = 0.35;

        const labelPosition = new Vector3(...position)
          .normalize()
          .multiplyScalar(CRYSTAL_RADIUS + LABEL_OFFSET)
          .toArray() as [number, number, number];

        return (
          <Billboard
            key={label || `${position.join(",")}`}
            position={labelPosition}
          >
            <Text
              fontSize={0.40}
              maxWidth={3.8}
              overflowWrap="break-word"
              lineHeight={1.15}
              color="#dec9e9"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.012}
              outlineColor="#4e148c"
              material-depthTest={false}
              renderOrder={10}
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
      <PerspectiveCamera makeDefault position={cameraPosition} fov={65} />
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
          <h3 className="text-2xl text-[var(--lavender-purple)] font-bold">{skill.label}</h3>
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
          <p className="text-lilac-200">Description coming soon.</p>
        )}

        {desc?.pdfUrl && (
          <div className="flex justify-center mt-4">
            <Button
              asChild
              className="text-base btn-glossy bg-lilac-950 text-lilac-100 transition-all duration-300 hover:drop-shadow-[0_0_20px_var(--color-lilac-400)]"
            >
              <a href={desc.pdfUrl} target="_blank" rel="noopener noreferrer">
                <FileText size={18} aria-hidden="true" />
                View certification
              </a>
            </Button>
          </div>
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
  { geometry: "tetrahedron", cameraPosition: [11, 0, 0] },
  { geometry: "octahedron", cameraPosition: [0, 11, 0] },
];

const TECHNICAL_CRYSTALS_2: { geometry: GeometryType; cameraPosition: [number, number, number] }[] = [
  { geometry: "icosahedron", cameraPosition: [0, 0, 11] },
];

const SOFT_CRYSTALS: { geometry: GeometryType; cameraPosition: [number, number, number] }[] = [
  { geometry: "octahedron2", cameraPosition: [0, 11, 0] },
  { geometry: "octahedron3", cameraPosition: [0, 11, 0] },
];

export default function CrystalScene() {
  const tetraViewRef = useRef<HTMLDivElement>(null);
  const octaViewRef = useRef<HTMLDivElement>(null);
  const icoViewRef = useRef<HTMLDivElement>(null);
  const octa2ViewRef = useRef<HTMLDivElement>(null);
  const octa3ViewRef = useRef<HTMLDivElement>(null);
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
    octahedron2: octa2ViewRef,
    octahedron3: octa3ViewRef,
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
    <div ref={containerRef} className="relative w-full py-8 space-y-12">
      {/* Section Technical Skills */}
      <section className="w-full max-w-[96rem] mx-auto px-4 sm:px-8">
        <div className="flex flex-col items-center mb-6 text-center">
          <h2 className="text-3xl font-bold text-lilac-1000 mb-2">Technical Skills</h2>
          <p className="text-lilac-200/80 max-w-md text-sm sm:text-base">
            Frontend, Backend, Mobile, Data/ML, Tools & DevOps, Integrations
          </p>
        </div>

        <div className="flex justify-center mb-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lilac-950/60 border border-lilac-500/30 text-xs text-lilac-200">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            Click on a skill to view the details
          </span>
        </div>

        <div className="bg-[#180e29]/90 backdrop-blur-md border border-lilac-800/40 rounded-xl p-4 sm:p-6 shadow-lg transition-all duration-300 hover:border-lilac-500/60 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] max-w-4xl mx-auto">


          <div className="min-h-[650px] sm:min-h-[420px] lg:min-h-[480px] w-full grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-16 lg:gap-20 items-center justify-center">
            {TECHNICAL_CRYSTALS.map(({ geometry, cameraPosition }) => (
              <View
                key={geometry}
                ref={viewRefsByGeometry[geometry]}
                className="relative w-full h-[350px] sm:h-full overflow-visible"
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



          {/* Ligne 2 : icosaèdre centré seul */}
          <div className="min-h-[420px] sm:min-h-[420px] lg:min-h-[480px] w-full grid grid-cols-1 place-items-center mt-2">
            {TECHNICAL_CRYSTALS_2.map(({ geometry, cameraPosition }) => (
              <View
                key={geometry}
                ref={viewRefsByGeometry[geometry]}
                className="relative w-full max-w-md h-[350px] sm:h-full overflow-visible"
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
        </div>
      </section>

      {/* Section Soft Skills */}
      <section className="w-full max-w-4xl mx-auto px-4">
        <div className="flex flex-col items-center mb-6 text-center">
          <h2 className="text-3xl font-bold text-lilac-1000 mb-2">Soft Skills</h2>
          <p className="text-lilac-200/80 max-w-md text-sm sm:text-base">
            Character traits, languages, and communication abilities
          </p>
        </div>

        <div className="bg-[#180e29]/90 backdrop-blur-md border border-lilac-800/40 rounded-xl p-4 sm:p-6 shadow-lg transition-all duration-300 hover:border-lilac-500/60 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]">
          <div className="min-h-[750px] sm:min-h-[420px] lg:min-h-[480px] w-full grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-16 lg:gap-20 items-center justify-center mx-auto">
            {SOFT_CRYSTALS.map(({ geometry, cameraPosition }) => (
              <View
                key={geometry}
                ref={viewRefsByGeometry[geometry]}
                className="relative w-full h-[350px] sm:h-full"
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
        </div>
      </section>

      {/* Rendu global Three.js Canvas */}
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

      {/* Overlay et Modale */}
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