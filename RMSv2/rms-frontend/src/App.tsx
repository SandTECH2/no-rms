import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Projects from "./pages/Projects";
import Equipment from "./pages/Equipment";
import Customers from "./pages/Customers";
import Crew from "./pages/Crew";
import Warehouses from "./pages/Warehouses";
import Organizations from "./pages/Organizations";
import PackZone from "./pages/Pack-Zone";
import PackZone1 from "./pages/PackZone-1";
import PackZone2 from "./pages/PackZone-2";
import PackZone3 from "./pages/PackZone-3";
import Scan from "./pages/Scan";
import Login from "./pages/auth/login";
import NotFound from "./pages/NotFound";
import Auth from "./components/auth";

const queryClient = new QueryClient();


function WithLayout({ Layout, Component }: { Layout: React.FC<any>; Component: React.FC<any> }) {
  return (
    <Layout>
      <Component />
    </Layout>
  );
}


const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Projects />} />
            <Route path="/equipment" element={<Equipment />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/crew" element={<Crew />} />
            <Route path="/warehouses" element={<Warehouses />} />
            <Route path="/organizations" element={<Organizations />} />
            <Route path="/pack-zone-2" element={<PackZone2 />} />
            <Route path="/pack-zone-1" element={<PackZone1 />} />
            <Route path="/pack-zone-3" element={<PackZone3 />} />
            <Route path="/pack-zone" element={<PackZone />} />
            <Route path="/auth/login" element={<WithLayout Layout={Auth} Component={Login} />} />
            <Route path="/scan" element={<Scan />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
