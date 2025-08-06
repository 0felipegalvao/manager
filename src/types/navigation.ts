import { LucideIcon } from 'lucide-react';

export interface NavigationItem {
  title: string;
  href?: string;
  icon?: LucideIcon;
  roles: string[];
  items?: NavigationSubItem[];
  badge?: string | number;
  isActive?: boolean;
}

export interface NavigationSubItem {
  title: string;
  href: string;
  badge?: string | number;
  isActive?: boolean;
}

export interface NavigationGroup {
  title: string;
  items: NavigationItem[];
}

export interface NavigationData {
  user?: {
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
  groups: NavigationGroup[];
}
