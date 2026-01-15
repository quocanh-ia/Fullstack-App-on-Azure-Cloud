import { useState } from "react";
import "./App.css";

type MeResponse = {
  user?: {
    sub?: string;
    username?: string;
    iat?: number;
    exp?: number;
  };
  message?: string;
};

export default function App() {
  // Local dev: API chạy ở 3000
  const API_BASE = "/api";

  const [healthResult, setHealthResult] = useState<string>("");
  const [username, setUsername] = useState<string>("test");
  const [password, setPassword] = useState<string>("123456");

  const [registerResult, setRegisterResult] = useState<string>("");
  const [loginResult, setLoginResult] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [meResult, setMeResult] = useState<string>("");

  const errMsg = (e: unknown) => (e instanceof Error ? e.message : String(e));

  // ===== Health =====
  const checkHealth = async () => {
    setHealthResult("Loading...");
    try {
      const res = await fetch(`${API_BASE}/health`);
      const data = await res.json();
      setHealthResult(JSON.stringify(data, null, 2));
    } catch (e: unknown) {
      setHealthResult("Error: " + errMsg(e));
    }
  };

  // ===== Register =====
  const register = async () => {
    setRegisterResult("Loading...");
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      // Backend bạn đang trả TEXT ("Registered") nên dùng text()
      const text = await res.text();

      if (!res.ok) {
        setRegisterResult(`HTTP ${res.status}: ${text}`);
        return;
      }

      setRegisterResult(text || "Registered");
    } catch (e: unknown) {
      setRegisterResult("Error: " + errMsg(e));
    }
  };

  // ===== Login =====
  const login = async () => {
    setLoginResult("Loading...");
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const text = await res.text();

      if (!res.ok) {
        setLoginResult(`HTTP ${res.status}: ${text}`);
        return;
      }

      // login trả JSON có accessToken
      const data = JSON.parse(text) as { accessToken?: string };
      if (!data.accessToken) {
        setLoginResult("Login OK nhưng không thấy accessToken trong response.");
        return;
      }

      setToken(data.accessToken);
      setLoginResult("Login success ✅ Token saved.");
    } catch (e: unknown) {
      setLoginResult("Error: " + errMsg(e));
    }
  };

  // ===== /me =====
  const callMe = async () => {
    setMeResult("Loading...");
    try {
      if (!token) {
        setMeResult("No token yet. Please login first.");
        return;
      }

      const res = await fetch(`${API_BASE}/me`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const text = await res.text();

      if (!res.ok) {
        setMeResult(`HTTP ${res.status}: ${text}`);
        return;
      }

      const data = JSON.parse(text) as MeResponse;
      setMeResult(JSON.stringify(data, null, 2));
    } catch (e: unknown) {
      setMeResult("Error: " + errMsg(e));
    }
  };

  return (
    <div style={{ padding: 24, fontFamily: "Arial", maxWidth: 520, margin: "0 auto" }}>
      <h2>Week 1 – Web Demo</h2>

      <hr />

      <h3>API Health</h3>
      <button onClick={checkHealth}>Check API Health</button>
      <pre style={{ marginTop: 12, whiteSpace: "pre-wrap" }}>{healthResult}</pre>

      <hr />

      <h3>Authentication</h3>

      <div style={{ display: "grid", gap: 8 }}>
        <input
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          placeholder="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={register}>Register</button>
          <button onClick={login}>Login</button>
        </div>
      </div>

      <pre style={{ marginTop: 12, whiteSpace: "pre-wrap" }}>
        {registerResult ? `Register: ${registerResult}` : ""}
        {"\n"}
        {loginResult ? `Login: ${loginResult}` : ""}
      </pre>

      <hr />

      <h3>Access Token</h3>
      <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
        {token || "(no token yet)"}
      </pre>

      <hr />

      <h3>Protected Endpoint (/me)</h3>
      <button onClick={callMe} disabled={!token}>
        Call /me
      </button>
      <pre style={{ marginTop: 12, whiteSpace: "pre-wrap" }}>{meResult}</pre>
    </div>
  );
}
