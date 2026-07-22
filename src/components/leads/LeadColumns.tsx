
import { useMemo } from 'react';
import { useTenant } from '@/hooks/use-tenant';
import type { ColumnDef } from '@tanstack/react-table';
import type { Lead } from '@/types/lead';

export function useLeadColumns(): ColumnDef<Lead>[] {
  const { tenant } = useTenant();

  return useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Client Name',
      },
      {
        accessorKey: 'budget',
        header: 'Budget',
        cell: ({ row }) => {
          const amount = parseFloat(row.getValue('budget'));
          return new Intl.NumberFormat('en-EG', {
            style: 'currency',
            currency: tenant?.currency || 'EGP', 
          }).format(amount);
        },
      },
    ],
    [tenant?.currency]
  );
}