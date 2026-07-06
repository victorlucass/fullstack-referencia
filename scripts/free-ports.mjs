#!/usr/bin/env node
import { execSync } from 'node:child_process'

const ports = process.argv.slice(2)

if (ports.length === 0) {
  console.error('Uso: node scripts/free-ports.mjs <porta> [porta...]')
  process.exit(1)
}

for (const port of ports) {
  let pids = ''

  try {
    pids = execSync(`lsof -ti:${port}`, { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim()
  } catch {
    continue // nenhum processo escutando nessa porta
  }

  if (!pids) continue

  for (const pid of pids.split('\n').filter(Boolean)) {
    try {
      process.kill(Number(pid), 'SIGKILL')
      console.log(`[free-ports] porta ${port} estava em uso pelo PID ${pid}, encerrado.`)
    } catch {
      // processo já não existe mais
    }
  }
}
