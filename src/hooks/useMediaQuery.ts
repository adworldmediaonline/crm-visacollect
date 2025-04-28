"use client";

import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        // Avoid running on server
        if (typeof window === "undefined") return;

        const media = window.matchMedia(query);

        // Initial check
        setMatches(media.matches);

        // Add listener for changes
        const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
        media.addEventListener("change", listener);

        // Cleanup
        return () => media.removeEventListener("change", listener);
    }, [query]);

    return matches;
}
