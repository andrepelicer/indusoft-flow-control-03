
import React, { createContext, useContext, useState, ReactNode } from 'react'

export interface OrdemProducao {
  id: number
  numero: string
  produtoId: number
  produto: string
  codigo: string
  quantidade: number
  status: 'Pendente' | 'Em Andamento' | 'Concluído' | 'Cancelado'
  dataCriacao: string
  dataPrevisao: string
  observacoes: string
}

interface OrdensProducaoContextType {
  ordens: OrdemProducao[]
  adicionarOrdem: (ordem: Omit<OrdemProducao, 'id'>) => OrdemProducao
  removerOrdem: (id: number) => void
  atualizarOrdem: (id: number, ordem: Partial<OrdemProducao>) => void
}

const OrdensProducaoContext = createContext<OrdensProducaoContextType | undefined>(undefined)

export const useOrdensProducao = () => {
  const context = useContext(OrdensProducaoContext)
  if (!context) {
    throw new Error('useOrdensProducao deve ser usado dentro de OrdensProducaoProvider')
  }
  return context
}

export const OrdensProducaoProvider = ({ children }: { children: ReactNode }) => {
  const [ordens, setOrdens] = useState<OrdemProducao[]>([])

  const adicionarOrdem = (ordemData: Omit<OrdemProducao, 'id'>): OrdemProducao => {
    const novaOrdem: OrdemProducao = {
      ...ordemData,
      id: Date.now()
    }
    setOrdens(prev => [...prev, novaOrdem])
    return novaOrdem
  }

  const removerOrdem = (id: number) => {
    setOrdens(prev => prev.filter(ordem => ordem.id !== id))
  }

  const atualizarOrdem = (id: number, ordemData: Partial<OrdemProducao>) => {
    setOrdens(prev => prev.map(ordem => 
      ordem.id === id ? { ...ordem, ...ordemData } : ordem
    ))
  }

  return (
    <OrdensProducaoContext.Provider value={{
      ordens,
      adicionarOrdem,
      removerOrdem,
      atualizarOrdem
    }}>
      {children}
    </OrdensProducaoContext.Provider>
  )
}
