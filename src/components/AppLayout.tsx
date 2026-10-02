import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Activity,
  BarChart3,
  BookOpenCheck,
  Boxes,
  ChevronRight,
  GaugeCircle,
  GraduationCap,
  LayoutDashboard,
  Library,
  RotateCcw,
  Radar,
  Settings2,
  ShieldCheck,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SimBadge from "./SimBadge";
import { useApp } from "../store/AppStore";
import { durationLabel } from "../store/AppStore";

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  group: string;
}

const NAV: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, group: "Overview" },
  { to: "/training", label: "Training Sessions", icon: Radar, group: "Overview" },
  { to: "/team", label: "Team", icon: Users, group: "Training" },
  { to: "/reconstruction", label: "Shared State", icon: Boxes, group: "Training" },
  { to: "/decision", label: "Decisions", icon: ShieldCheck, group: "Training" },
  { to: "/aar", label: "After-Action Review", icon: BookOpenCheck, group: "Analysis" },
  { to: "/analytics", label: "Analytics", icon: BarChart3, group: "Analysis" },
  { to: "/scenarios", label: "Scenarios", icon: Library, group: "Design" },
  { to: "/instructor", label: "Instructor", icon: Settings2, group: "Design" },
];

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-navy text-white">
        <Activity size={17} aria-hidden />
      </span>
      {!compact && (
        <span className="leading-tight">
          <span className="block text-[15px] font-extrabold tracking-[0.16em] text-navy">
            RESONATE
          </span>
          <span className="block text-[9.5px] font-semibold uppercase tracking-[0.1em] text-faint">
            Training Intelligence
          </span>
        </span>
      )}
    </div>
  );
}

function Sidebar() {
  const groups = Array.from(new Set(NAV.map((n) => n.group)));
  return (
    <aside className="flex w-[228px] shrink-0 flex-col border-r border-line bg-white">
      <div className="flex h-[62px] items-center border-b border-line px-4">
        <Logo />
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Primary">
        {groups.map((g) => (
          <div key={g} className="mb-5">
            <p className="eyebrow px-2 pb-2">{g}</p>
            <ul className="space-y-0.5">
              {NAV.filter((n) => n.group === g).map((n) => (
                <li key={n.to}>
                  <NavLink
                    to={n.to}
                    className={({ isActive }) =>
                      `group flex items-center gap-2.5 rounded-[9px] px-2.5 py-2 text-[13px] font-medium transition-colors ${
                        isActive
                          ? "bg-tech-soft text-tech"
                          : "text-muted hover:bg-canvas hover:text-navy"
                      }`
                    }
                  >
                    <n.icon size={15.5} aria-hidden />
                    <span className="flex-1">{n.label}</span>
                    <ChevronRight
                      size={13}
                      className="opacity-0 transition-opacity group-hover:opacity-60"
                      aria-hidden
                    />
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-line p-3">
        <div className="rounded-[10px] bg-canvas p-3">
          <div className="mb-1.5 flex items-center gap-1.5 text-faint">
            <GaugeCircle size={13} aria-hidden />
            <span className="eyebrow">Environment</span>
          </div>
          <p className="text-[11.5px] leading-snug text-muted">
            Fictional training entities only. No real locations, units or operational data.
          </p>
        </div>
      </div>
    </aside>
  );
}

function Topbar() {
  const { state, dispatch, startDemo, resetAll } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const activeLabels: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/training": "Training Sessions",
    "/team": "Team",
    "/reconstruction": "Shared-State Reconstruction",
    "/decision": "Team Decision",
    "/aar": "After-Action Review",
    "/analytics": "Training Analytics",
    "/instructor": "Instructor Control Center",
    "/scenarios": "Scenario Library",
  };
  const title =
    activeLabels[location.pathname] ??
    (location.pathname.startsWith("/training/") ? "SIGNAL HORIZON" : "RESONATE");

  const runDemo = () => {
    startDemo();
    navigate("/training");
  };

  return (
    <header className="sticky top-0 z-30 flex h-[62px] items-center gap-4 border-b border-line bg-white/95 px-5 backdrop-blur">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h1 className="truncate text-[15px] font-bold tracking-tight text-navy">{title}</h1>
          <span className="hidden rounded-md bg-canvas px-1.5 py-0.5 text-[10px] font-semibold text-faint md:inline">
            RESONATE · Training Intelligence Platform
          </span>
        </div>
        <p className="mono text-[11px] text-faint">
          SESSION {state.session.id.toUpperCase()} · {durationLabel(state.session.elapsedSec)} ·{" "}
          {state.session.commCondition}
        </p>
      </div>

      <SimBadge />

      <button
        type="button"
        onClick={runDemo}
        className="inline-flex items-center gap-1.5 rounded-[9px] bg-flare px-3 py-2 text-[12px] font-bold uppercase tracking-wide text-white shadow-sm transition-colors hover:bg-flare-dark"
      >
        ▶ Run full demo
      </button>

      <button
        type="button"
        onClick={() => dispatch({ type: "SET_MODE", mode: state.mode === "TRAINEE" ? "INSTRUCTOR" : "TRAINEE" })}
        className="hidden rounded-lg border border-line px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wide text-muted transition-colors hover:border-tech hover:text-tech lg:inline-flex"
        title="Switch point of view"
      >
        {state.mode === "TRAINEE" ? "Trainee mode" : "Instructor mode"}
      </button>

      <button
        type="button"
        aria-label="Reset prototype data"
        onClick={resetAll}
        className="hidden h-8 w-8 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:border-danger hover:text-danger sm:inline-flex"
        title="Reset demo data"
      >
        <RotateCcw size={15} aria-hidden />
      </button>

      <div className="flex items-center gap-2.5 rounded-[10px] border border-line py-1 pl-1 pr-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-navy text-[10.5px] font-bold text-white">
          {state.mode === "INSTRUCTOR" ? <GraduationCap size={15} aria-hidden /> : "TR"}
        </span>
        <span className="hidden leading-tight sm:block">
          <span className="block text-[12px] font-semibold text-navy">
            {state.user?.name ?? "Demo Trainee"}
          </span>
          <span className="block text-[10px] font-semibold uppercase tracking-wide text-faint">
            {state.user?.role ?? state.mode}
          </span>
        </span>
      </div>
    </header>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-canvas">
      <div className="sticky top-0 hidden h-screen md:flex">
        <Sidebar />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 px-5 py-5">{children}</main>
        <footer className="border-t border-line px-5 py-3 text-[11px] text-faint">
          RESONATE · SIH 2026 · Problem Statement SIH26248 · Prototype for training and research
          only.
        </footer>
      </div>
    </div>
  );
}
