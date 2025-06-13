
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Package, Users, CreditCard, TrendingUp, TrendingDown } from "lucide-react"

const Dashboard = () => {
  const stats = [
    {
      title: "Pedidos Hoje",
      value: "12",
      change: "+8%",
      trend: "up",
      icon: Package,
    },
    {
      title: "Faturamento Mensal",
      value: "R$ 125.430",
      change: "+12%",
      trend: "up",
      icon: CreditCard,
    },
    {
      title: "Clientes Ativos",
      value: "89",
      change: "+3%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Contas em Atraso",
      value: "R$ 8.230",
      change: "-15%",
      trend: "down",
      icon: TrendingDown,
    },
  ]

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold">Dashboard</h1>
            </div>
          </header>
          
          <main className="flex-1 p-6 space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className={`text-xs ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change} em relação ao mês anterior
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Visão Geral</CardTitle>
                  <CardDescription>
                    Resumo das principais métricas do seu negócio
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                    <BarChart3 className="h-12 w-12" />
                    <span className="ml-2">Gráficos serão implementados na próxima fase</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Atividades Recentes</CardTitle>
                  <CardDescription>
                    Últimas movimentações do sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">Novo pedido #001</p>
                        <p className="text-xs text-muted-foreground">Cliente: ABC Indústria</p>
                        <p className="text-xs text-muted-foreground">Há 2 horas</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">Pagamento recebido</p>
                        <p className="text-xs text-muted-foreground">R$ 5.430,00</p>
                        <p className="text-xs text-muted-foreground">Há 4 horas</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-2 h-2 rounded-full bg-orange-500 mt-2"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">Estoque baixo</p>
                        <p className="text-xs text-muted-foreground">Produto: Parafuso M8</p>
                        <p className="text-xs text-muted-foreground">Há 6 horas</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

export default Dashboard
