
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Empresa from "./pages/Empresa";
import Usuarios from "./pages/Usuarios";
import Clientes from "./pages/Clientes";
import Fornecedores from "./pages/Fornecedores";
import Produtos from "./pages/Produtos";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/empresa" element={<Empresa />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/fornecedores" element={<Fornecedores />} />
          <Route path="/produtos" element={<Produtos />} />
          {/* Rotas placeholder para próximas fases */}
          <Route path="/orcamentos" element={<div className="p-8">Módulo de Orçamentos - Em desenvolvimento</div>} />
          <Route path="/pedidos-venda" element={<div className="p-8">Módulo de Pedidos de Venda - Em desenvolvimento</div>} />
          <Route path="/pedidos-compra" element={<div className="p-8">Módulo de Pedidos de Compra - Em desenvolvimento</div>} />
          <Route path="/contas-receber" element={<div className="p-8">Módulo de Contas a Receber - Em desenvolvimento</div>} />
          <Route path="/contas-pagar" element={<div className="p-8">Módulo de Contas a Pagar - Em desenvolvimento</div>} />
          <Route path="/conta-corrente" element={<div className="p-8">Módulo de Conta Corrente - Em desenvolvimento</div>} />
          <Route path="/fluxo-caixa" element={<div className="p-8">Módulo de Fluxo de Caixa - Em desenvolvimento</div>} />
          <Route path="/ordens-producao" element={<div className="p-8">Módulo de Ordens de Produção - Em desenvolvimento</div>} />
          <Route path="/conferencia" element={<div className="p-8">Módulo de Conferência - Em desenvolvimento</div>} />
          <Route path="/configuracoes" element={<div className="p-8">Módulo de Configurações - Em desenvolvimento</div>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
