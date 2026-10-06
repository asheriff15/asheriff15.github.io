"use client";

import { useEffect, useRef, useState } from "react";
import type React from "react";

// Inbound traffic flowing down through the layers of an AWS network.
// Most packets reach the instance; packets for a port the security group
// doesn't allow are dropped at that layer and turn red.

const W = 440;
const nodes = [
  { y: 24, title: "Internet", note: "Inbound traffic" },
  { y: 148, title: "Internet gateway", note: "Route 0.0.0.0/0" },
  { y: 272, title: "Security group", note: "Allow 443 · deny everything else" },
  { y: 396, title: "EC2 instance", note: "Web server" },
];
const CARD_H = 72;
const LANE_X = W / 2;
const SG_TOP = nodes[2].y;
const END_Y = nodes[3].y;

type Packet = { id: number; y: number; port: number; blocked: boolean; dead: number };
type LogLine = { id: number; text: string; drop: boolean };

const icons: Record<string, React.ReactElement> = {
  Internet: (
    <g fill="none" stroke="#fff" strokeWidth="1.6">
      <circle cx="0" cy="0" r="8" />
      <path d="M-8 0h16M0-8c3 3 3 13 0 16M0-8c-3 3-3 13 0 16" />
    </g>
  ),
  "Internet gateway": (
    <g fill="none" stroke="#fff" strokeWidth="1.6">
      <path d="M-8 3h16M-8-3h16M-4-8v16M4-8v16" />
    </g>
  ),
  "Security group": (
    <g fill="none" stroke="#fff" strokeWidth="1.6">
      <path d="M0-9l7 3v4c0 5-3 8-7 10c-4-2-7-5-7-10v-4z" />
    </g>
  ),
  "EC2 instance": (
    <g fill="none" stroke="#fff" strokeWidth="1.6">
      <rect x="-7" y="-7" width="14" height="14" rx="1.5" />
      <path d="M-3-10v3M3-10v3M-3 7v3M3 7v3M-10-3h3M-10 3h3M7-3h3M7 3h3" />
    </g>
  ),
};

export default function NetworkDiagram() {
  const [packets, setPackets] = useState<Packet[]>([]);
  const [log, setLog] = useState<LogLine[]>([
    { id: -2, text: "allow tcp/443 → web server", drop: false },
    { id: -1, text: "drop tcp/22 at security group", drop: true },
  ]);
  const seq = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ports = [443, 443, 22, 443, 3389, 443, 443, 23];
    let raf = 0;
    let last = performance.now();
    let spawn = 0;

    const loop = (t: number) => {
      const dt = Math.min(48, t - last);
      last = t;
      spawn -= dt;
      setPackets((prev) => {
        const next: Packet[] = [];
        const events: LogLine[] = [];
        for (const p of prev) {
          if (p.dead > 0) {
            const dead = p.dead - dt;
            if (dead > 0) next.push({ ...p, dead });
            continue;
          }
          const y = p.y + dt * 0.11;
          if (p.blocked && y >= SG_TOP - 6) {
            next.push({ ...p, y: SG_TOP - 6, dead: 900 });
            events.push({ id: p.id, text: `drop tcp/${p.port} at security group`, drop: true });
          } else if (!p.blocked && y >= END_Y) {
            events.push({ id: p.id, text: `allow tcp/${p.port} → web server`, drop: false });
          } else next.push({ ...p, y });
        }
        if (events.length) setLog((l) => [...events.reverse(), ...l].slice(0, 3));
        if (spawn <= 0) {
          spawn = 950;
          const port = ports[seq.current % ports.length];
          next.push({ id: seq.current++, y: 0, port, blocked: port !== 443, dead: 0 });
        }
        return next;
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <figure className="w-full max-w-[440px]" aria-label="Diagram: inbound traffic passing through an internet gateway and a security group to an EC2 instance. Packets on unallowed ports are dropped at the security group.">
      <svg viewBox={`0 0 ${W} ${END_Y + CARD_H + 4}`} className="w-full h-auto" role="img" aria-hidden>
        <line x1={LANE_X} y1={nodes[0].y + CARD_H} x2={LANE_X} y2={END_Y} stroke="#25252c" strokeWidth="2" />
        {packets.map((p) => {
          const dropped = p.dead > 0;
          return (
            <g key={p.id} opacity={dropped ? Math.min(1, p.dead / 400) : 1}>
              <circle cx={LANE_X} cy={p.y} r={dropped ? 7 : 5} fill={dropped ? "#d00000" : "#ffffff"} />
              {dropped && (
                <path
                  d={`M${LANE_X + 14} ${p.y - 6} l12 12 M${LANE_X + 26} ${p.y - 6} l-12 12`}
                  stroke="#ff4a44"
                  strokeWidth="2.5"
                />
              )}
            </g>
          );
        })}
        {nodes.map((n, i) => {
          const isSg = i === 2;
          return (
            <g key={n.title} transform={`translate(0 ${n.y})`}>
              <rect
                x="0.5"
                y="0.5"
                width={W - 1}
                height={CARD_H}
                rx="6"
                fill={isSg ? "#2e0a0c" : "#141419"}
                stroke={isSg ? "#60090b" : "#1a1a20"}
              />
              <circle cx="40" cy={CARD_H / 2} r="19" fill="#d00000" />
              <g transform={`translate(40 ${CARD_H / 2})`}>{icons[n.title]}</g>
              <text x="74" y="31" fill="#ffffff" fontFamily="var(--font-sans)" fontWeight="700" fontSize="17">
                {n.title}
              </text>
              <text x="74" y="52" fill="#b0b0b2" fontFamily="var(--font-sans)" fontSize="14">
                {n.note}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-4 space-y-1 font-mono text-[13px] leading-5" aria-live="off">
        {log.map((l) => (
          <div key={l.id} className={l.drop ? "text-signal-hi" : "text-muted"}>
            {l.drop ? "✕" : "✓"} {l.text}
          </div>
        ))}
      </figcaption>
    </figure>
  );
}
