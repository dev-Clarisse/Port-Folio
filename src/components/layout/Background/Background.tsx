import { useEffect, useRef } from 'react'

export default function Background({ children }: { children?: React.ReactNode }) {
    const skyRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const sky = skyRef.current
        if (!sky) return

        for (let i = 0; i < 80; i++) {
            const c = document.createElement('div')
            const size = Math.random() * 1.5 + 0.5
            const dur = (Math.random() * 4 + 3).toFixed(1)
            const delay = (Math.random() * 5).toFixed(1)
            c.className = 'crystal'
            c.style.cssText = `
  position: absolute;
  width: ${size}px; height: ${size}px;
  left: ${Math.random() * 100}%;
  top: ${Math.random() * 100}%;
  background: white;
  border-radius: 50%;
  box-shadow: 0 0 ${size * 2}px ${size}px rgba(193,158,224,0.4), 
              0 0 ${size * 3}px ${size}px rgba(98,71,170,0.2);
  animation: crystal-shine ${dur}s ease-in-out infinite -${delay}s;
`
            sky.appendChild(c)
        }

        return () => {
            sky.querySelectorAll('.crystal').forEach(el => el.remove())
        }
    }, [])

    return (
        <div className="background">
            <div ref={skyRef} className="crystal-layer" />
            <div className="content-layer">
                {children}
            </div>
        </div>
    )
}