import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearToken, getToken } from "../auth";

const API_BASE = import.meta.env.VITE_API_BASE || "";

type MePayload = {
  user?: {
    sub?: string;
    username?: string;
    iat?: number;
    exp?: number;
    [k: string]: unknown;
  };
  message?: string;
  [k: string]: unknown;
};

type MeState = { status: number; data: MePayload } | null;

export default function AppPage() {
  const nav = useNavigate();
  const [me, setMe] = useState<MeState>(null);
  const token = getToken();

  async function callMe() {
    setMe(null);

    if (!token) {
      setMe({ status: 401, data: { message: "Missing token" } });
      return;
    }

    const res = await fetch(`${API_BASE}/api/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = (await res.json().catch(() => ({}))) as MePayload;
    setMe({ status: res.status, data });
  }

  function logout() {
    clearToken();
    nav("/", { replace: true });
  }

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Protected Area</h1>
        <button onClick={logout}>Logout</button>
      </div>

      <h2>Access Token</h2>
      <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{token ?? "(no token)"}</pre>

      <h2>Protected Endpoint (/me)</h2>
      <button onClick={callMe}>Call /me</button>

      {me && (
        <pre style={{ whiteSpace: "pre-wrap", marginTop: 12 }}>
HTTP {me.status}
{"\n"}
{JSON.stringify(me.data, null, 2)}
        </pre>
      )}
    </div>
  );
}
