import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthed, setToken } from "../auth";

import Layout from "../ui/Layout";
import { Card, CardBody, CardHeader } from "../ui/Card";
import Button from "../ui/Button";
import Input from "../ui/Input";

const API_BASE = import.meta.env.VITE_API_BASE || "";

type LoginResponse = {
  accessToken?: string;
  message?: string;
};

export default function LoginPage() {
  const nav = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState<"register" | "login" | null>(null);

  useEffect(() => {
    if (isAuthed()) nav("/app", { replace: true });
  }, [nav]);

  const canSubmit = useMemo(() => username.trim().length > 0 && password.trim().length > 0, [
    username,
    password,
  ]);

  async function register() {
    setBusy("register");
    setMsg("Registering...");
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json().catch(() => ({}));
      setMsg(`Register: HTTP ${res.status}: ${JSON.stringify(data)}`);
    } finally {
      setBusy(null);
    }
  }

  async function login() {
    setBusy("login");
    setMsg("Logging in...");
    try {
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
    } finally {
      setBusy(null);
    }
  }

  const isLoading = busy !== null;

  return (
    <Layout
      title="Week1 Web"
      right={<span className="badge">Guest</span>}
    >
      <div className="page-center">
        <div style={{ width: "100%", maxWidth: 820 }}>
          <Card>
            <CardHeader
              title="Authentication"
              description="Login/Register to access the protected page."
            />
            <CardBody>
              <div className="stack">
                <Input
                  label="Username"
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                />

                <Input
                  label="Password"
                  placeholder="password"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  padRight
                  right={
                    <button
                      type="button"
                      className="input-right"
                      onClick={() => setShowPw((v) => !v)}
                      aria-label={showPw ? "Hide password" : "Show password"}
                    >
                      {showPw ? "Hide" : "Show"}
                    </button>
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && canSubmit && !isLoading) login();
                  }}
                />

                <div className="row" style={{ justifyContent: "flex-end" }}>
                  <Button
                    variant="ghost"
                    onClick={register}
                    loading={busy === "register"}
                    disabled={isLoading || !canSubmit}
                    title={!canSubmit ? "Enter username & password first" : undefined}
                  >
                    Register
                  </Button>

                  <Button
                    onClick={login}
                    loading={busy === "login"}
                    disabled={isLoading || !canSubmit}
                    title={!canSubmit ? "Enter username & password first" : undefined}
                  >
                    Login
                  </Button>
                </div>

                {msg ? (
                  <div className={msg.includes("success") ? "alert alert-success" : "alert alert-danger"}>
                    <span className="dot" />
                    <div className="text">{msg}</div>
                  </div>
                ) : null}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
