import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, Mail, Radio, PlayCircle } from "lucide-react";
import { useApp } from "../store/AppStore";

export default function Login() {
  const navigate = useNavigate();
  const { dispatch, startDemo } = useApp();
  const [email, setEmail] = useState("trainee@resonate.demo");
  const [password, setPassword] = useState("demo1234");
  const [error, setError] = useState("");

  const signIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@") || password.length < 4) {
      setError("Enter a valid email and a password of at least 4 characters.");
      return;
    }
    const instructor = email.toLowerCase().includes("instructor");
    dispatch({
      type: "SET_USER",
      user: {
        name: instructor ? "Instructor Rao" : "Demo Trainee",
        email,
        role: instructor ? "Instructor" : "Trainee",
      },
    });
    navigate("/dashboard");
  };

  const demoMode = () => {
    dispatch({
      type: "SET_USER",
      user: { name: "Demo Trainee", email: "demo@resonate.demo", role: "Trainee" },
    });
    navigate("/dashboard");
  };

  const runFullDemo = () => {
    dispatch({
      type: "SET_USER",
      user: { name: "Demo Trainee", email: "demo@resonate.demo", role: "Trainee" },
    });
    startDemo();
    navigate("/training");
  };

  return (
    <div className="grid min-h-screen bg-canvas lg:grid-cols-2">
      <div className="flex flex-col justify-between bg-navy px-8 py-8 lg:px-14">
        <Link to="/" className="inline-flex items-center gap-2 text-[12px] font-semibold text-white/60 transition-colors hover:text-white">
          <ArrowLeft size={14} aria-hidden /> Back to overview
        </Link>

        <div>
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-[11px] bg-white/10 text-white">
              <Radio size={20} aria-hidden />
            </span>
            <span className="text-[22px] font-extrabold tracking-[0.2em] text-white">RESONATE</span>
          </div>
          <p className="max-w-[420px] text-[15px] leading-relaxed text-white/70">
            Resilient Shared-State Reconstruction for Degraded Communication Environments.
          </p>

          <div className="mt-8 max-w-[440px] space-y-2">
            {[
              "Fragmented information across participants",
              "Simulated communication degradation",
              "Measured shared-state convergence",
              "Evidence-linked after-action review",
            ].map((t) => (
              <div key={t} className="flex items-center gap-2.5 rounded-[9px] bg-white/5 px-3 py-2 text-[12.5px] text-white/75">
                <span className="h-1.5 w-1.5 rounded-full bg-flare" aria-hidden />
                {t}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.14em] text-white/40">
          <span className="font-bold text-white/70">SIH 2026</span>
          <span className="h-3 w-px bg-white/20" />
          <span className="font-bold text-white/70">SIH26248</span>
          <span className="h-3 w-px bg-white/20" />
          <span>Training prototype</span>
        </div>
      </div>

      <div className="flex items-center justify-center px-5 py-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-[400px]"
        >
          <p className="eyebrow mb-1.5">Secure access</p>
          <h1 className="mb-1 text-[24px] font-bold tracking-tight text-navy">Sign in to RESONATE</h1>
          <p className="mb-6 text-[13px] text-muted">
            Authentication exists only to establish the product flow for this prototype.
          </p>

          <form onSubmit={signIn} className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-[11.5px] font-semibold uppercase tracking-wide text-muted">
                Email
              </span>
              <span className="flex items-center gap-2 rounded-[10px] border border-line bg-white px-3 py-2.5 focus-within:border-tech">
                <Mail size={15} className="text-faint" aria-hidden />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-[13.5px] text-navy outline-none placeholder:text-faint"
                  placeholder="you@resonate.demo"
                  aria-label="Email"
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-[11.5px] font-semibold uppercase tracking-wide text-muted">
                Password
              </span>
              <span className="flex items-center gap-2 rounded-[10px] border border-line bg-white px-3 py-2.5 focus-within:border-tech">
                <Lock size={15} className="text-faint" aria-hidden />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-[13.5px] text-navy outline-none placeholder:text-faint"
                  placeholder="••••••••"
                  aria-label="Password"
                />
              </span>
            </label>

            {error && (
              <p role="alert" className="rounded-[8px] bg-danger-soft px-3 py-2 text-[12px] font-medium text-danger">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-[10px] bg-navy px-4 py-3 text-[13px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-navy-soft"
            >
              Sign in
            </button>
          </form>

          <div className="my-4 flex items-center gap-3 text-[11px] text-faint">
            <span className="h-px flex-1 bg-line" /> OR <span className="h-px flex-1 bg-line" />
          </div>

          <button
            type="button"
            onClick={demoMode}
            className="w-full rounded-[10px] border border-tech/40 bg-tech-soft px-4 py-3 text-[13px] font-bold uppercase tracking-wide text-tech transition-colors hover:bg-tech hover:text-white"
          >
            Demo mode
          </button>
          <button
            type="button"
            onClick={runFullDemo}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-[10px] bg-flare px-4 py-3 text-[13px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-flare-dark"
          >
            <PlayCircle size={15} aria-hidden /> Run full demo (2 min)
          </button>

          <p className="mt-5 text-center text-[11.5px] text-faint">
            Use an email containing <strong>instructor</strong> to sign in as an instructor.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
