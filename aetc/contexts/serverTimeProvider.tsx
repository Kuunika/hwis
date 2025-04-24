// context/ServerTimeContext.tsx
"use client";
import { getServerTime } from "@/services/patient";
import React, { createContext, useContext, useEffect, useState } from "react";

type ServerTimeContextType = {
  serverTime: Date;
  isSynced: boolean;
  syncError: Error | null;
  syncServerTime: () => Promise<void>;
};

const ServerTimeContext = createContext<ServerTimeContextType | undefined>(
  undefined
);

export const ServerTimeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [serverTime, setServerTime] = useState<Date>(new Date());
  const [isSynced, setIsSynced] = useState(false);
  const [syncError, setSyncError] = useState<Error | null>(null);
  const [timeOffset, setTimeOffset] = useState(0);

  const syncServerTime = async () => {
    try {
      setSyncError(null);
      const start = Date.now();
      const response = await getServerTime();
      const end = Date.now();

      const serverTimeMs = new Date(response.data.server_time).getTime();

      // Calculate offset accounting for network latency
      const roundTripTime = end - start;
      const estimatedServerTime = serverTimeMs + roundTripTime / 2;
      const offset = estimatedServerTime - Date.now();

      setTimeOffset(offset);
      setServerTime(new Date(Date.now() + offset));
      setIsSynced(true);
    } catch (error) {
      console.error("Error syncing server time:", error);
      setSyncError(error instanceof Error ? error : new Error("Sync failed"));
      setIsSynced(false);
    }
  };

  // Update server time continuously based on the offset
  useEffect(() => {
    if (!isSynced) return;

    const interval = setInterval(() => {
      setServerTime(new Date(Date.now() + timeOffset));
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [isSynced, timeOffset]);

  return (
    <ServerTimeContext.Provider
      value={{ serverTime, isSynced, syncError, syncServerTime }}
    >
      {children}
    </ServerTimeContext.Provider>
  );
};

export const useServerTime = () => {
  const context = useContext(ServerTimeContext);
  if (context === undefined) {
    throw new Error("useServerTime must be used within a ServerTimeProvider");
  }
  return context;
};
