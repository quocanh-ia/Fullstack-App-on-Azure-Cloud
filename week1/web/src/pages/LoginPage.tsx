import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthed, setToken } from "../auth";

const API_BASE = import.meta.env.VITE_API_BASE || "";

type LoginResponse = {
  accessToken?: string;
  message?: string;
};

export default function LoginPage() {
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (isAuthed()) nav("/app", { replace: true });
  }, [nav]);

  async function register() {
    setMsg("Registering...");
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json().catch(() => ({}));
    setMsg(`Register: HTTP ${res.status}: ${JSON.stringify(data)}`);
  }

  async function login() {
    setMsg("Logging in...");
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data: LoginResponse = await res.json().catch(() => ({}));

    if (!res.ok) {
      setMsg(`Login failed: HTTP ${res.status}: ${JSON.stringify(data)}`);
      return;
    }

    const token = data?.accessToken;
    if (!token) {
      setMsg("Login failed: missing accessToken");
      return;
    }

    setToken(token);
    setMsg("Login success ✅ Token saved.");
    nav("/app", { replace: true });
  }

  return (
    <div style={{ maxWidth: 520, margin: "40px auto", padding: 16 }}>
      <h1>Week1 Web</h1>

      <h2>Authentication</h2>
      <input
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ width: "100%", marginBottom: 8 }}
      />
      <input
        placeholder="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", marginBottom: 12 }}
      />

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={register}>Register</button>
        <button onClick={login}>Login</button>
      </div>

      <pre style={{ whiteSpace: "pre-wrap", marginTop: 12 }}>{msg}</pre>
    </div>
  );
}
