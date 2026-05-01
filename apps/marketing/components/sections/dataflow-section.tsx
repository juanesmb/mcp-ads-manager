"use client";

import { MarketingContainer } from "@/components/ui/container";
import { JumonMark } from "@/components/ui/jumon-mark";
import { dataflow } from "@/content/landing";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@jumon/ui/cn";

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

type FlowNodeProps = {
  icon: string;
  label: string;
  active?: boolean;
  badge?: string;
  inView: boolean;
  delay: number;
};

function FlowNode({ icon, label, active = true, badge, inView, delay }: FlowNodeProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 transition-[opacity,transform] duration-500 ease-out",
        inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
        !active && "opacity-40",
      )}
      style={{ transitionDelay: inView ? `${delay}ms` : "0ms" }}
    >
      <div
        className={cn(
          "flex size-10 items-center justify-center rounded-[10px] border-[0.5px] bg-[var(--j-canopy)] font-mono text-[13px] font-medium",
          active ? "border-[#1a3038] text-[var(--j-fern)]" : "border-[#1a3038] text-[var(--j-slate)]",
        )}
      >
        {icon}
      </div>
      <span className="text-center text-[12px] font-medium text-[var(--j-mist)]">{label}</span>
      {badge && (
        <span className="rounded-[20px] bg-[var(--j-deep-teal)] px-2 py-0.5 text-[10px] text-[var(--j-slate)]">
          {badge}
        </span>
      )}
    </div>
  );
}

type HubNodeProps = { inView: boolean; delay: number };

function HubNode({ inView, delay }: HubNodeProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-[var(--j-radius-lg)] border border-[var(--j-ember)] bg-[var(--j-canopy)] px-5 py-3",
        "transition-[opacity,transform] duration-500 ease-out",
        inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
      )}
      style={{ transitionDelay: inView ? `${delay}ms` : "0ms" }}
    >
      <JumonMark width={36} height={20} />
      <span className="text-[13px] font-medium tracking-[0.06em] text-[var(--j-mist)]">
        {dataflow.layers.hub.label}
      </span>
    </div>
  );
}

type UserNodeProps = { inView: boolean; delay: number };

function UserNode({ inView, delay }: UserNodeProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 transition-[opacity,transform] duration-500 ease-out",
        inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
      )}
      style={{ transitionDelay: inView ? `${delay}ms` : "0ms" }}
    >
      <div className="flex size-10 items-center justify-center rounded-full border border-[var(--j-ember)] bg-[var(--j-canopy)] text-[18px]">
        👤
      </div>
      <span className="text-[12px] font-medium text-[var(--j-mist)]">
        {dataflow.layers.user.label}
      </span>
    </div>
  );
}

type LayerLabelProps = { children: React.ReactNode; inView: boolean; delay: number };

function LayerLabel({ children, inView, delay }: LayerLabelProps) {
  return (
    <p
      className={cn(
        "text-center text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--j-slate)] transition-opacity duration-500",
        inView ? "opacity-100" : "opacity-0",
      )}
      style={{ transitionDelay: inView ? `${delay}ms` : "0ms" }}
    >
      {children}
    </p>
  );
}

// ---------------------------------------------------------------------------
// Mobile layout — vertical stack with CSS connector line
// ---------------------------------------------------------------------------

function MobileConnector({ inView, delay }: { inView: boolean; delay: number }) {
  return (
    <div className="flex justify-center py-2">
      <div
        className={cn(
          "h-8 w-px bg-[var(--j-fern)] transition-opacity duration-500",
          inView ? "opacity-60" : "opacity-0",
        )}
        style={{ transitionDelay: inView ? `${delay}ms` : "0ms" }}
      />
    </div>
  );
}

