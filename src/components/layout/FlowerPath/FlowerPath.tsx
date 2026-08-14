import { useLayoutEffect, useRef, useState } from 'react';
import { catmullRomToBezier } from '@/lib/utils';

interface Point { x: number; y: number }

interface BloomingPathProps {
    points: Point[];
    flowerCount?: number;
    duration?: number;
    className?: string;
}

function normalize(dx: number, dy: number) {
    const len = Math.hypot(dx, dy) || 1;
    return { x: dx / len, y: dy / len };
}

function MiniFlower({ x, y, delay }: { x: number; y: number; delay: number }) {
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
            <circle cx={x} cy={y} r={3.5} fill="var(--color-lilac-600)" />
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
    const [flowers, setFlowers] = useState<{ x: number; y: number; delay: number }[]>([]);

    const BEND_DISTANCE = 300;
    const BEND_FACTOR = 2;
    const BEND_DISTANCE1 = 350;

    useLayoutEffect(() => {
        if (!svgRef.current || !pathRef.current || !glowPathRef.current || points.length < 2) return;

        const rect = svgRef.current.getBoundingClientRect();
        const EXT = Math.max(rect.width, rect.height) * 1.5;

        const first = points[0];
        const second = points[1];
        const last = points[points.length - 1];
        const beforeLast = points[points.length - 2];

        const extStart = { x: first.x, y: first.y - EXT };
        const extEnd = { x: last.x, y: last.y + EXT };

        const mainD = catmullRomToBezier(points);
        const mainCommands = mainD.substring(mainD.indexOf('C'));

        const dirFirst = normalize(second.x - first.x, second.y - first.y);
        const dirLast = normalize(beforeLast.x - last.x, beforeLast.y - last.y);

        const headCp1 = { x: extStart.x, y: first.y - BEND_DISTANCE };
        const headCp2 = {
            x: first.x - dirFirst.x * BEND_DISTANCE * BEND_FACTOR,
            y: first.y - dirFirst.y * BEND_DISTANCE * BEND_FACTOR,
        };

        const tailCp1 = {
            x: last.x - dirLast.x * BEND_DISTANCE1 * BEND_FACTOR,
            y: last.y - dirLast.y * BEND_DISTANCE1 * BEND_FACTOR,
        };
        const tailCp2 = { x: extEnd.x, y: last.y + BEND_DISTANCE1 };

        const d =
            `M ${extStart.x} ${extStart.y} ` +
            `C ${headCp1.x} ${headCp1.y}, ${headCp2.x} ${headCp2.y}, ${first.x} ${first.y} ` +
            mainCommands +
            ` C ${tailCp1.x} ${tailCp1.y}, ${tailCp2.x} ${tailCp2.y}, ${extEnd.x} ${extEnd.y}`;

        glowPathRef.current.setAttribute('d', d);
        pathRef.current.setAttribute('d', d);

        const length = pathRef.current.getTotalLength();

        const SAMPLES = 300;
        const CONSECUTIVE_REQUIRED = 5; // évite un faux positif sur un simple dépassement de courbe

        const isVisible = (l: number) => {
            const pt = pathRef.current!.getPointAtLength(l);
            return pt.y >= -20 && pt.y <= rect.height + 20;
        };

        let visibleStartLength = 0;
        for (let i = 0; i <= SAMPLES; i++) {
            const l = (length * i) / SAMPLES;
            if (!isVisible(l)) continue;

            let stable = true;
            for (let j = 1; j <= CONSECUTIVE_REQUIRED; j++) {
                const lNext = (length * (i + j)) / SAMPLES;
                if (lNext > length || !isVisible(lNext)) {
                    stable = false;
                    break;
                }
            }
            if (stable) {
                visibleStartLength = l;
                break;
            }
        }

        let visibleEndLength = length;
        for (let i = SAMPLES; i >= 0; i--) {
            const l = (length * i) / SAMPLES;
            if (!isVisible(l)) continue;

            let stable = true;
            for (let j = 1; j <= CONSECUTIVE_REQUIRED; j++) {
                const lPrev = (length * (i - j)) / SAMPLES;
                if (lPrev < 0 || !isVisible(lPrev)) {
                    stable = false;
                    break;
                }
            }
            if (stable) {
                visibleEndLength = l;
                break;
            }
        }

        pathRef.current.style.transition = 'none';
        glowPathRef.current.style.transition = 'none';
        pathRef.current.style.strokeDasharray = `${length}`;
        glowPathRef.current.style.strokeDasharray = `${length}`;
        pathRef.current.style.strokeDashoffset = `${length - visibleStartLength}`;
        glowPathRef.current.style.strokeDashoffset = `${length - visibleStartLength}`;

        const visibleLength = visibleEndLength - visibleStartLength;
        const visibleDuration = duration * (visibleLength / length);

        const rawPositions = Array.from({ length: flowerCount }, (_, i) => {
            const fraction = (i + 1) / (flowerCount + 2);
            const pt = pathRef.current!.getPointAtLength(length * fraction);
            return { x: pt.x, y: pt.y };
        });

        const BLOOM_STAGGER = 300;
        const BLOOM_START_OFFSET = 200;
        setFlowers(
            rawPositions.map((f, i) => ({
                ...f,
                delay: visibleDuration + BLOOM_START_OFFSET + i * BLOOM_STAGGER,
            }))
        );

        void pathRef.current.getBoundingClientRect();

        const START_DELAY = 600; // ms avant que le tracé ne démarre

        const timeoutId = setTimeout(() => {
            requestAnimationFrame(() => {
                if (!pathRef.current || !glowPathRef.current) return;
                pathRef.current.style.transition = `stroke-dashoffset ${visibleDuration}ms ease-in-out`;
                glowPathRef.current.style.transition = `stroke-dashoffset ${visibleDuration}ms ease-in-out`;
                pathRef.current.style.strokeDashoffset = `${length - visibleEndLength}`;
                glowPathRef.current.style.strokeDashoffset = `${length - visibleEndLength}`;
            });
        }, START_DELAY);

        return () => {
            clearTimeout(timeoutId);
        };

    }, [points, flowerCount, duration]);

    return (
        <svg
            ref={svgRef}
            className={`absolute inset-0 w-full h-full ${className}`}
            style={{ overflow: 'hidden' }}
        >
            <path
                ref={glowPathRef}
                fill="none"
                stroke="var(--color-lilac-400)"
                strokeWidth={4}
                strokeLinecap="round"
                style={{ filter: 'blur(4px)', opacity: 0.6, willChange: 'stroke-dashoffset' }}
            />
            <path
                ref={pathRef}
                fill="none"
                stroke="var(--color-lilac-400)"
                strokeWidth={4}
                strokeLinecap="round"
                style={{ willChange: 'stroke-dashoffset' }}
            />
            {flowers.map((f, i) => (
                <MiniFlower key={i} {...f} />
            ))}
        </svg>
    );
}