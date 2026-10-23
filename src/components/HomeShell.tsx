import type { ReactNode } from "react";

/**
 * Renders both trees; CSS media queries show the right one.
 * Avoids JS viewport swap that delayed mobile LCP by ~2s.
 */
export function HomeShell({
  mobile,
  desktop,
}: {
  mobile: ReactNode;
  desktop: ReactNode;
}) {
  return (
    <>
      <div className="home-mobile">{mobile}</div>
      <div className="home-desktop">{desktop}</div>
    </>
  );
}
