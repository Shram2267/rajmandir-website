"use client";

import { createContext, useContext, useState, useCallback } from "react";

type SearchContextValue = {
  query: string;
  setQuery: (q: string) => void;
  clear: () => void;
};

const SearchContext = createContext<SearchContextValue | null>(null);

/**
 * Holds the live offers-search text so the header input, its suggestions
 * dropdown, and the offers grid all update together as the user types.
 */
export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [query, setQueryState] = useState("");
  const setQuery = useCallback((q: string) => setQueryState(q), []);
  const clear = useCallback(() => setQueryState(""), []);

  return (
    <SearchContext.Provider value={{ query, setQuery, clear }}>{children}</SearchContext.Provider>
  );
}

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be used within <SearchProvider>");
  return ctx;
}
