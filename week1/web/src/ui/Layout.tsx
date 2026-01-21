import React from "react";

type LayoutProps = {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
};

export default function Layout({ title, subtitle, right, children }: LayoutProps) {
  return (
    <div>
      <div className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <div className="brand-title">{title}</div>
            {subtitle ? <div className="brand-sub">{subtitle}</div> : null}
          </div>

          <div className="row">{right}</div>
        </div>
      </div>

      <main className="container">{children}</main>
    </div>
  );
}
