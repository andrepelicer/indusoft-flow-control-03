
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Briefcase } from "lucide-react"

interface Transportadora {
  id: number
  nome: string
  cnpj: string
  telefone: string
  cidade: string
}

export default function Transportadoras() {
  const [transportadoras, setTransportadoras] = useState<Transportadora[]>([])
  const [nome, setNome] = useState("")
  const [cnpj, setCnpj] = useState("")
  const [telefone, setTelefone] = useState("")
  const [cidade, setCidade] = useState("")

  const cadastrar = (e: React.FormEvent) => {
    e.preventDefault()
    setTransportadoras(prev => [
      ...prev,
      {
        id: Date.now(),
        nome,
        cnpj,
        telefone,
        cidade,
      },
    ])
    setNome("")
    setCnpj("")
    setTelefone("")
    setCidade("")
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-2">
              <Briefcase />
              Cadastro de Transportadoras
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={cadastrar} className="grid gap-4">
            <Input
              placeholder="Nome da transportadora"
              value={nome}
              onChange={e => setNome(e.target.value)}
              required
            />
            <Input
              placeholder="CNPJ"
              value={cnpj}
              onChange={e => setCnpj(e.target.value)}
              required
            />
            <Input
              placeholder="Telefone"
              value={telefone}
              onChange={e => setTelefone(e.target.value)}
              required
            />
            <Input
              placeholder="Cidade"
              value={cidade}
              onChange={e => setCidade(e.target.value)}
              required
            />
            <Button type="submit">Cadastrar</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Transportadoras Cadastradas</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {transportadoras.length === 0 && (
              <li className="text-muted-foreground text-sm">Nenhuma transportadora cadastrada ainda.</li>
            )}
            {transportadoras.map(t => (
              <li key={t.id} className="border px-3 py-2 rounded">
                <strong>{t.nome}</strong> • {t.cnpj} • {t.telefone} • {t.cidade}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
