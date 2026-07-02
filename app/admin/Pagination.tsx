"use client";

export default function Pagination({
  page,
  pageCount,
  onPageChange,
}: {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}) {
  if (pageCount <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-4 text-sm">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="px-3 py-1.5 rounded-lg border border-line font-semibold text-stone-600 disabled:opacity-40 hover:bg-stone-50 transition-colors"
      >
        ← Prev
      </button>
      <span className="text-stone-500 font-semibold">
        Page {page} of {pageCount}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= pageCount}
        className="px-3 py-1.5 rounded-lg border border-line font-semibold text-stone-600 disabled:opacity-40 hover:bg-stone-50 transition-colors"
      >
        Next →
      </button>
    </div>
  );
}
