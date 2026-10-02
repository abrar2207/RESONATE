import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AppProvider, useApp } from "./store/AppStore";
import AppLayout from "./components/AppLayout";
import DemoController from "./components/DemoController";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TrainingSessions from "./pages/TrainingSessions";
import TrainingSessionPage from "./pages/TrainingSession";
import Team from "./pages/Team";
import Reconstruction from "./pages/Reconstruction";
import Decision from "./pages/Decision";
import AAR from "./pages/AAR";
import Analytics from "./pages/Analytics";
import Instructor from "./pages/Instructor";
import Scenarios from "./pages/Scenarios";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);
  return null;
}

function RequireSession({ children }: { children: React.ReactNode }) {
  const { state } = useApp();
  if (!state.user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <RequireSession>
      <AppLayout>{children}</AppLayout>
    </RequireSession>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />

      <Route path="/dashboard" element={<Shell><Dashboard /></Shell>} />
      <Route path="/training" element={<Shell><TrainingSessions /></Shell>} />
      <Route path="/training/:sessionId" element={<Shell><TrainingSessionPage /></Shell>} />
      <Route path="/team" element={<Shell><Team /></Shell>} />
      <Route path="/reconstruction" element={<Shell><Reconstruction /></Shell>} />
      <Route path="/decision" element={<Shell><Decision /></Shell>} />
      <Route path="/aar" element={<Shell><AAR /></Shell>} />
      <Route path="/analytics" element={<Shell><Analytics /></Shell>} />
      <Route path="/instructor" element={<Shell><Instructor /></Shell>} />
      <Route path="/scenarios" element={<Shell><Scenarios /></Shell>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <ScrollToTop />
        <AppRoutes />
        <DemoController />
      </AppProvider>
    </BrowserRouter>
  );
}
