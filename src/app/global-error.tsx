"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 p-4 bg-black text-white">
          <div className="text-2xl font-semibold text-red-400">Ocurrió un error grave</div>
          <p className="text-sm text-white/70 text-center max-w-md">{error.message}</p>
          <Button onClick={() => reset()} variant="default" className="mt-2 cursor-pointer">
            Reintentar
          </Button>
        </div>
      </body>
    </html>
  );
}
