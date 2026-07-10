import { AlertTriangle, LayoutDashboard } from 'lucide-react'

import { AccountMenu } from './account-menu'
import { NavLink } from './nav-link'
import { ThemeToggle } from './theme/theme-toggle'
import { Separator } from './ui/separator'

export function Header() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center gap-6 px-6">
        <div className="flex items-center">
          <img
            src="/jabil/jabil-logo-blue.svg"
            alt="Jabil"
            className="h-6 dark:hidden"
          />
          <img
            src="/jabil/jabil-logo-white-sky.svg"
            alt="Jabil"
            className="hidden h-6 dark:block"
          />
        </div>

        <Separator orientation="vertical" className="h-6" />

        <nav className="flex items-center space-x-4 lg:space-x-6">
          <NavLink to="/">
            <LayoutDashboard className="h-4 w-4" />
            Visão Operacional
          </NavLink>
          <NavLink to="/downtime">
            <AlertTriangle className="h-4 w-4" />
            Histórico de Paradas
          </NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <AccountMenu />
        </div>
      </div>
    </div>
  )
}
