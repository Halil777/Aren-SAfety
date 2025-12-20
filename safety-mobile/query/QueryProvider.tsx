import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { focusManager } from "@tanstack/react-query";
import { useEffect } from "react";
import { AppState } from "react-native";
import { queryClient } from "./queryClient";
import { queryPersister } from "./persist";

const MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7;
const CACHE_BUSTER = "v1";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (status) => {
      focusManager.setFocused(status === "active");
    });
    return () => subscription.remove();
  }, []);

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: queryPersister,
        maxAge: MAX_AGE_MS,
        buster: CACHE_BUSTER,
      }}
      onSuccess={() => {
        queryClient.resumePausedMutations();
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}

