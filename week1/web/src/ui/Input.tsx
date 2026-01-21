import React, { useMemo } from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  right?: React.ReactNode;
  padRight?: boolean;
};

export default function Input({ label, hint, right, padRight, className, ...props }: InputProps) {
  const cls = useMemo(() => {
    const base = ["input"];
    if (padRight) base.push("input-pad-right");
    if (className) base.push(className);
    return base.join(" ");
  }, [className, padRight]);

  return (
    <div className="stack" style={{ gap: 6 }}>
      {label ? <div className="label">{label}</div> : null}

      {right ? (
        <div className="input-wrap">
          <input className={cls} {...props} />
          {right}
        </div>
      ) : (
        <input className={cls} {...props} />
      )}

      {hint ? <div className="hint">{hint}</div> : null}
    </div>
  );
}
