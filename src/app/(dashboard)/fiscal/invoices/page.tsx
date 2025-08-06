import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export default function InvoicesPage() {
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
                <BreadcrumbLink href="/fiscal">Fiscal</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Notas Fiscais</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h1 className="text-2xl font-bold mb-4">Notas Fiscais</h1>
          <p className="text-muted-foreground">
            Gerencie todas as notas fiscais dos seus clientes em um só lugar.
            Emissão, controle e acompanhamento de NFe, NFCe e NFSe.
          </p>
        </div>
        <div className="bg-muted/50 min-h-[60vh] flex-1 rounded-xl flex items-center justify-center">
          <p className="text-muted-foreground">Sistema de notas fiscais será implementado aqui</p>
        </div>
      </div>
    </>
  )
}
