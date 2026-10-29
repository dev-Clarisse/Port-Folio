import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Line, RoundedBox } from "@react-three/drei";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { experiences, type Experience } from "@/data/experiences";
import { ExperienceCard, ExperienceIcon } from "@/components/sections/Experiences/ExperienceCard";

/* ───────────────────────── Réglages de l'hélice ─────────────────────────
   Unités = unités 3D de la scène (la caméra voit environ 9 unités de haut). */
const RADIUS = 3; // distance entre l'axe de la barre et les cartes : c'est "l'écart"
const BAR_RADIUS = 0.1; // épaisseur de la barre
const ANGLE_STEP = (Math.PI * 2) / 3; // chaque carte tourne de 120° autour de la barre
const RISE = 2.4; // chaque carte descend de 2.4 unités par rapport à la précédente

/* Les cartes sont de vrais éléments HTML placés dans la scène 3D (composant Html de Drei).
   Avec `transform`, 1 pixel CSS vaut DISTANCE_FACTOR / 400 unités 3D. */
const DISTANCE_FACTOR = 3;
const PX = DISTANCE_FACTOR / 400;
const CARD_WIDTH_PX = 440;
const ICON_SIZE_PX = 44; // h-11 w-11
const ICON_TOP_PX = 32; // même position que "top-8" dans la frise 2D
const SIDE_GAP = 0.35; // espace horizontal entre la barre et le bord de la carte

const LAST = experiences.length - 1;
const BAR_HEIGHT = LAST * RISE + 9; // la barre dépasse en haut et en bas de l'hélice

/* Palette (mêmes valeurs que index.css) */
const COLORS = {
  card: new THREE.Color("#1a1025"),
  cardDim: new THREE.Color("#08050d"),
  border: new THREE.Color("#c19ee0"),
};

/* État partagé entre la "caméra" de l'hélice et les cartes, mis à jour à chaque image
   (on évite le state React ici : 60 re-rendus par seconde seraient beaucoup trop lents). */
type HelixState = { rotation: number; y: number };

/* ───────────────────────── Shaders de la barre ─────────────────────────
   Un shader est un petit programme exécuté par la carte graphique :
   - le vertex shader place chaque sommet de la géométrie à l'écran ;
   - le fragment shader choisit la couleur de chaque pixel. */

// Dégradé vertical rose pastel → lavande → violet profond (comme la barre 2D)
const barVertex = /* glsl */ `
  varying float vY;
  void main() {
    vY = uv.y; // uv.y vaut 0 en bas du cylindre et 1 en haut
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const barFragment = /* glsl */ `
  uniform vec3 uTop;
  uniform vec3 uMid;
  uniform vec3 uBottom;
  varying float vY;
  void main() {
    vec3 color = vY > 0.5
      ? mix(uMid, uTop, (vY - 0.5) * 2.0)
      : mix(uBottom, uMid, vY * 2.0);
    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment> // conversion des couleurs vers l'espace sRGB de l'écran
  }
`;

// Halo : plus lumineux là où la surface fait face à la caméra, transparent sur les bords
const glowVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  varying float vY;
  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mvPosition.xyz);
    vY = uv.y;
    gl_Position = projectionMatrix * mvPosition;
  }
`;
const glowFragment = /* glsl */ `
  uniform vec3 uColor;
  varying vec3 vNormal;
  varying vec3 vView;
  varying float vY;
  void main() {
    float facing = pow(abs(dot(vNormal, vView)), 3.0);
    float ends = smoothstep(0.0, 0.15, vY) * smoothstep(1.0, 0.85, vY); // s'estompe aux extrémités
    gl_FragColor = vec4(uColor, facing * ends * 0.55);
    #include <colorspace_fragment>
  }
`;

