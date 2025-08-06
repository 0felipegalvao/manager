"use client"

import * as React from "react"
import {
  Building2,
  Calculator,
  FileText,
  Home,
  Receipt,
  Settings,
  Users,
  Bell,
  BarChart3,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// Dados do sistema de gestão contábil
const data = {
  company: {
    name: "Gestão Contábil",
    logo: Building2,
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      isActive: true,
    },
    {
      title: "Clientes",
      url: "/clients",
      icon: Users,
    },
    {
      title: "Documentos",
      url: "/documents",
      icon: FileText,
    },
    {
      title: "Fiscal",
      url: "/fiscal",
      icon: Calculator,
    },
    {
      title: "Relatórios",
      url: "/reports",
      icon: BarChart3,
    },
    {
      title: "Notificações",
      url: "/notifications",
      icon: Bell,
    },
    {
      title: "Configurações",
      url: "/settings",
      icon: Settings,
    },
  ],
  modules: [
    {
      name: "Notas Fiscais",
      url: "/fiscal/invoices",
      icon: Receipt,
    },
    {
      name: "Relatórios Fiscais",
      url: "/fiscal/reports",
      icon: BarChart3,
    },
    {
      name: "Documentos Contábeis",
      url: "/documents/accounting",
      icon: FileText,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher company={data.company} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.modules} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
