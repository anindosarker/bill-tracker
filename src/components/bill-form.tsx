"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBillAction } from "@/hooks/actions/useBillAction";
import { useWorkerAction } from "@/hooks/actions/useWorkerAction";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Printer } from "lucide-react";

const billFormSchema = z.object({
  workerName: z.string().min(1, "Worker name is required"),
  workingHours: z.coerce.number().min(0, "Working hours must be positive"),
  wagePerHour: z.coerce.number().min(0, "Wage per hour must be positive"),
  overtimeHours: z.coerce.number().min(0).default(0),
  overtimeWagePerHour: z.coerce.number().min(0).default(0),
  paymentStatus: z.string().default("cash"),
  signature: z.string().optional(),
});

type BillFormValues = z.infer<typeof billFormSchema>;

interface BillFormProps {
  initialData?: {
    workerName: string;
    workingHours: number;
    wagePerHour: number;
    overtimeHours: number;
    overtimeWagePerHour: number;
    paymentStatus: string;
    signature?: string;
  };
  billId?: string;
  onSuccess?: () => void;
}

export function BillForm({ initialData, billId, onSuccess }: BillFormProps) {
  const router = useRouter();
  const { createBillMutation, updateBillMutation } = useBillAction();
  const { useWorkersQuery, createWorkerMutation } = useWorkerAction();
  const { data: workers = [], isLoading: workersLoading } = useWorkersQuery();
  const [newWorkerName, setNewWorkerName] = useState("");

  const form = useForm<BillFormValues>({
    resolver: zodResolver(billFormSchema),
    defaultValues: initialData || {
      workerName: "",
      workingHours: 0,
      wagePerHour: 0,
      overtimeHours: 0,
      overtimeWagePerHour: 0,
      paymentStatus: "cash",
      signature: "",
    },
  });

  const watchedValues = form.watch();

  const totalTk = useMemo(() => {
    const regularPay =
      (watchedValues.workingHours || 0) * (watchedValues.wagePerHour || 0);
    const overtimePay =
      (watchedValues.overtimeHours || 0) *
      (watchedValues.overtimeWagePerHour || 0);
    return regularPay + overtimePay;
  }, [
    watchedValues.workingHours,
    watchedValues.wagePerHour,
    watchedValues.overtimeHours,
    watchedValues.overtimeWagePerHour,
  ]);

  const handleAddWorker = async () => {
    if (!newWorkerName.trim()) return;
    await createWorkerMutation.mutateAsync(newWorkerName.trim());
    setNewWorkerName("");
  };

  const onSubmit = async (data: BillFormValues) => {
    try {
      if (billId) {
        await updateBillMutation.mutateAsync({
          id: billId,
          data: {
            ...data,
            totalTk,
          },
        });
      } else {
        await createBillMutation.mutateAsync({
          ...data,
          totalTk,
        });
      }
      form.reset();
      if (onSuccess) {
        onSuccess();
      } else if (billId) {
        router.push(`/bills/${billId}`);
      } else {
        router.push("/bills");
      }
    } catch (error) {
      console.error("Error submitting bill:", error);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">
          {billId ? "Edit Bill" : "Create New Bill"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="workerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Worker Name</FormLabel>
                    <div className="flex gap-2">
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={workersLoading}
                      >
                        <FormControl>
                          <SelectTrigger className="flex-1 min-h-[44px]">
                            <SelectValue placeholder="Select or type worker name" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {workers.map((worker) => (
                            <SelectItem key={worker._id} value={worker.name}>
                              {worker.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="Or type worker name directly"
                        value={newWorkerName || field.value}
                        onChange={(e) => {
                          const value = e.target.value;
                          setNewWorkerName(value);
                          field.onChange(value);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (newWorkerName.trim() && newWorkerName.trim() !== field.value) {
                              handleAddWorker();
                            }
                          }
                        }}
                        className="flex-1 min-h-[44px]"
                      />
                      <Button
                        type="button"
                        onClick={async () => {
                          if (newWorkerName.trim()) {
                            await handleAddWorker();
                            field.onChange(newWorkerName.trim());
                            setNewWorkerName("");
                          }
                        }}
                        disabled={!newWorkerName.trim()}
                        variant="outline"
                        className="min-h-[44px]"
                      >
                        Add
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="workingHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Working Hours</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.5"
                        {...field}
                        className="text-lg min-h-[44px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="wagePerHour"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wage Per Hour (Tk)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        className="text-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="overtimeHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Overtime (Hours)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.5"
                        {...field}
                        className="text-lg min-h-[44px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="overtimeWagePerHour"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Overtime Wage Per Hour (Tk)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        className="text-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="text-lg min-h-[44px]">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="bank">Bank</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total (Tk):</span>
                <span className="text-2xl font-bold">
                  {totalTk.toLocaleString("en-BD")}
                </span>
              </div>
            </div>

            <FormField
              control={form.control}
              name="signature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Signature</FormLabel>
                  <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Signature or notes"
                        rows={3}
                        className="text-lg min-h-[100px]"
                      />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/bills")}
                className="min-h-[44px] min-w-[100px]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  createBillMutation.isPending || updateBillMutation.isPending
                }
                className="min-w-[140px] min-h-[44px]"
              >
                {createBillMutation.isPending || updateBillMutation.isPending
                  ? "Saving..."
                  : billId
                    ? "Update Bill"
                    : "Create Bill"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
