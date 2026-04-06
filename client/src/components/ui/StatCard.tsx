import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

interface StatCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  change?: number;
  color: string;
  icon: any;
}

const StatCard = ({
  label,
  value,
  prefix = "$",
  suffix = "",
  change,
  color,
  icon,
}: StatCardProps) => {
  const numRef = useRef<HTMLSpanElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!numRef.current) return;

    const obj = { val: 0 };
    gsap.to(obj, {
      val: value,
      duration: 1.8,
      ease: "power2.out",
      onUpdate: () => {
        if (!numRef.current) return;
        const formatted = new Intl.NumberFormat("en-US", {
          minimumFractionDigits: value % 1 !== 0 ? 2 : 0,
          maximumFractionDigits: 2,
        }).format(obj.val);
        numRef.current.textContent = `${prefix}${formatted}${suffix}`;
      },
    });

    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", delay: 0.1 },
    );
  }, [value]);

  const isPositive = (change ?? 0) >= 0;

  return (
    <div
      ref={cardRef}
      className="glass-card p-5 flex flex-col gap-4"
      style={{ opacity: 0 }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p
            style={{
              fontSize: 12,
              color: "var(--text-secondary)",
              fontWeight: 500,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            {label}
          </p>
          <p
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: 28,
              fontWeight: 700,
              color: "var(--text-primary)",
              marginTop: 6,
              lineHeight: 1,
            }}
          >
            <span ref={numRef}>
              {prefix}0{suffix}
            </span>
          </p>
        </div>
        <div
          className="flex items-center justify-center rounded-xl"
          style={{
            width: 44,
            height: 44,
            background: `${color}15`,
            border: `1px solid ${color}30`,
            fontSize: 20,
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
      </div>
      {change !== undefined && (
        <div className="flex items-center gap-1.5">
          <span
            style={{
              fontSize: 12,
              color: isPositive ? "var(--emerald)" : "var(--red)",
              fontWeight: 600,
            }}
          >
            {isPositive ? <FaArrowUp /> : <FaArrowDown />} {Math.abs(change)}%
          </span>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
            vs last month
          </span>
        </div>
      )}
      <div
        className="h-0.5 rounded-full"
        style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
      />
    </div>
  );
};

export default StatCard;
