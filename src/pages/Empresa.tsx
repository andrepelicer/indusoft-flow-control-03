
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const Empresa = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados da Empresa</CardTitle>
        <CardDescription>
          Configure as informações básicas da sua empresa
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Razão Social</label>
            <Input placeholder="Nome da empresa" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">CNPJ</label>
            <Input placeholder="00.000.000/0000-00" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">E-mail</label>
            <Input type="email" placeholder="contato@empresa.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Telefone</label>
            <Input placeholder="(11) 99999-9999" />
          </div>
        </div>
        
        <div className="pt-4">
          <Button>Salvar Alterações</Button>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Próxima Fase:</strong> Implementaremos validação completa de CNPJ, integração com APIs de CEP e configurações avançadas da empresa.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default Empresa
