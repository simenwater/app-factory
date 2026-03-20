"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useStore } from "@/store/useStore";

/**
 * @description Syncs store data with the server when a user is authenticated.
 * On login, loads data from the server; on data mutations, persists to server.
 */
export function DataSync() {
  const { data: session, status } = useSession();
  const setInputs = useStore((s) => s.setInputs);
  const setRecommendations = useStore((s) => s.setRecommendations);
  const updateSettings = useStore((s) => s.updateSettings);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user || hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    async function loadFromServer() {
      try {
        const [inputsRes, recsRes, userRes] = await Promise.all([
          fetch("/api/data/inputs"),
          fetch("/api/data/recommendations"),
          fetch("/api/data/user"),
        ]);

        if (inputsRes.ok) {
          const inputs = await inputsRes.json();
          if (inputs.length > 0) {
            setInputs(inputs.map((i: Record<string, unknown>) => ({
              ...i,
              createdAt: typeof i.createdAt === "string" ? i.createdAt : new Date(i.createdAt as string).toISOString(),
            })));
          }
        }

        if (recsRes.ok) {
          const recs = await recsRes.json();
          if (recs.length > 0) {
            setRecommendations(recs);
          }
        }

        if (userRes.ok) {
          const user = await userRes.json();
          if (user.subscriptionTier) {
            updateSettings({ subscriptionTier: user.subscriptionTier });
          }
        }
      } catch {
        // Server data load failed — fall back to local store
      }
    }

    loadFromServer();
  }, [status, session, setInputs, setRecommendations, updateSettings]);

  return null;
}
