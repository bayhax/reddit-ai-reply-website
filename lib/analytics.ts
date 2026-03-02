export type AnalyticsProps = Record<string, string | number | boolean | null | undefined>;

type WindowWithPosthog = Window & {
  posthog?: {
    capture: (event: string, properties?: AnalyticsProps) => void;
  };
};

export function track(event: string, properties?: AnalyticsProps) {
  if (typeof window === "undefined") return;
  const win = window as WindowWithPosthog;
  if (!win.posthog) return;
  win.posthog.capture(event, properties);
}

