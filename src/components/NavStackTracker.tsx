"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const STACK_KEY = "niedoba-nav-stack";

/** Keeps a session history of pathnames for PageNav Domů / Zpět logic. */
export function NavStackTracker() {
  const pathname = usePathname();

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STACK_KEY);
      const stack: string[] = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(stack)) return;
      if (stack[stack.length - 1] !== pathname) {
        stack.push(pathname);
        sessionStorage.setItem(STACK_KEY, JSON.stringify(stack.slice(-24)));
      }
    } catch {
      /* ignore */
    }
  }, [pathname]);

  return null;
}
