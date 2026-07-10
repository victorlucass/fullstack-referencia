import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="grid min-h-screen grid-cols-2 antialiased">
      <div className="flex h-full flex-col justify-between border-r border-foreground/5 bg-muted p-10 text-muted-foreground">
        <div className="flex items-center">
          <img
            src="/jabil/jabil-logo-blue.svg"
            alt="Jabil"
            className="h-7 dark:hidden"
          />
          <img
            src="/jabil/jabil-logo-white-sky.svg"
            alt="Jabil"
            className="hidden h-7 dark:block"
          />
        </div>

        <footer className="text-sm">
          Sistema Inteligente BIL &copy; Jabil - {new Date().getFullYear()}
        </footer>
      </div>

      <div className="relative flex flex-col items-center justify-center">
        <Outlet />
      </div>
    </div>
  )
}
