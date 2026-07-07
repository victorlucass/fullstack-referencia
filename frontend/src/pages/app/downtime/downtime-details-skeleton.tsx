import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'

export function DowntimeDetailsSkeleton() {
  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell className="text-muted-foreground">Status</TableCell>
          <TableCell className="flex justify-end">
            <Skeleton className="h-5 w-20" />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="text-muted-foreground">Linha</TableCell>
          <TableCell className="flex justify-end">
            <Skeleton className="h-5 w-[100px]" />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="text-muted-foreground">Máquina</TableCell>
          <TableCell className="flex justify-end">
            <Skeleton className="h-5 w-[140px]" />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="text-muted-foreground">Causa</TableCell>
          <TableCell className="flex justify-end">
            <Skeleton className="h-5 w-[164px]" />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="text-muted-foreground">Início</TableCell>
          <TableCell className="flex justify-end">
            <Skeleton className="h-5 w-[148px]" />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="text-muted-foreground">Duração</TableCell>
          <TableCell className="flex justify-end">
            <Skeleton className="h-5 w-20" />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
