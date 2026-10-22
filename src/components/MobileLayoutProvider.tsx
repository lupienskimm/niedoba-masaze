"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type MobileLayoutVersion = "v1" | "v2";

const STORAGE_KEY = "niedoba-mobile-layout";

type MobileLayoutContextValue = {
  version: MobileLayoutVersion;
  setVersion: (v: MobileLayoutVersion) => void;
  ready: boolean;
};

const MobileLayoutContext = createContext<MobileLayoutContextValue>({
  version: "v1",
  setVersion: () => {},
  ready: false,
});

export function useMobileLayout() {
  return useContext(MobileLayoutContext);
}

export function MobileLayoutProvider({ children }: { children: ReactNode }) {
  const [version, setVersionState] = useState<MobileLayoutVersion>("v1");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "v1" || stored === "v2") {
        setVersionState(stored);
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.body.dataset.mobileLayout = version;
    document.body.classList.toggle("layout-v1", version === "v1");
    document.body.classList.toggle("layout-v2", version === "v2");
  }, [version, ready]);

  const setVersion = useCallback((v: MobileLayoutVersion) => {
    setVersionState(v);
    try {
      localStorage.setItem(STORAGE_KEY, v);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <MobileLayoutContext.Provider value={{ version, setVersion, ready }}>
      {children}
    </MobileLayoutContext.Provider>
  );
}
