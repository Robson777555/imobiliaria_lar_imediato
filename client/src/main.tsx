import { trpc } from "@/lib/trpc";
import { UNAUTHED_ERR_MSG } from '@shared/const';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { createRoot } from "react-dom/client";
import superjson from "superjson";
import App from "./App";
import { getLoginUrl } from "./const";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Não usar dados stale para queries de autenticação
      staleTime: 0,
      // Sempre refetch ao montar para garantir dados atualizados
      refetchOnMount: true,
    },
  },
});

const redirectToLoginIfUnauthorized = (error: unknown) => {
  if (!(error instanceof TRPCClientError)) return;
  if (typeof window === "undefined") return;

  const isUnauthorized = error.message === UNAUTHED_ERR_MSG;

  if (!isUnauthorized) return;

  window.location.href = getLoginUrl();
};

queryClient.getQueryCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.query.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Query Error]", error);
  }
});

queryClient.getMutationCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.mutation.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Mutation Error]", error);
  }
});

// Detectar se estamos em produção e se as funções Netlify funcionam
const getApiUrl = () => {
  // Em desenvolvimento, usar o servidor local
  if (import.meta.env.DEV) {
    return "/api/trpc";
  }
  
  // Em produção, tentar usar Netlify Functions primeiro
  // Se falhar, poderá usar um backend alternativo
  return "/api/trpc";
};

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: getApiUrl(),
      transformer: superjson,
      fetch(input, init) {
        // Wrapper para detectar erros e logar
        return globalThis.fetch(input, {
          ...(init ?? {}),
          credentials: "include",
        }).catch((error) => {
          console.error("[tRPC Fetch Error]", error);
          throw error;
        }).then((response) => {
          // Verificar se retornou HTML ao invés de JSON
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("text/html")) {
            console.error("[tRPC Error] Recebeu HTML ao invés de JSON. URL:", input);
            throw new Error("API retornou HTML - funções Netlify podem não estar funcionando");
          }
          return response;
        });
      },
    }),
  ],
});

createRoot(document.getElementById("root")!).render(
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </trpc.Provider>
);
