import { useEffect, useRef, useState } from 'react';
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
    flowerCount = 25,
    duration = 2200,
    className = '',
}: BloomingPathProps) {
    const svgRef = useRef<SVGSVGElement>(null);
    const pathRef = useRef<SVGPathElement>(null);
    const [pathLength, setPathLength] = useState(0);
    const [started, setStarted] = useState(false);
    const [flowers, setFlowers] = useState<{ x: number; y: number; delay: number }[]>([]);
    const [extendedD, setExtendedD] = useState('');

    useEffect(() => {
        if (!svgRef.current || points.length < 2) return;

        
        const rect = svgRef.current.getBoundingClientRect();
        const EXT = Math.max(rect.width, rect.height) * 1.5;

        const dirStart = normalize(points[0].x - points[1].x, points[0].y - points[1].y);
        const extStart = {
            x: points[0].x + dirStart.x * EXT,
            y: points[0].y + dirStart.y * EXT,
        };

        const last = points[points.length - 1];
        const prev = points[points.length - 2];
        const dirEnd = normalize(last.x - prev.x, last.y - prev.y);
        const extEnd = {
            x: last.x + dirEnd.x * EXT,
            y: last.y + dirEnd.y * EXT,
        };

        const fullPoints = [extStart, ...points, extEnd];
        setExtendedD(catmullRomToBezier(fullPoints));
    }, [points]);

    useEffect(() => {
        if (!pathRef.current || !extendedD) return;
        const length = pathRef.current.getTotalLength();
        setPathLength(length);
        setStarted(false);

        
        const positions = Array.from({ length: flowerCount }, (_, i) => {
            const fraction = (i + 1) / (flowerCount + 2);
            const pt = pathRef.current!.getPointAtLength(length * fraction);
            return { x: pt.x, y: pt.y, delay: fraction * duration };
        });
        setFlowers(positions);

        let raf2 = 0;
        const raf1 = requestAnimationFrame(() => {
            raf2 = requestAnimationFrame(() => setStarted(true));
        });
        return () => {
            cancelAnimationFrame(raf1);
            cancelAnimationFrame(raf2);
        };
    }, [extendedD, flowerCount, duration]);

    return (
        <svg
            ref={svgRef}
            className={`absolute inset-0 w-full h-full ${className}`}
            style={{ overflow: 'hidden' }}
        >
            <path
                ref={pathRef}
                d={extendedD}
                fill="none"
                stroke="var(--color-lilac-400)"
                strokeWidth={4}
                strokeLinecap="round"
                style={{
                    filter: 'drop-shadow(0 0 6px var(--color-lilac-400))',
                    strokeDasharray: pathLength,
                    strokeDashoffset: started ? 0 : pathLength,
                    transition: `stroke-dashoffset ${duration}ms ease-in-out`,
                }}
            />
            {started && flowers.map((f, i) => <MiniFlower key={i} {...f} />)}
        </svg>
    );
}