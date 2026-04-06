import { useEffect, useRef } from "react";
import gsap from "gsap";
import { formatCurrency } from "../../utils/formatters";
import { useAppSelector } from "../../store/hooks";

interface CreditCardProps {
  balance: number;
  cardNumber?: string;
  holder?: string;
  expiry?: string;
}

const CreditCard = ({
  balance,
  cardNumber = "4832 **** **** 2847",
  holder = "Alex Dev",
  expiry = "09/28",
}: CreditCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isDark = useAppSelector((s) => s.ui.isDark);

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, scale: 0.92, rotateY: -8 },
      {
        opacity: 1,
        scale: 1,
        rotateY: 0,
        duration: 0.7,
        ease: "power3.out",
        delay: 0.3,
      },
    );
  }, []);

  const cardGradient = isDark
    ? "linear-gradient(135deg, #0D2137 0%, #0A1628 50%, #071220 100%)"
    : "linear-gradient(135deg, #1a3a5c 0%, #0f2744 50%, #0a1e36 100%)";

  return (
    <div
      ref={cardRef}
      className="relative rounded-2xl p-6 overflow-hidden"
      style={{
        background: cardGradient,
        border: "1px solid var(--cyan)30",
        minHeight: 180,
        opacity: 0,
        perspective: "1000px",
      }}
    >
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(var(--cyan) 1px, transparent 1px),
            linear-gradient(90deg, var(--cyan) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      <div
        className="absolute top-0 right-0 rounded-full"
        style={{
          width: 160,
          height: 160,
          background:
            "radial-gradient(circle, var(--cyan)20 0%, transparent 70%)",
          transform: "translate(40px, -40px)",
        }}
      />

      <div className="relative z-10 flex flex-col h-full gap-4">
        <div className="flex items-center justify-between">
          <p
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.5)",
              fontWeight: 500,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            Main Card
          </p>

          <div
            className="rounded"
            style={{
              width: 32,
              height: 24,
              background: "linear-gradient(135deg, var(--amber), #D97706)",
              opacity: 0.9,
            }}
          />
        </div>

        <div>
          <p
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.4)",
              marginBottom: 4,
            }}
          >
            Balance
          </p>
          <p
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: 26,
              fontWeight: 800,
              color: "#FFFFFF",
              lineHeight: 1,
            }}
          >
            {formatCurrency(balance)}
          </p>
        </div>

        <div className="flex items-end justify-between mt-auto">
          <div>
            <p
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.6)",
                letterSpacing: "0.1em",
                fontFamily: "monospace",
              }}
            >
              {cardNumber}
            </p>
            <p
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.4)",
                marginTop: 4,
              }}
            >
              {holder}
            </p>
          </div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
            {expiry}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreditCard;
