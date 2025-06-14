import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Index from "./pages/Index"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Clientes from "./pages/Clientes"
import Fornecedores from "./pages/Fornecedores"
import Produtos from "./pages/Produtos"
import Vendedores from "./pages/Vendedores"
import Orcamentos from "./pages/Orcamentos"
import PedidosVenda from "./pages/PedidosVenda"
import PedidosCompra from "./pages/PedidosCompra"
import TabelaPrecos from "./pages/TabelaPrecos"
import MeiosPagamento from "./pages/MeiosPagamento"
import ContasReceber from "./pages/ContasReceber"
import ContasPagar from "./pages/ContasPagar"
import ContaCorrente from "./pages/ContaCorrente"
import FluxoCaixa from "./pages/FluxoCaixa"
import Faturamento from "./pages/Faturamento"
import Usuarios from "./pages/Usuarios"
import Empresa from "./pages/Empresa"
import OrdensProducao from "./pages/OrdensProducao"
import EtapasProducao from "./pages/EtapasProducao"
import Layout from "./components/Layout"
import NotFound from "./pages/NotFound"
import "./App.css"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/clientes" element={<Layout><Clientes /></Layout>} />
        <Route path="/fornecedores" element={<Layout><Fornecedores /></Layout>} />
        <Route path="/produtos" element={<Layout><Produtos /></Layout>} />
        <Route path="/vendedores" element={<Layout><Vendedores /></Layout>} />
        <Route path="/orcamentos" element={<Layout><Orcamentos /></Layout>} />
        <Route path="/pedidos-venda" element={<Layout><PedidosVenda /></Layout>} />
        <Route path="/pedidos-compra" element={<Layout><PedidosCompra /></Layout>} />
        <Route path="/tabela-precos" element={<Layout><TabelaPrecos /></Layout>} />
        <Route path="/meios-pagamento" element={<Layout><MeiosPagamento /></Layout>} />
        <Route path="/contas-receber" element={<Layout><ContasReceber /></Layout>} />
        <Route path="/contas-pagar" element={<Layout><ContasPagar /></Layout>} />
        <Route path="/conta-corrente" element={<Layout><ContaCorrente /></Layout>} />
        <Route path="/fluxo-caixa" element={<Layout><FluxoCaixa /></Layout>} />
        <Route path="/faturamento" element={<Layout><Faturamento /></Layout>} />
        <Route path="/usuarios" element={<Layout><Usuarios /></Layout>} />
        <Route path="/empresa" element={<Layout><Empresa /></Layout>} />
        <Route path="/ordens-producao" element={<Layout><OrdensProducao /></Layout>} />
        <Route path="/etapas-producao" element={<Layout><EtapasProducao /></Layout>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
