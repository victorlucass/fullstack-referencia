import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { getManagedLine, GetManagedLineResponse } from '@/api/get-managed-line'
import { updateProfile } from '@/api/update-profile'

import { Button } from './ui/button'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'

const lineProfileSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable(),
})

type LineProfileSchema = z.infer<typeof lineProfileSchema>

export function LineProfileDialog() {
  const queryClient = useQueryClient()

  const { data: managedLine } = useQuery({
    queryKey: ['managed-line'],
    queryFn: getManagedLine,
    staleTime: Infinity,
  })

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LineProfileSchema>({
    resolver: zodResolver(lineProfileSchema),
    values: {
      name: managedLine?.name ?? '',
      description: managedLine?.description ?? '',
    },
  })

  const { mutateAsync: updateProfileFn } = useMutation({
    mutationFn: updateProfile,
    onMutate({ description, name }) {
      const { cached } = updateManagedLineCache({ description, name })

      return { previousProfile: cached }
    },
    onError(_, __, context) {
      if (context?.previousProfile) {
        updateManagedLineCache(context.previousProfile)
      }
    },
  })

  function updateManagedLineCache({ name, description }: LineProfileSchema) {
    const cached = queryClient.getQueryData<GetManagedLineResponse>([
      'managed-line',
    ])

    if (cached) {
      queryClient.setQueryData<GetManagedLineResponse>(['managed-line'], {
        ...cached,
        name,
        description,
      })
    }

    return { cached }
  }

  async function handleUpdateProfile(data: LineProfileSchema) {
    try {
      await updateProfileFn({
        name: data.name,
        description: data.description,
      })

      toast.success('Configurações da linha atualizadas com sucesso!')
    } catch {
      toast.error('Falha ao atualizar a linha, tente novamente')
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Configurações da linha</DialogTitle>
        <DialogDescription>
          Atualize as informações da linha SMT exibidas no painel
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(handleUpdateProfile)}>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="name">
              Nome
            </Label>
            <Input className="col-span-3" id="name" {...register('name')} />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="description">
              Descrição
            </Label>
            <Textarea
              className="col-span-3"
              id="description"
              {...register('description')}
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" type="button">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit" variant="success" disabled={isSubmitting}>
            Salvar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
