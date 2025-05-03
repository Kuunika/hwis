"use client";
import { ServerTime, ServerTimeService } from "@/helpers/dateTime";
import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContext, AuthContextType } from "./auth";

interface ServerTimeContextValue {
  ServerTime: ServerTimeService;
  init: () => void;
}

const ServerTimeContext = createContext<ServerTimeContextValue | undefined>(
  undefined
);

export const ServerTimeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [initialized, setInitialized] = useState(false);
  const { loggedIn } = useContext(AuthContext) as AuthContextType;

  const init = async () => {
    await ServerTime.initialize();
    setInitialized(true);
  };

  useEffect(() => {
    console.log({initialized, loggedIn});
    if (!initialized && loggedIn) {
      init();
    }
  }, [loggedIn]);


  const value: ServerTimeContextValue = {
    ServerTime,
    init,
  };

  return (
    <ServerTimeContext.Provider value={value}>
      {children}
    </ServerTimeContext.Provider>
  );
};

export function useServerTime(): ServerTimeContextValue {
  const context = useContext(ServerTimeContext);
  if (!context) {
    throw new Error("useServerTime must be used within a ServerTimeProvider");
  }
  return context;
}
