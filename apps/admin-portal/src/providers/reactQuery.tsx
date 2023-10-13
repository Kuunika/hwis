"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ReactNode, FC } from "react";

const queryClient = new QueryClient();

export const ReactQueryProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
