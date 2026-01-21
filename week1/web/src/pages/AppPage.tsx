import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearToken, getToken } from "../auth";

import Layout from "../ui/Layout";
import { Card, CardBody, CardHeader } from "../ui/Card";
import Button from "../ui/Button";

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

  const authedBadge = token ? "Authenticated" : "Missing token";
  const userName = me?.data?.user?.username;

  return (
    <Layout
      title="Week1 Web"
      subtitle="Protected area"
      right={
        <>
          <span className="badge">{authedBadge}</span>
          <Button variant="ghost" onClick={logout}>
            Logout
          </Button>
        </>
      }
    >
      <div className="stack">
        <div className="grid-2">
          <Card>
            <CardHeader
              title="Access Token"
              description="Access token for authenticated requests."
            />
            <CardBody>
              <div className="stack">
                <div className="code">{token ?? "(no token)"}</div>
                <div className="hint">
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Protected endpoint"
              description="Test a protected API endpoint using your access token."
            />
            <CardBody>
              <div className="stack">
                <div className="row" style={{ justifyContent: "space-between" }}>
                  <span className="badge">GET /api/me</span>
                  <Button onClick={callMe} disabled={!token}>
                    Call /me
                  </Button>
                </div>

                {!token ? (
                  <div className="alert alert-danger">No token yet. Please login first.</div>
                ) : null}

                {me ? (
                  <div className="stack">
                    <div className="row">
                      <span className="badge">HTTP {me.status}</span>
                      {userName ? <span className="badge">user: {userName}</span> : null}
                    </div>
                    <div className="code">{JSON.stringify(me.data, null, 2)}</div>
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
