"use client";

import { createTRPCReact, httpBatchLink } from "@trpc/react-query";
import { AppRouter } from "./router/_app";
import { makeQueryClient } from "./query-client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import SuperJSON from "superjson";
import { inferRouterOutputs } from "@trpc/server";

export const trpc = createTRPCReact<AppRouter>();
export type RouterOutputs = inferRouterOutputs<AppRouter>;

let clientQueryClientSingleton: QueryClient;

function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient();
  }

  return (clientQueryClientSingleton ??= makeQueryClient());
}

function getUrl() {
  const base = (() => {
    // if on the brower
    if (typeof window !== "undefined") return "";

    // if on the server
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

    // local development case
    return "http://localhost:8000";
  })();

  return `${base}/api/trpc`;
}

export function TRPCProvider(props: Readonly<{ children: React.ReactNode }>) {
  const queryClient = getQueryClient();

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          transformer: SuperJSON,
          url: getUrl(),
          async headers() {
            const headers = new Headers();

            headers.set("x-trpc-source", "nextjs-react");

            return headers;
          },
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>
    </trpc.Provider>
  );
}
