"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw, MoveLeft } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-4">
      <h1 className="text-4xl font-bold mb-4 flex items-center gap-2">
        <AlertTriangle className="w-12 h-12 text-destructive" />
        Something Went Wrong
      </h1>

      <p className="mb-6 text-muted-foreground max-w-md">
        Sorry, something unexpected happened. Please try again or go back to the
        homepage.
      </p>

      <div className="flex gap-3">
        <Button size="lg" variant="default" onClick={() => reset()}>
          <RotateCcw />
          Try Again
        </Button>

        <Link href="/">
          <Button size="lg" variant="outline">
            <MoveLeft />
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
}