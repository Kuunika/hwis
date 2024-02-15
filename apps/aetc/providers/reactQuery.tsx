"use client";
import { getQueryClient } from "@/helpers/getReactClient";
import {
  hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import React from "react";
import { ReactNode, FC } from "react";

const queryClient = new QueryClient();
export const ReactQueryProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <QueryClientProvider client={getQueryClient()}>
      {children}
    </QueryClientProvider>
  );
};
