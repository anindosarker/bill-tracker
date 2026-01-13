"use client";

import { billServiceFrontend } from "@/lib/services/bill.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const BILL_KEYS = {
  all: ["bills"] as const,
  detail: (id: string) => ["bills", id] as const,
};

export function useBillAction() {
  const queryClient = useQueryClient();

  const createBillMutation = useMutation({
    mutationFn: billServiceFrontend.createBill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BILL_KEYS.all });
    },
  });

  const updateBillMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: {
        workerName: string;
        workingHours: number;
        wagePerHour: number;
        overtimeHours: number;
        overtimeWagePerHour: number;
        paymentStatus: string;
        totalTk: number;
        signature?: string;
      };
    }) => billServiceFrontend.updateBill(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: BILL_KEYS.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: BILL_KEYS.all });
    },
  });

  const useBillsQuery = () =>
    useQuery({
      queryKey: BILL_KEYS.all,
      queryFn: billServiceFrontend.getAllBills,
    });

  const useBillQuery = (id: string) =>
    useQuery({
      queryKey: BILL_KEYS.detail(id),
      queryFn: () => billServiceFrontend.getBill(id),
    });

  return {
    createBillMutation,
    updateBillMutation,
    useBillsQuery,
    useBillQuery,
  };
}
