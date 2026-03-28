"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  showing?: number;
  onPageChange: (page: number) => void;
  /** Label shown before the count. Defaults to "results" */
  itemLabel?: string;
}

export function Pagination({
  page,
  totalPages,
  total,
  showing,
  onPageChange,
  itemLabel = "results",
}: PaginationProps) {
  const safeTotalPages = Math.max(1, totalPages);

  if (total === 0) return null;

  return (
    <div className="flex items-center justify-between border-t px-4 py-3">
      <p className="text-xs text-muted-foreground">
        {showing !== undefined ? (
          <>
            Showing <span className="font-medium text-foreground">{showing}</span>{" "}
            of <span className="font-medium text-foreground">{total}</span>{" "}
            {itemLabel}
          </>
        ) : (
          <>
            <span className="font-medium text-foreground">{total}</span>{" "}
            {itemLabel}
          </>
        )}
      </p>

      <div className="flex items-center gap-1.5">
        <Button
          size="icon"
          variant="outline"
          className="h-7 w-7"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <span className="min-w-[60px] text-center text-xs text-muted-foreground tabular-nums">
          {page} / {safeTotalPages}
        </span>

        <Button
          size="icon"
          variant="outline"
          className="h-7 w-7"
          disabled={page >= safeTotalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}