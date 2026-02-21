"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
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
		<div className="flex h-screen w-full flex-col items-center justify-center gap-4 p-4">
			<div className="text-2xl font-semibold text-red-500">Error</div>
			<p className="text-sm text-foreground/70 text-center max-w-md">{error.message}</p>
			<Button onClick={() => reset()} variant="default" className="mt-2 cursor-pointer">
				Reintentar
			</Button>
		</div>
	);
}
