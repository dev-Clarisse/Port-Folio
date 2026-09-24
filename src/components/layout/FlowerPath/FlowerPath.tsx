import { useLayoutEffect, useRef, useState } from 'react';
import { catmullRomToBezier } from '@/lib/utils';

interface Point {
    x: number;
    y: number;
}

interface BloomingPathProps {
    points: Point[];
    flowerCount?: number;
    duration?: number;
    className?: string;
}

function MiniFlower({
    x,
    y,
    delay,
}: {
    x: number;
    y: number;
    delay: number;
}) {
    return (
        <g
            style={{
                transformOrigin: `${x}px ${y}px`,
                animation: `bloom-pop 0.6s ease-out ${delay}ms both`,
            }}
        >
            {[0, 72, 144, 216, 288].map((angle) => (
                <ellipse
                    key={angle}
                    cx={x}
                    cy={y - 9}
                    rx={4.5}
                    ry={7}
                    fill="var(--color-lilac-300)"
                    opacity={0.9}
                    transform={`rotate(${angle} ${x} ${y})`}
                />
            ))}

            <circle
                cx={x}
                cy={y}
                r={3.5}
                fill="var(--color-lilac-600)"
            />
        </g>
    );
}

export default function FlowerPath({
    points,
    flowerCount = 31,
    duration = 12000,
    className = '',
}: BloomingPathProps) {
    const svgRef = useRef<SVGSVGElement>(null);
    const glowPathRef = useRef<SVGPathElement>(null);
    const pathRef = useRef<SVGPathElement>(null);

    const [flowers, setFlowers] = useState<
        { x: number; y: number; delay: number }[]
    >([]);

    useLayoutEffect(() => {
        if (
            !svgRef.current ||
            !pathRef.current ||
            !glowPathRef.current ||
            points.length < 2
        ) {
            return;
        }

        // Utilisation directe des points de zigzag pour générer la courbe adoucie
        const mainD = catmullRomToBezier(points);

        glowPathRef.current.setAttribute('d', mainD);
        pathRef.current.setAttribute('d', mainD);

        const length = pathRef.current.getTotalLength();

        pathRef.current.style.transition = 'none';
        glowPathRef.current.style.transition = 'none';

        pathRef.current.style.strokeDasharray = `${length}`;
        glowPathRef.current.style.strokeDasharray = `${length}`;

        pathRef.current.style.strokeDashoffset = `${length}`;
        glowPathRef.current.style.strokeDashoffset = `${length}`;

        const rawPositions = Array.from(
            { length: flowerCount },
            (_, index) => {
                const fraction = (index + 1) / (flowerCount + 2);
                const point = pathRef.current!.getPointAtLength(
                    length * fraction
                );

                return {
                    x: point.x,
                    y: point.y,
                };
            }
        );

        const BLOOM_STAGGER = 250;
        const BLOOM_START_OFFSET = 300;

        setFlowers(
            rawPositions.map((flower, index) => ({
                ...flower,
                delay:
                    duration +
                    BLOOM_START_OFFSET +
                    index * BLOOM_STAGGER,
            }))
        );

        void pathRef.current.getBoundingClientRect();

        const START_DELAY = 300;

        const timeoutId = setTimeout(() => {
            requestAnimationFrame(() => {
                if (!pathRef.current || !glowPathRef.current) return;

                const transition = `stroke-dashoffset ${duration}ms ease-in-out`;

                pathRef.current.style.transition = transition;
                glowPathRef.current.style.transition = transition;

                pathRef.current.style.strokeDashoffset = '0';
                glowPathRef.current.style.strokeDashoffset = '0';
            });
        }, START_DELAY);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [points, flowerCount, duration]);

    return (
        <svg
            ref={svgRef}
            className={`absolute inset-0 h-full w-full pointer-events-none ${className}`}
            style={{ overflow: 'visible' }}
        >
            {/* Halo lumineux */}
            <path
                ref={glowPathRef}
                fill="none"
                stroke="var(--color-lilac-400)"
                strokeWidth={10}
                strokeLinecap="round"
                style={{
                    filter: 'blur(8px)',
                    opacity: 0.85,
                    willChange: 'stroke-dashoffset',
                }}
            />

            {/* Tracé principal */}
            <path
                ref={pathRef}
                fill="none"
                stroke="var(--color-lilac-300)"
                strokeWidth={5}
                strokeLinecap="round"
                style={{
                    willChange: 'stroke-dashoffset',
                    filter: 'drop-shadow(0 0 8px rgba(216,180,254,0.8))',
                }}
            />

            {flowers.map((flower, index) => (
                <MiniFlower key={index} {...flower} />
            ))}
        </svg>
    );
}