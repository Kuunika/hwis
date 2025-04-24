"use client";
import { useServerTime } from "@/contexts/serverTimeProvider";
import { useEffect } from "react";

export const ServerTimeInitializer = () => {
  const { syncServerTime } = useServerTime();

  useEffect(() => {
    syncServerTime();
  }, [syncServerTime]);

  return null;
};
