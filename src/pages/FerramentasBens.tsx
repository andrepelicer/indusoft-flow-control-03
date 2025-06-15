
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Wrench } from "lucide-react"

interface BemFerramenta {
  id: number
  nome: string
  tipo: string
  codigo: string
  status: string
}

export default function FerramentasBens() {
  const [itens, setItens] = useState<BemFerramenta[]>([])
  const [nome, setNome] = useState("")
  const [tipo, setTipo] = useState("")
  const [codigo, setCodigo] = useState("")
  const [status, setStatus] = useState("Disponível")

  const cadastrar = (e: React.FormEvent) => {
    e.preventDefault()
    setItens(prev => [
      ...prev,
      {
        id: Date.now(),
        nome,
        tipo,
        codigo,
        status,
      },
    ])
    setNome("")
    setTipo("")
    setCodigo("")
    setStatus("Disponível")
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-2">
              <Wrench />
              Cadastro de Ferramentas e Bens
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={cadastrar} className="grid gap-4">
            <Input
              placeholder="Nome do bem/ferramenta"
              value={nome}
              onChange={e => setNome(e.target.value)}
              required
            />
            <Input
              placeholder="Tipo (ex: Ferramenta, Equipamento, Veículo)"
              value={tipo}
              onChange={e => setTipo(e.target.value)}
              required
            />
            <Input
              placeholder="Código de identificação"
              value={codigo}
              onChange={e => setCodigo(e.target.value)}
              required
            />
            <Input
              placeholder="Status (ex: Disponível, Em uso, Manutenção)"
              value={status}
              onChange={e => setStatus(e.target.value)}
              required
            />
            <Button type="submit">Cadastrar</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Ferramentas/Bens Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {itens.length === 0 && (
              <li className="text-muted-foreground text-sm">Nenhum item cadastrado ainda.</li>
            )}
            {itens.map(i => (
              <li key={i.id} className="border px-3 py-2 rounded">
                <strong>{i.nome}</strong> • {i.tipo} • {i.codigo} • {i.status}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