function MobileLayout({ inView }: { inView: boolean }) {
  const { sources, agents } = dataflow.layers;
  return (
    <div className="md:hidden">
      <LayerLabel inView={inView} delay={100}>Ad Platforms</LayerLabel>
      <div className="mt-4 flex flex-wrap justify-center gap-6">
        {sources.map((s, i) => (
          <FlowNode
            key={s.id}
            icon={s.icon}
            label={s.label}
            active={s.active}
            badge={"badge" in s ? s.badge : undefined}
            inView={inView}
            delay={150 + i * 60}
          />
        ))}
      </div>

      <MobileConnector inView={inView} delay={330} />
      <div className="flex justify-center">
        <HubNode inView={inView} delay={380} />
      </div>
      <MobileConnector inView={inView} delay={460} />

      <LayerLabel inView={inView} delay={500}>AI Agents</LayerLabel>
      <div className="mt-4 flex flex-wrap justify-center gap-6">
        {agents.map((a, i) => (
          <FlowNode key={a.id} icon={a.icon} label={a.label} inView={inView} delay={540 + i * 60} />
        ))}
      </div>

      <MobileConnector inView={inView} delay={720} />
      <div className="flex justify-center">
        <UserNode inView={inView} delay={770} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Desktop SVG paths
//
// Coordinate system: viewBox="0 0 796 490"
//
// The wrapper div is inside MarketingContainer (max-w-[860px] px-8), so the
// content width available is 860 - 32 - 32 = 796px. The SVG viewBox matches
// this exactly so 1 SVG unit = 1 CSS pixel at max-width.
//
// Sources row uses `grid grid-cols-4` (4 platforms), giving 199px columns.
// Source x-centers: 796/8=100, 796*3/8=299, 796*5/8=498, 796*7/8=697.
//
// Agents row uses `grid grid-cols-3`, giving 265.3px columns.
// Agent x-centers: 796/6≈133, 796/2=398, 796*5/6≈663.
//
// Row y positions (top of element in the 490px-tall wrapper):
//   sources label : top=0    (height ~20px)
//   sources nodes : top=28   icon center y=48, icon bottom y=68
//   hub           : top=165  hub top y=165, hub bottom y=209  (py-3 + 20px mark = 44px)
//   agents label  : top=248  (height ~20px)
//   agents nodes  : top=272  icon center y=292, icon bottom y=312
//   user          : top=405  circle center y=425
// ---------------------------------------------------------------------------

const SVG_W = 796;
const SVG_H = 490;

// 4-column source x-centers
const SRC1_X = Math.round(SVG_W / 8);          // 100 (LinkedIn)
const SRC2_X = Math.round((SVG_W * 3) / 8);    // 299 (Google)
const SRC3_X = Math.round((SVG_W * 5) / 8);    // 498 (Reddit)
const SRC4_X = Math.round((SVG_W * 7) / 8);    // 697 (Meta)

// 3-column agent/hub/user x-centers
const LEFT_X  = Math.round(SVG_W / 6);         // 133
const MID_X   = Math.round(SVG_W / 2);         // 398
const RIGHT_X = Math.round((SVG_W * 5) / 6);   // 663

// Y connection points
const SRC_BOTTOM  = 68;   // bottom of source icon
const HUB_TOP     = 165;  // top of hub pill
const HUB_BOTTOM  = 209;  // bottom of hub pill (165 + 44)
const AGT_TOP     = 272;  // top of agent icon
const AGT_BOTTOM  = 312;  // bottom of agent icon (272 + 40)
const USER_TOP    = 405;  // top of user circle

function FlowPath({ d, inView, delay }: { d: string; inView: boolean; delay: number }) {
  return (
    <>
      {/* Faint ghost track */}
      <path d={d} fill="none" stroke="#4AB89A" strokeWidth="1" opacity="0.15" />
      {/* Animated traveling dash */}
      <path
        d={d}
        fill="none"
        stroke="#4AB89A"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="5 14"
        strokeDashoffset="200"
        opacity={inView ? 0.75 : 0}
        style={
          inView
            ? { animation: "flow-dash 2.2s linear infinite", animationDelay: `${delay}ms` }
            : undefined
        }
      />
    </>
  );
}

function DesktopSvg({ inView }: { inView: boolean }) {
  // Control point vertical offset — tighter curves
  const cv = 44;

  // 4 sources fan into the hub center
  const sourcesToHub: string[] = [
    `M ${SRC1_X},${SRC_BOTTOM} C ${SRC1_X},${SRC_BOTTOM + cv} ${MID_X},${HUB_TOP - cv} ${MID_X},${HUB_TOP}`,
    `M ${SRC2_X},${SRC_BOTTOM} C ${SRC2_X},${SRC_BOTTOM + cv} ${MID_X},${HUB_TOP - cv} ${MID_X},${HUB_TOP}`,
    `M ${SRC3_X},${SRC_BOTTOM} C ${SRC3_X},${SRC_BOTTOM + cv} ${MID_X},${HUB_TOP - cv} ${MID_X},${HUB_TOP}`,
    `M ${SRC4_X},${SRC_BOTTOM} C ${SRC4_X},${SRC_BOTTOM + cv} ${MID_X},${HUB_TOP - cv} ${MID_X},${HUB_TOP}`,
  ];

  const hubToAgents: string[] = [
    `M ${MID_X},${HUB_BOTTOM} C ${MID_X},${HUB_BOTTOM + cv} ${LEFT_X},${AGT_TOP - cv}  ${LEFT_X},${AGT_TOP}`,
    `M ${MID_X},${HUB_BOTTOM} L ${MID_X},${AGT_TOP}`,
    `M ${MID_X},${HUB_BOTTOM} C ${MID_X},${HUB_BOTTOM + cv} ${RIGHT_X},${AGT_TOP - cv} ${RIGHT_X},${AGT_TOP}`,
  ];

  const agentsToUser: string[] = [
    `M ${LEFT_X},${AGT_BOTTOM}  C ${LEFT_X},${AGT_BOTTOM + cv}  ${MID_X},${USER_TOP - cv} ${MID_X},${USER_TOP}`,
    `M ${MID_X},${AGT_BOTTOM}   L ${MID_X},${USER_TOP}`,
    `M ${RIGHT_X},${AGT_BOTTOM} C ${RIGHT_X},${AGT_BOTTOM + cv} ${MID_X},${USER_TOP - cv} ${MID_X},${USER_TOP}`,
  ];

  return (
    <svg
      viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      preserveAspectRatio="xMidYMid meet"
      className="pointer-events-none absolute inset-0 hidden h-full w-full md:block"
      aria-hidden
    >
      {sourcesToHub.map((d, i) => (
        <FlowPath key={`s-h-${i}`} d={d} inView={inView} delay={200 + i * 70} />
      ))}
      {hubToAgents.map((d, i) => (
        <FlowPath key={`h-a-${i}`} d={d} inView={inView} delay={440 + i * 70} />
      ))}
      {agentsToUser.map((d, i) => (
        <FlowPath key={`a-u-${i}`} d={d} inView={inView} delay={680 + i * 70} />
      ))}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Desktop layout — absolute rows inside a fixed-height relative container.
// All `top` values match the Y constants used in DesktopSvg.
// ---------------------------------------------------------------------------

function DesktopLayout({ inView }: { inView: boolean }) {
  const { sources, agents } = dataflow.layers;

  return (
    <div className="relative hidden md:block" style={{ height: `${SVG_H}px` }}>
      <DesktopSvg inView={inView} />

      {/* --- Sources label (top=0) --- */}
      <div className="absolute inset-x-0 top-0">
        <LayerLabel inView={inView} delay={80}>Ad Platforms</LayerLabel>
      </div>

      {/* --- Sources nodes (top=28, icons start at 28, centers at 48, bottoms at 68) --- */}
      <div className="absolute inset-x-0 grid grid-cols-4" style={{ top: "28px" }}>
        {sources.map((s, i) => (
          <div key={s.id} className="flex justify-center">
            <FlowNode
              icon={s.icon}
              label={s.label}
              active={s.active}
              badge={"badge" in s ? s.badge : undefined}
              inView={inView}
              delay={120 + i * 60}
            />
          </div>
        ))}
      </div>

      {/* --- Hub (top=165, bottom=209) --- */}
      <div className="absolute inset-x-0 flex justify-center" style={{ top: "165px" }}>
        <HubNode inView={inView} delay={360} />
      </div>

      {/* --- Agents label (top=248) --- */}
      <div className="absolute inset-x-0" style={{ top: "248px" }}>
        <LayerLabel inView={inView} delay={480}>AI Agents</LayerLabel>
      </div>

      {/* --- Agents nodes (top=272, icons center at 292, bottoms at 312) --- */}
      <div className="absolute inset-x-0 grid grid-cols-3" style={{ top: "272px" }}>
        {agents.map((a, i) => (
          <div key={a.id} className="flex justify-center">
            <FlowNode icon={a.icon} label={a.label} inView={inView} delay={520 + i * 60} />
          </div>
        ))}
      </div>

      {/* --- User (top=405, circle center at 425) --- */}
      <div className="absolute inset-x-0 flex justify-center" style={{ top: "405px" }}>
        <UserNode inView={inView} delay={760} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section root
// ---------------------------------------------------------------------------

export function DataflowSection() {
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.15 });

  return (
    <section ref={ref} className="bg-[var(--j-deep-teal)] py-[88px]">
      <MarketingContainer>
        <p
          className={cn(
            "mb-3 text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--j-fern)] transition-opacity duration-500",
            inView ? "opacity-100" : "opacity-0",
          )}
        >
          {dataflow.label}
        </p>
        <h2
          className={cn(
            "mb-16 text-[var(--j-mist)] transition-[opacity,transform] duration-500 ease-out",
            inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
          )}
          style={{
            fontFamily: "var(--j-font-serif)",
            fontSize: "clamp(30px, 4vw, 46px)",
            fontWeight: 400,
            lineHeight: 1.15,
            transitionDelay: inView ? "60ms" : "0ms",
          }}
        >
          {dataflow.heading}{" "}
          <em className="not-italic" style={{ color: "var(--j-ember)" }}>
            {dataflow.headingEm}
          </em>
        </h2>

        <MobileLayout inView={inView} />
        <DesktopLayout inView={inView} />
      </MarketingContainer>
    </section>
  );
}
