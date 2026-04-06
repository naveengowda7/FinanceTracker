import { useRef, useEffect } from "react";
import gsap from "gsap";

interface InsightCardProps {
  icon: any;
  label: string;
  value: string;
  sub: string;
  color: string;
  delay?: number;
}

const InsightCard = ({
  icon,
  label,
  value,
  sub,
  color,
  delay = 0,
}: InsightCardProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
        delay: delay,
      },
    );
  }, []);

  return (
    <div
      ref={ref}
      className="glass-card p-5 flex flex-col gap-3"
      style={{ opacity: 0 }}
    >
      <div className="flex items-start justify-between">
        <p
          style={{
            fontSize: 11,
            color: "var(--text-muted)",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </p>
        <div
          className="flex items-center justify-center rounded-xl"
          style={{
            width: 36,
            height: 36,
            background: `${color}15`,
            border: `1px solid ${color}30`,
            fontSize: 18,
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
      </div>

      <p
        style={{
          fontFamily: "Syne, sans-serif",
          fontSize: 22,
          fontWeight: 700,
          color: "var(--text-primary)",
          lineHeight: 1.1,
        }}
      >
        {value}
      </p>

      <p
        style={{
          fontSize: 12,
          color: "var(--text-secondary)",
          lineHeight: 1.5,
        }}
      >
        {sub}
      </p>

      <div
        className="h-px rounded-full"
        style={{
          background: `linear-gradient(90deg, ${color}, transparent)`,
        }}
      />
    </div>
  );
};

export default InsightCard;
