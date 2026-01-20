import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthed } from "./auth";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!isAuthed()) return <Navigate to="/" replace />;
  return <>{children}</>;
}