function Bar() {
  const barUniforms = useMemo(
    () => ({
      uTop: { value: new THREE.Color("#ffc8dd") },
      uMid: { value: new THREE.Color("#b185db") },
      uBottom: { value: new THREE.Color("#6247aa") },
    }),
    []
  );
  const glowUniforms = useMemo(() => ({ uColor: { value: new THREE.Color("#a06cd5") } }), []);

  return (
    // La barre est centrée sur la hauteur de l'hélice
    <group position={[0, -(LAST * RISE) / 2, 0]}>
      <mesh>
        <cylinderGeometry args={[BAR_RADIUS, BAR_RADIUS, BAR_HEIGHT, 32, 1]} />
        <shaderMaterial vertexShader={barVertex} fragmentShader={barFragment} uniforms={barUniforms} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.5, 0.5, BAR_HEIGHT, 32, 1, true]} />
        <shaderMaterial
          vertexShader={glowVertex}
          fragmentShader={glowFragment}
          uniforms={glowUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending} // les couleurs s'additionnent : effet lumineux
        />
      </mesh>
    </group>
  );
}

/* ───────────────────────── Carte ─────────────────────────
   Chaque expérience est composée de :
   - la carte HTML d'origine (identique à la frise 2D), visible quand elle nous fait face ;
   - une silhouette 3D de la même taille, toujours visible : elle donne l'effet d'hélice
     et elle est correctement cachée par la barre quand elle passe derrière ;
   - le rond d'icône posé sur la barre, relié à la carte par un fil. */
function Card({ experience, index, helix }: { experience: Experience; index: number; helix: React.RefObject<HelixState> }) {
  const cardEl = useRef<HTMLDivElement | null>(null);
  const iconEl = useRef<HTMLDivElement>(null);
  const shape = useRef<THREE.Group>(null);
  const silhouette = useRef<THREE.MeshBasicMaterial>(null);
  const edge = useRef<THREE.MeshBasicMaterial>(null);

  // Hauteur réelle de la carte HTML, pour donner la même taille à sa silhouette 3D.
  // Html affiche son contenu dans une racine React à part : on observe la carte dès qu'elle est
  // attachée au DOM (ref "callback") plutôt que dans un useLayoutEffect, où elle n'existe pas encore.
  const [heightPx, setHeightPx] = useState(300);
  const observer = useRef<ResizeObserver | null>(null);
  const attachCard = useCallback((el: HTMLDivElement | null) => {
    observer.current?.disconnect();
    cardEl.current = el;
    if (!el) return;
    observer.current = new ResizeObserver(() => setHeightPx(el.offsetHeight));
    observer.current.observe(el);
  }, []);
  useEffect(() => () => observer.current?.disconnect(), []);

  // Comme dans la frise 2D, les cartes sont à côté de la barre, une fois à droite, une fois à gauche
  const side = index % 2 === 0 ? 1 : -1;
  const width = CARD_WIDTH_PX * PX;
  const height = heightPx * PX;
  const cardX = side * (width / 2 + SIDE_GAP);
  const iconY = height / 2 - (ICON_TOP_PX + ICON_SIZE_PX / 2) * PX;
  const iconZ = BAR_RADIUS + (ICON_SIZE_PX / 2) * PX;

  // Boucle de rendu : appelée à chaque image (≈ 60 fois par seconde)
  useFrame(() => {
    if (!helix.current) return;
    // Angle de la carte dans le monde : 0 = face à la caméra, π = derrière la barre
    const worldAngle = index * ANGLE_STEP + helix.current.rotation;
    const facing = Math.cos(worldAngle); // 1 devant, -1 derrière
    const worldY = helix.current.y - index * RISE;

    // La carte HTML n'apparaît que lorsqu'elle nous fait presque face (sinon on la verrait de biais ou à l'envers)
    const show = THREE.MathUtils.smoothstep(facing, 0.75, 0.97);
    for (const el of [cardEl.current, iconEl.current]) {
      if (!el) continue;
      el.style.opacity = String(show);
      el.style.pointerEvents = show > 0.6 ? "auto" : "none";
    }

    // Quand la carte HTML est affichée, sa silhouette 3D est inutile ; sinon elle s'assombrit
    // en s'éloignant du centre ou en passant derrière la barre
    if (shape.current) shape.current.visible = show < 0.99;
    const light =
      THREE.MathUtils.smoothstep(facing, -0.3, 0.95) * (1 - THREE.MathUtils.smoothstep(Math.abs(worldY), 1.2, 4));
    const k = 0.25 + 0.75 * light;
    silhouette.current?.color.lerpColors(COLORS.cardDim, COLORS.card, k);
    edge.current?.color.lerpColors(COLORS.cardDim, COLORS.border, k * 0.7);
  });

  return (
    // Placement sur l'hélice : rotation autour de la barre + descente
    <group rotation={[0, index * ANGLE_STEP, 0]} position={[0, -index * RISE, 0]}>
      {/* Fil reliant le rond d'icône (sur la barre) au bord intérieur de la carte : c'est l'écart */}
      <Line
        points={[
          [0, iconY, iconZ],
          [side * SIDE_GAP, iconY, RADIUS],
        ]}
        color="#c19ee0"
        lineWidth={1.5}
        transparent
        opacity={0.7}
      />

      <group position={[cardX, 0, RADIUS]}>
        {/* Silhouette 3D, visible quand la carte n'est pas face à nous.
            Le liseré (un peu plus grand) est enfermé dans l'épaisseur du fond : on ne voit que son contour,
            de face comme de dos */}
        <group ref={shape}>
          <RoundedBox args={[width + 0.03, height + 0.03, 0.02]} radius={16 * PX} position={[0, 0, -0.03]}>
            <meshBasicMaterial ref={edge} />
          </RoundedBox>
          <RoundedBox args={[width, height, 0.05]} radius={16 * PX} position={[0, 0, -0.03]}>
            <meshBasicMaterial ref={silhouette} />
          </RoundedBox>
        </group>

        {/* Carte HTML d'origine, orientée vers l'extérieur de l'hélice */}
        <Html transform distanceFactor={DISTANCE_FACTOR} zIndexRange={[40, 0]}>
          <div ref={attachCard} style={{ width: CARD_WIDTH_PX }}>
            <ExperienceCard experience={experience} />
          </div>
        </Html>
      </group>

      {/* Rond d'icône, posé contre la barre */}
      <Html transform distanceFactor={DISTANCE_FACTOR} position={[0, iconY, iconZ]} zIndexRange={[40, 0]}>
        <div ref={iconEl}>
          <ExperienceIcon experience={experience} />
        </div>
      </Html>
    </group>
  );
}

