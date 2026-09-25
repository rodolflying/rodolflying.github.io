import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/hooks/useLanguage";
import { useSpotlight } from "@/hooks/useSpotlight";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import AboutPage from "@/pages/AboutPage";
import ServicesPage from "@/pages/ServicesPage";
import ProjectsPage from "@/pages/ProjectsPage";
import DownloadsPage from "@/pages/DownloadsPage";
import BlogPage from "@/pages/BlogPage";
import ContactPage from "@/pages/ContactPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={AboutPage} />
      <Route path="/services" component={ServicesPage} />
      <Route path="/projects" component={ProjectsPage} />
      <Route path="/recursos" component={DownloadsPage} />
      <Route path="/downloads"><Redirect to="/recursos" replace /></Route>
      {/* Blog: accesible por URL directa pero fuera del menú y con noindex hasta tener artículos propios */}
      <Route path="/blog" component={BlogPage} />
      <Route path="/contact" component={ContactPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useSpotlight();
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <Router />
          <Toaster />
        </LanguageProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
