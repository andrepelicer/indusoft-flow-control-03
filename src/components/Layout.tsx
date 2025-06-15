
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./AppSidebar"
import { useLocation } from "react-router-dom"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation()
  
  // Não mostrar sidebar na página de login
  if (location.pathname === "/login" || location.pathname === "/") {
    return <div className="min-h-screen w-full">{children}</div>
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <div className="flex h-full w-full flex-col">
            <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger />
              <div className="ml-auto flex items-center space-x-4">
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  InduSoft ERP Industrial
                </span>
              </div>
            </header>
            <main className="flex-1 overflow-auto">
              <div className="container mx-auto p-4 max-w-full">
                {children}
              </div>
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
