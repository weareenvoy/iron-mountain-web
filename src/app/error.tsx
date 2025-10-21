"use client"; // Error boundaries must be Client Components

import { Button } from "@/components/Button";
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
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-full flex-col place-content-center items-center gap-4 text-center">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-bold">An error has occurred.</h2>

        {error.message && (
          <p>
            <strong>Reason:</strong> {error.message}
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <Button asChild size="sm" variant="secondary">
          <Link href="/">Home</Link>
        </Button>

        <Button
          size="sm"
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
        >
          Try again
        </Button>
      </div>
    </div>
  );
}
