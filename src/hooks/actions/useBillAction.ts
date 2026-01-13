"use client";

import type { IBillEntry, UpdateBillDTO } from "@/types/bill.types";
import { billServiceFrontend } from "@/lib/services/bill.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
      toast.success("Bill created successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create bill");
    },
  });

  const updateBillMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateBillDTO;
    }) => billServiceFrontend.updateBill(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: BILL_KEYS.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: BILL_KEYS.all });
      toast.success("Bill updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update bill");
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
