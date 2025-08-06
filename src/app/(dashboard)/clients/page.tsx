import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export default function ClientsPage() {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Clientes</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h1 className="text-2xl font-bold mb-4">Gestão de Clientes</h1>
          <p className="text-muted-foreground">
            Aqui você pode gerenciar todos os seus clientes, adicionar novos clientes, 
            editar informações existentes e visualizar o histórico de cada cliente.
          </p>
        </div>
        <div className="bg-muted/50 min-h-[60vh] flex-1 rounded-xl flex items-center justify-center">
          <p className="text-muted-foreground">Lista de clientes será implementada aqui</p>
        </div>
      </div>
    </>
  )
}
