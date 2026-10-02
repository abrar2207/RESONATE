import { GraduationCap } from "lucide-react";
import InstructorControls from "../components/InstructorControls";
import EventTimeline from "../components/EventTimeline";
import SimBadge from "../components/SimBadge";
import { useApp } from "../store/AppStore";

export default function Instructor() {
  const { state } = useApp();

  return (
    <div className="mx-auto max-w-[1500px] space-y-5">
      <div className="panel flex flex-wrap items-center gap-4 px-5 py-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-navy text-white">
          <GraduationCap size={18} aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-[21px] font-extrabold tracking-tight text-navy sm:text-[23px]">
              INSTRUCTOR CONTROL CENTER
            </h2>
            <SimBadge compact />
          </div>
          <p className="mt-0.5 text-[13px] text-muted">
            Drive the information environment during a live training session
          </p>
        </div>
        <span className="rounded-md bg-canvas px-2.5 py-1.5 text-[11px] font-semibold text-muted">
          Mode: <strong className="text-navy">INSTRUCTOR</strong>
        </span>
      </div>

      <InstructorControls />

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="panel p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="eyebrow">Live session timeline</p>
              <p className="text-[13.5px] font-semibold text-navy">
                Everything the instructor triggers is logged
              </p>
            </div>
            <span className="mono rounded-md bg-canvas px-2 py-1 text-[11px] font-semibold text-muted">
              {state.commEvents.length} events
            </span>
          </div>
          <EventTimeline events={state.commEvents.slice(-8)} dense />
        </section>

        <section className="panel p-4">
          <div className="mb-3">
            <p className="eyebrow">Activity log</p>
            <p className="text-[13.5px] font-semibold text-navy">Reconstruction decisions recorded</p>
          </div>
          {state.activityLog.length === 0 ? (
            <div className="rounded-[10px] border border-dashed border-line-strong px-4 py-8 text-center text-[12px] text-faint">
              No activity recorded yet. Run the demo, resolve a conflict or trigger an event.
            </div>
          ) : (
            <ul className="space-y-1.5">
              {state.activityLog.map((entry, i) => (
                <li
                  key={`${entry}-${i}`}
                  className="flex items-center gap-2 rounded-[8px] bg-canvas px-3 py-2 text-[12px] text-navy"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-flare" aria-hidden />
                  {entry}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
