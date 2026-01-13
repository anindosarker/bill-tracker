"use client";

import { workerServiceFrontend } from "@/lib/services/worker.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const WORKER_KEYS = {
  all: ["workers"] as const,
};

export function useWorkerAction() {
  const queryClient = useQueryClient();

  const createWorkerMutation = useMutation({
    mutationFn: workerServiceFrontend.createWorker,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORKER_KEYS.all });
    },
  });

  const useWorkersQuery = () =>
    useQuery({
      queryKey: WORKER_KEYS.all,
      queryFn: workerServiceFrontend.getAllWorkers,
    });

  return {
    createWorkerMutation,
    useWorkersQuery,
  };
}
