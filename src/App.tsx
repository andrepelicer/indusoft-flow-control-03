
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Empresa from "./pages/Empresa";
import Usuarios from "./pages/Usuarios";
import Clientes from "./pages/Clientes";
import Fornecedores from "./pages/Fornecedores";
import Produtos from "./pages/Produtos";
import Vendedores from "./pages/Vendedores";
import TabelaPrecos from "./pages/TabelaPrecos";
import Orcamentos from "./pages/Orcamentos";
import PedidosVenda from "./pages/PedidosVenda";
import Faturamento from "./pages/Faturamento";
import PedidosCompra from "./pages/PedidosCompra";
import ContasReceber from "./pages/ContasReceber";
import ContasPagar from "./pages/ContasPagar";
import ContaCorrente from "./pages/ContaCorrente";
import FluxoCaixa from "./pages/FluxoCaixa";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/empresa" element={<Empresa />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/fornecedores" element={<Fornecedores />} />
            <Route path="/produtos" element={<Produtos />} />
            <Route path="/vendedores" element={<Vendedores />} />
            <Route path="/tabela-precos" element={<TabelaPrecos />} />
            <Route path="/orcamentos" element={<Orcamentos />} />
            <Route path="/pedidos-venda" element={<PedidosVenda />} />
            <Route path="/faturamento" element={<Faturamento />} />
            <Route path="/pedidos-compra" element={<PedidosCompra />} />
            <Route path="/contas-receber" element={<ContasReceber />} />
            <Route path="/contas-pagar" element={<ContasPagar />} />
            <Route path="/conta-corrente" element={<ContaCorrente />} />
            <Route path="/fluxo-caixa" element={<FluxoCaixa />} />
            <Route path="/ordens-producao" element={
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-2">Módulo de Ordens de Produção</h2>
                  <p className="text-muted-foreground">Em desenvolvimento</p>
                </div>
              </div>
            } />
            <Route path="/conferencia" element={
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-2">Módulo de Conferência</h2>
                  <p className="text-muted-foreground">Em desenvolvimento</p>
                </div>
              </div>
            } />
            <Route path="/configuracoes" element={
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-2">Módulo de Configurações</h2>
                  <p className="text-muted-foreground">Em desenvolvimento</p>
                </div>
              </div>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
