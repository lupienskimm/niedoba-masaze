"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const STACK_KEY = "niedoba-nav-stack";

function readStack(): string[] {
  try {
    const raw = sessionStorage.getItem(STACK_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function writeStack(stack: string[]) {
  try {
    sessionStorage.setItem(STACK_KEY, JSON.stringify(stack.slice(-24)));
  } catch {
    /* ignore */
  }
}

/**
 * Domů first (only when Zpět would not land on home), then Zpět.
 * If Domů is hidden, Zpět sits in Domů's slot.
 */
export function PageNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [showHome, setShowHome] = useState(false);

  useEffect(() => {
    if (pathname === "/") return;

    const stack = readStack();
    const prev = [...stack].reverse().find((p) => p !== pathname);
    setShowHome(Boolean(prev && prev !== "/"));
  }, [pathname]);

  if (pathname === "/") return null;

  function goBack() {
    const stack = readStack();
    const prev = [...stack].reverse().find((p) => p !== pathname);
    if (prev) {
      const nextStack = stack.slice(0, stack.lastIndexOf(pathname));
      writeStack(nextStack);
      router.push(prev);
      return;
    }
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/");
  }

  return (
    <nav className="page-nav" aria-label="Stránková navigace">
      {showHome ? (
        <>
          <Link href="/" className="page-nav__btn">
            Domů
          </Link>
          <button type="button" className="page-nav__btn" onClick={goBack}>
            Zpět
          </button>
        </>
      ) : (
        <button type="button" className="page-nav__btn" onClick={goBack}>
          Zpět
        </button>
      )}
    </nav>
  );
}
