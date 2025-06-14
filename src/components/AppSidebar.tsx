
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Building2, Users, Package, ShoppingCart, CreditCard, Factory, BarChart3, Settings } from "lucide-react"
import { Link } from "react-router-dom"

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: BarChart3,
  },
  {
    title: "Cadastros",
    icon: Building2,
    items: [
      { title: "Empresa", url: "/empresa" },
      { title: "Usuários", url: "/usuarios" },
      { title: "Clientes", url: "/clientes" },
      { title: "Fornecedores", url: "/fornecedores" },
      { title: "Produtos", url: "/produtos" },
      { title: "Vendedores", url: "/vendedores" },
    ]
  },
  {
    title: "Vendas",
    icon: ShoppingCart,
    items: [
      { title: "Tabela de Preços", url: "/tabela-precos" },
      { title: "Orçamentos", url: "/orcamentos" },
      { title: "Pedidos de Venda", url: "/pedidos-venda" },
      { title: "Faturamento", url: "/faturamento" },
    ]
  },
  {
    title: "Compras",
    icon: Package,
    items: [
      { title: "Pedidos de Compra", url: "/pedidos-compra" },
    ]
  },
  {
    title: "Financeiro",
    icon: CreditCard,
    items: [
      { title: "Contas a Receber", url: "/contas-receber" },
      { title: "Contas a Pagar", url: "/contas-pagar" },
      { title: "Conta Corrente", url: "/conta-corrente" },
      { title: "Fluxo de Caixa", url: "/fluxo-caixa" },
    ]
  },
  {
    title: "Produção",
    icon: Factory,
    items: [
      { title: "Ordens de Produção", url: "/ordens-producao" },
      { title: "Conferência", url: "/conferencia" },
    ]
  },
  {
    title: "Configurações",
    url: "/configuracoes",
    icon: Settings,
  },
]

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-border" collapsible="icon">
      <SidebarHeader className="border-b border-border p-4">
        <div className="flex items-center justify-center group-data-[collapsible=icon]:justify-center">
          <Factory className="h-8 w-8 text-primary flex-shrink-0" />
          <div className="ml-2 group-data-[collapsible=icon]:hidden">
            <h1 className="text-lg font-bold text-foreground">InduSoft</h1>
            <p className="text-xs text-muted-foreground">ERP Industrial</p>
          </div>
        </div>
        <div className="mt-4 flex justify-center">
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-2">
        {menuItems.map((item, index) => (
          <SidebarGroup key={index}>
            {item.items ? (
              <>
                <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center">
                  <item.icon className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.items.map((subItem) => (
                      <SidebarMenuItem key={subItem.title}>
                        <SidebarMenuButton asChild className="text-sm">
                          <Link to={subItem.url}>
                            <span className="group-data-[collapsible=icon]:sr-only">{subItem.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </>
            ) : (
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="text-sm font-medium">
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      <span className="group-data-[collapsible=icon]:sr-only">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            )}
          </SidebarGroup>
        ))}
      </SidebarContent>
      
      <SidebarFooter className="border-t border-border p-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground group-data-[collapsible=icon]:justify-center">
          <Users className="h-4 w-4 flex-shrink-0" />
          <span className="group-data-[collapsible=icon]:hidden">Admin User</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
