import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import CookieBanner from "./components/CookieBanner";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthGuard from "./components/AuthGuard";
import Home from "./pages/Home";
import PropertyDetails from "./pages/PropertyDetails";
import Imoveis from "./pages/Imoveis";
import BuscarImoveis from "./pages/BuscarImoveis";
import AnunciarImovel from "./pages/AnunciarImovel";
import GerenciarImoveis from "./pages/GerenciarImoveis";
import EditarImovel from "./pages/EditarImovel";
import Sobre from "./pages/Sobre";
import Contato from "./pages/Contato";
import PoliticaPrivacidade from "./pages/PoliticaPrivacidade";
import TermosServico from "./pages/TermosServico";
import Login from "./pages/Login";

function Router() {
  const publicRoutes = (
    <>
      <Route path={"/login"} component={Login} />
      <Route path={"/politica-privacidade"} component={PoliticaPrivacidade} />
      <Route path={"/termos-servico"} component={TermosServico} />
    </>
  );

  const protectedRoutes = (
    <>
      <Route path={"/"}>
        {() => (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        )}
      </Route>
      <Route path={"/imoveis"}>
        {() => (
          <ProtectedRoute>
            <Imoveis />
          </ProtectedRoute>
        )}
      </Route>
      <Route path={"/buscar-imoveis"}>
        {() => (
          <ProtectedRoute>
            <BuscarImoveis />
          </ProtectedRoute>
        )}
      </Route>
      <Route path={"/anunciar-imovel"}>
        {() => (
          <ProtectedRoute>
            <AnunciarImovel />
          </ProtectedRoute>
        )}
      </Route>
      <Route path={"/gerenciar-imoveis"}>
        {() => (
          <ProtectedRoute>
            <GerenciarImoveis />
          </ProtectedRoute>
        )}
      </Route>
      <Route path={"/editar-imovel/:id"}>
        {() => (
          <ProtectedRoute>
            <EditarImovel />
          </ProtectedRoute>
        )}
      </Route>
      <Route path={"/sobre"}>
        {() => (
          <ProtectedRoute>
            <Sobre />
          </ProtectedRoute>
        )}
      </Route>
      <Route path={"/contato"}>
        {() => (
          <ProtectedRoute>
            <Contato />
          </ProtectedRoute>
        )}
      </Route>
      <Route path={"/property/:id"}>
        {() => (
          <ProtectedRoute>
            <PropertyDetails />
          </ProtectedRoute>
        )}
      </Route>
    </>
  );

  return (
    <Switch>
      {publicRoutes}
      {protectedRoutes}
      <Route path={"/404"} component={NotFound} />
      <Route>
        {() => (
          <ProtectedRoute>
            <NotFound />
          </ProtectedRoute>
        )}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
      >
        <TooltipProvider>
          <Toaster />
          <AuthGuard>
            <Router />
            <CookieBanner />
          </AuthGuard>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