/* ───────────────────────── Animation au défilement ─────────────────────────
   On lit la progression du scroll dans la zone `scrollRef` (0 → 1),
   puis on tourne et on remonte l'hélice pour amener la carte suivante face à nous. */
function Helix({ scrollRef }: { scrollRef: React.RefObject<HTMLDivElement | null> }) {
  const group = useRef<THREE.Group>(null);
  const helix = useRef<HelixState>({ rotation: 0, y: 0 });
  const smoothProgress = useRef(0);

  useFrame((state, delta) => {
    const el = scrollRef.current;
    if (!el || !group.current) return;

    const rect = el.getBoundingClientRect();
    const scrollable = rect.height - window.innerHeight;
    const target = scrollable > 0 ? THREE.MathUtils.clamp(-rect.top / scrollable, 0, 1) : 0;
    // Interpolation douce vers la cible : le mouvement continue un peu après le scroll
    smoothProgress.current = THREE.MathUtils.damp(smoothProgress.current, target, 5, delta);

    const p = smoothProgress.current * LAST;
    helix.current.rotation = -p * ANGLE_STEP + Math.sin(state.clock.elapsedTime * 0.4) * 0.05;
    helix.current.y = p * RISE;
    group.current.rotation.y = helix.current.rotation;
    group.current.position.y = helix.current.y;

    // Légère parallaxe : la caméra suit un peu la souris
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, state.pointer.x * 0.8, 3, delta);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, 0.6 + state.pointer.y * 0.4, 3, delta);
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={group}>
      <Bar />
      {experiences.map((experience, index) => (
        <Card key={experience.title} experience={experience} index={index} helix={helix} />
      ))}
    </group>
  );
}

export default function ExperienceHelix({ scrollRef }: { scrollRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <Canvas
      camera={{ position: [0, 0.6, 11], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true }} // fond transparent : le ciel étoilé reste visible
    >
      <Helix scrollRef={scrollRef} />
    </Canvas>
  );
}
