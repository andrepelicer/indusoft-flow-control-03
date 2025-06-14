
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Plus, Settings } from "lucide-react"

const Usuarios = () => {
  const usuarios = [
    { id: 1, nome: "João Silva", email: "joao@empresa.com", nivel: "Admin", status: "Ativo" },
    { id: 2, nome: "Maria Santos", email: "maria@empresa.com", nivel: "Gestor", status: "Ativo" },
    { id: 3, nome: "Pedro Costa", email: "pedro@empresa.com", nivel: "Operador", status: "Inativo" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestão de Usuários</h2>
          <p className="text-muted-foreground">Gerencie até 20 usuários por empresa</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Usuário
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
          <CardDescription>
            Usuários cadastrados no sistema com seus respectivos níveis de acesso
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {usuarios.map((usuario) => (
              <div key={usuario.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{usuario.nome}</p>
                    <p className="text-sm text-muted-foreground">{usuario.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={usuario.nivel === 'Admin' ? 'default' : 'secondary'}>
                    {usuario.nivel}
                  </Badge>
                  <Badge variant={usuario.status === 'Ativo' ? 'default' : 'secondary'}>
                    {usuario.status}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Próxima Fase:</strong> Implementaremos CRUD completo de usuários, sistema de permissões detalhado e autenticação 2FA.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Usuarios
