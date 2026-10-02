import {
  AlertTriangle,
  CheckCircle2,
  CircleHelp,
  Clock3,
  MinusCircle,
  XCircle,
} from "lucide-react";
import type { InformationStatus } from "../types";

const MAP: Record<
  InformationStatus,
  { cls: string; icon: typeof CheckCircle2; label: string; hint: string }
> = {
  CONFIRMED: {
    cls: "bg-ok-soft text-ok border-ok/25",
    icon: CheckCircle2,
    label: "CONFIRMED",
    hint: "Corroborated by at least two independent sources.",
  },
  CONFLICTING: {
    cls: "bg-danger-soft text-danger border-danger/25",
    icon: XCircle,
    label: "CONFLICTING",
    hint: "Two sources describe the same item differently.",
  },
  DELAYED: {
    cls: "bg-flare-soft text-flare-dark border-flare/30",
    icon: Clock3,
    label: "DELAYED",
    hint: "Received later than the freshness window allows.",
  },
  STALE: {
    cls: "bg-dim/12 text-dim border-dim/25",
    icon: MinusCircle,
    label: "STALE",
    hint: "Superseded or older than the staleness window.",
  },
  UNVERIFIED: {
    cls: "bg-tech-soft text-tech border-tech/25",
    icon: CircleHelp,
    label: "UNVERIFIED",
    hint: "Present but not yet corroborated by another source.",
  },
  MISSING: {
    cls: "bg-dim/12 text-dim border-dim/25",
    icon: AlertTriangle,
    label: "MISSING",
    hint: "Expected information never arrived.",
  },
};

export function StatusBadge({
  status,
  size = "md",
  withIcon = true,
}: {
  status: InformationStatus;
  size?: "sm" | "md";
  withIcon?: boolean;
}) {
  const conf = MAP[status];
  const Icon = conf.icon;
  return (
    <span
      title={conf.hint}
      className={`inline-flex items-center gap-1.5 rounded-md border font-semibold tracking-wide ${
        size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-1 text-[10.5px]"
      } ${conf.cls}`}
    >
      {withIcon && <Icon size={size === "sm" ? 11 : 12} aria-hidden />}
      {conf.label}
    </span>
  );
}

export function statusColor(status: InformationStatus): string {
  switch (status) {
    case "CONFIRMED":
      return "#1F8A55";
    case "CONFLICTING":
      return "#C8442E";
    case "DELAYED":
      return "#F28C28";
    case "STALE":
      return "#7D8B9B";
    case "UNVERIFIED":
      return "#1769AA";
    default:
      return "#7D8B9B";
  }
}

export default StatusBadge;
