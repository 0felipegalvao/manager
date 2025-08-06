import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const all = searchParams.get('all') === 'true'

    const clients = await prisma.client.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        department: true,
        partners: true,
        clientContacts: true,
        contacts: true,
        _count: {
          select: {
            documents: true,
            obligations: true,
            tasks: true,
          },
        },
      },
    })
    return NextResponse.json(clients)
  } catch (error: any) {
    console.error('Erro ao buscar clientes:', error)
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor' },
      { status: error.status || 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Mapear dados do frontend para o formato do backend
    const clientData = {
      razaoSocial: data.razaoSocial,
      nomeFantasia: data.nomeFantasia || null,
      cnpj: (data.documento || data.cnpj || '').replace(/\D/g, ''), // Remove formatação
      inscricaoEstadual: data.inscricaoEstadual || null,
      inscricaoMunicipal: data.inscricaoMunicipal || null,
      taxRegime: data.taxRegime || data.regimeTributario || 'SIMPLES_NACIONAL',
      status: data.status || 'ATIVO',
      endereco: data.endereco || data.logradouro,
      numero: data.numero,
      complemento: data.complemento || null,
      bairro: data.bairro,
      cidade: data.cidade,
      estado: data.estado,
      cep: data.cep.replace(/\D/g, ''), // Remove formatação
      telefone: data.telefone || null,
      celular: null, // Pode ser adicionado depois
      email: data.email || null,
      emailContador: null, // Pode ser adicionado depois
      dataAbertura: null, // Pode ser adicionado depois
      capitalSocial: null, // Pode ser adicionado depois
      atividadePrincipal: null, // Pode ser adicionado depois
      dataVencimento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dias a partir de hoje
      valorMensal: null, // Pode ser adicionado depois
      observacoes: null, // Pode ser adicionado depois
    }
    
    const client = await prisma.client.create({
      data: {
        ...clientData,
        userId: data.userId || 1, // Usar userId do request ou padrão
        // Adicionar novos campos diretos
        cpf: data.cpf || null,
        codigoSimples: data.codigoSimples || null,
        inicioAtividade: data.inicioAtividade ? new Date(data.inicioAtividade) : null,
        inicioEscritorio: data.inicioEscritorio ? new Date(data.inicioEscritorio) : null,
        dataSituacao: data.dataSituacao ? new Date(data.dataSituacao) : null,
        porte: data.porte || null,
        departmentId: data.departmentId || null,
        porcPJEcac: data.porcPJEcac || null,
        procPFEcac: data.procPFEcac || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        department: true,
        partners: true,
        clientContacts: true,
        contacts: true,
      },
    })
    return NextResponse.json(client, { status: 201 })
  } catch (error: any) {
    console.error('Erro ao criar cliente:', error)
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor' },
      { status: error.status || 500 }
    )
  }
}
