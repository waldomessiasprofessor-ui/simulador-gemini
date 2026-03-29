import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import type { AppRouter } from "../../server/router";

// Hook tRPC tipado com o AppRouter do servidor
export const trpc = createTRPCReact<AppRouter>();

// Factory do cliente HTTP — usado no Provider
export function createTRPCClient() {
  return trpc.createClient({
    transformer: superjson,
    links: [
      httpBatchLink({
        url: "/api/trpc",
        fetch: (url, options) =>
          fetch(url, { ...options, credentials: "include" }),
      }),
    ],
  });
}
