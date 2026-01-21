import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
  loading?: boolean;
};

export default function Button({
  variant = "primary",
  loading,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const cls = ["btn", variant === "primary" ? "btn-primary" : "btn-ghost"].join(" ");

  return (
    <button className={cls} disabled={disabled || loading} {...props}>
      {loading ? <span className="spinner" /> : null}
      {children}
    </button>
  );
}
