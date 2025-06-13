
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
    ]
  },
  {
    title: "Comercial",
    icon: ShoppingCart,
    items: [
      { title: "Orçamentos", url: "/orcamentos" },
      { title: "Pedidos de Venda", url: "/pedidos-venda" },
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
    <Sidebar className="border-r border-border">
      <SidebarHeader className="border-b border-border p-4">
        <div className="flex items-center gap-2">
          <Factory className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-lg font-bold text-foreground">InduSoft</h1>
            <p className="text-xs text-muted-foreground">ERP Industrial</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-2">
        {menuItems.map((item, index) => (
          <SidebarGroup key={index}>
            {item.items ? (
              <>
                <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.title}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.items.map((subItem) => (
                      <SidebarMenuItem key={subItem.title}>
                        <SidebarMenuButton asChild className="text-sm">
                          <Link to={subItem.url}>
                            <span>{subItem.title}</span>
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
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            )}
          </SidebarGroup>
        ))}
      </SidebarContent>
      
      <SidebarFooter className="border-t border-border p-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>Admin User</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
