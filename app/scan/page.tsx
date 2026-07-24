import { Suspense } from "react";
import ScanPage from "./ScanClient";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex min-h-[70vh] items-center justify-center px-5">
          <p className="animate-pulse-soft font-display text-2xl text-ink">
            Opening it up…
          </p>
        </div>
      }
    >
      <ScanPage />
    </Suspense>
  );
}
