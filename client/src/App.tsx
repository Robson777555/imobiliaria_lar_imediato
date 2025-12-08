import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import CookieBanner from "./components/CookieBanner";
import SimpleAuthGuard from "./components/SimpleAuthGuard";
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
import SimpleLogin from "./pages/SimpleLogin";

function Router() {
  const publicRoutes = (
    <>
      <Route path={"/login"} component={SimpleLogin} />
      <Route path={"/politica-privacidade"} component={PoliticaPrivacidade} />
      <Route path={"/termos-servico"} component={TermosServico} />
    </>
  );

  const protectedRoutes = (
    <>
      <Route path={"/"} component={Home} />
      <Route path={"/imoveis"} component={Imoveis} />
      <Route path={"/buscar-imoveis"} component={BuscarImoveis} />
      <Route path={"/anunciar-imovel"} component={AnunciarImovel} />
      <Route path={"/gerenciar-imoveis"} component={GerenciarImoveis} />
      <Route path={"/editar-imovel/:id"} component={EditarImovel} />
      <Route path={"/sobre"} component={Sobre} />
      <Route path={"/contato"} component={Contato} />
      <Route path={"/property/:id"} component={PropertyDetails} />
    </>
  );

  return (
    <Switch>
      {publicRoutes}
      {protectedRoutes}
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
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
          <SimpleAuthGuard>
            <Router />
            <CookieBanner />
          </SimpleAuthGuard>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
