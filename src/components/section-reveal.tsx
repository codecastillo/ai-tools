'use client';
import { useEffect, useRef, useState } from 'react';

interface Props { children: React.ReactNode; threshold?: number; }

export default function SectionReveal({ children, threshold = 0.15 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setRevealed(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setRevealed(true);
            obs.disconnect();
            break;
          }
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      data-revealed={revealed ? 'true' : 'false'}
      className="transition-all duration-700 ease-out data-[revealed=false]:opacity-0 data-[revealed=false]:translate-y-4 data-[revealed=true]:opacity-100 data-[revealed=true]:translate-y-0"
    >
      {children}
    </div>
  );
}
