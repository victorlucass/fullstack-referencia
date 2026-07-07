import { zodResolver } from '@hookform/resolvers/zod'
import { Search, X } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const machines = [
  'Printer',
  'SPI',
  'Placement',
  'AOI Pré',
  'Reflow',
  'AOI Pós',
  'Router',
]

const downtimeFiltersSchema = z.object({
  machine: z.string().optional(),
  cause: z.string().optional(),
  status: z.string().optional(),
})

type DowntimeFiltersSchema = z.infer<typeof downtimeFiltersSchema>

export function DowntimeTableFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const machine = searchParams.get('machine')
  const cause = searchParams.get('cause')
  const status = searchParams.get('status')

  const { register, handleSubmit, control, reset } =
    useForm<DowntimeFiltersSchema>({
      resolver: zodResolver(downtimeFiltersSchema),
      defaultValues: {
        machine: machine ?? 'all',
        cause: cause ?? '',
        status: status ?? 'all',
      },
    })

  function handleFilter({ cause, machine, status }: DowntimeFiltersSchema) {
    setSearchParams((state) => {
      if (machine && machine !== 'all') {
        state.set('machine', machine)
      } else {
        state.delete('machine')
      }

      if (cause) {
        state.set('cause', cause)
      } else {
        state.delete('cause')
      }

      if (status && status !== 'all') {
        state.set('status', status)
      } else {
        state.delete('status')
      }

      state.set('page', '1')

      return state
    })
  }

  function handleClearFilters() {
    setSearchParams((state) => {
      state.delete('machine')
      state.delete('cause')
      state.delete('status')
      state.set('page', '1')

      return state
    })

    reset({
      machine: 'all',
      cause: '',
      status: 'all',
    })
  }

  return (
    <form
      onSubmit={handleSubmit(handleFilter)}
      className="flex items-center gap-2"
    >
      <span className="text-sm font-semibold">Filtros:</span>

      <Controller
        name="machine"
        control={control}
        render={({ field: { name, onChange, value, disabled } }) => {
          return (
            <Select
              defaultValue="all"
              name={name}
              onValueChange={onChange}
              value={value}
              disabled={disabled}
            >
              <SelectTrigger className="h-8 w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as máquinas</SelectItem>
                {machines.map((machine) => (
                  <SelectItem key={machine} value={machine}>
                    {machine}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )
        }}
      ></Controller>

      <Input
        placeholder="Causa da parada"
        className="h-8 w-[220px]"
        {...register('cause')}
      />

      <Controller
        name="status"
        control={control}
        render={({ field: { name, onChange, value, disabled } }) => {
          return (
            <Select
              defaultValue="all"
              name={name}
              onValueChange={onChange}
              value={value}
              disabled={disabled}
            >
              <SelectTrigger className="h-8 w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos status</SelectItem>
                <SelectItem value="open">Aberta</SelectItem>
                <SelectItem value="resolved">Resolvida</SelectItem>
              </SelectContent>
            </Select>
          )
        }}
      ></Controller>

      <Button variant="secondary" size="xs" type="submit">
        <Search className="mr-2 h-4 w-4" />
        Filtrar resultados
      </Button>
      <Button
        onClick={handleClearFilters}
        variant="outline"
        size="xs"
        type="button"
      >
        <X className="mr-2 h-4 w-4" />
        Remover filtros
      </Button>
    </form>
  )
}
