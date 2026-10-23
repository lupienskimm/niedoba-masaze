"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export const LAYOUT_VERSIONS = ["v1", "v2", "v3", "v4"] as const;
export type MobileLayoutVersion = (typeof LAYOUT_VERSIONS)[number];

const STORAGE_KEY = "niedoba-site-layout";
const LEGACY_KEY = "niedoba-mobile-layout";

export const LAYOUT_LABELS: Record<
  MobileLayoutVersion,
  { short: string; title: string }
> = {
  v1: { short: "V1", title: "Plný web" },
  v2: { short: "V2", title: "Hero split (foto + text)" },
  v3: { short: "V3", title: "Hero + foto (PC)" },
  v4: { short: "V4", title: "Pořadí jako mobil (PC)" },
};

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

function isValidVersion(v: string | null): v is MobileLayoutVersion {
  return LAYOUT_VERSIONS.includes(v as MobileLayoutVersion);
}

export function MobileLayoutProvider({ children }: { children: ReactNode }) {
  const [version, setVersionState] = useState<MobileLayoutVersion>("v1");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored =
        localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_KEY);
      if (isValidVersion(stored)) {
        setVersionState(stored);
      } else if (stored === "v5") {
        setVersionState("v4");
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.body.dataset.siteLayout = version;
    for (const v of LAYOUT_VERSIONS) {
      document.body.classList.toggle(`layout-${v}`, version === v);
    }
    document.body.classList.toggle("layout-booking", version !== "v1");
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
