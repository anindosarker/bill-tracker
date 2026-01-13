"use client";

import { IBillEntry } from "@/backend/models/bill.model";
import { BillPreview } from "@/components/bill-preview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { WorkerCombobox } from "@/components/worker-combobox";
import { useBillAction } from "@/hooks/actions/useBillAction";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const billEntrySchema = z.object({
  workerName: z.string().min(1, "Worker name is required"),
  workingHours: z
    .union([
      z.string().transform((val) => (val === "" ? undefined : Number(val))),
      z.number(),
      z.undefined(),
    ])
    .pipe(z.number().min(0, "Working hours must be positive").optional()),
  wagePerHour: z
    .union([
      z.string().transform((val) => (val === "" ? undefined : Number(val))),
      z.number(),
      z.undefined(),
    ])
    .pipe(z.number().min(0, "Wage per hour must be positive").optional()),
  overtimeHours: z
    .union([
      z.string().transform((val) => (val === "" ? undefined : Number(val))),
      z.number(),
      z.undefined(),
    ])
    .pipe(z.number().min(0, "Overtime hours must be positive").optional()),
  overtimeWagePerHour: z
    .union([
      z.string().transform((val) => (val === "" ? undefined : Number(val))),
      z.number(),
      z.undefined(),
    ])
    .pipe(
      z.number().min(0, "Overtime wage per hour must be positive").optional(),
    ),
});

const billFormSchema = z.object({
  entries: z
    .array(billEntrySchema)
    .min(1, "At least one worker entry is required"),
});

type BillFormValues = z.infer<typeof billFormSchema>;

interface BillFormProps {
  initialData?: {
    entries: IBillEntry[];
    notes?: string;
    preparedBy?: string;
    checkedBy?: string;
    approvedBy?: string;
    signatoryName?: string;
    duration?: string;
  };
  billId?: string;
  onSuccess?: () => void;
}

export function BillForm({ initialData, billId, onSuccess }: BillFormProps) {
  const router = useRouter();
  const { createBillMutation, updateBillMutation } = useBillAction();

  const [notes, setNotes] = useState(initialData?.notes || "");
  const [preparedBy, setPreparedBy] = useState(initialData?.preparedBy || "");
  const [checkedBy, setCheckedBy] = useState(initialData?.checkedBy || "");
  const [approvedBy, setApprovedBy] = useState(initialData?.approvedBy || "");
  const [signatoryName, setSignatoryName] = useState(
    initialData?.signatoryName || "Prodip Kumar Sarker"
  );

  // Parse duration from string format "DD.MM.YYYY to DD.MM.YYYY" or initialize with empty dates
  const parseDuration = (durationStr?: string) => {
    if (!durationStr) return { fromDate: "", toDate: "" };
    const match = durationStr.match(
      /(\d{2}\.\d{2}\.\d{4})\s+to\s+(\d{2}\.\d{2}\.\d{4})/,
    );
    if (match) {
      // Convert DD.MM.YYYY to YYYY-MM-DD for date input
      const fromDate = match[1].split(".").reverse().join("-");
      const toDate = match[2].split(".").reverse().join("-");
      return { fromDate, toDate };
    }
    return { fromDate: "", toDate: "" };
  };

  const initialDuration = parseDuration(initialData?.duration);
  const [durationFrom, setDurationFrom] = useState(initialDuration.fromDate);
  const [durationTo, setDurationTo] = useState(initialDuration.toDate);
  const [billDate, setBillDate] = useState(() => {
    // Format current date as YYYY-MM-DD for date input
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  });
  const [signatures, setSignatures] = useState<string[]>(
    initialData?.entries?.map((e) => e.signature || "") || [],
  );
  const [paymentStatuses, setPaymentStatuses] = useState<string[]>(
    initialData?.entries?.map((e) => e.paymentStatus || "cash") || [],
  );
  const [completedEntries, setCompletedEntries] = useState<Set<number>>(
    new Set(),
  );

  const form = useForm<BillFormValues>({
    // @ts-expect-error - Zod union/pipe types don't perfectly match React Hook Form's expected types
    resolver: zodResolver(billFormSchema),
    defaultValues: initialData || {
      entries: [
        {
          workerName: "",
          workingHours: undefined,
          wagePerHour: undefined,
          overtimeHours: undefined,
          overtimeWagePerHour: undefined,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "entries",
  });

  const watchedEntries = form.watch("entries");

  // Update signatures and paymentStatuses arrays when entries change
  useMemo(() => {
    if (watchedEntries.length !== signatures.length) {
      setSignatures(watchedEntries.map((_, idx) => signatures[idx] || ""));
    }
    if (watchedEntries.length !== paymentStatuses.length) {
      setPaymentStatuses(
        watchedEntries.map((_, idx) => paymentStatuses[idx] || "cash"),
      );
    }
  }, [watchedEntries.length]);

  const totalTk = useMemo(() => {
    return watchedEntries.reduce((sum, entry) => {
      const regularPay = (entry.workingHours || 0) * (entry.wagePerHour || 0);
      const overtimePay =
        (entry.overtimeHours || 0) * (entry.overtimeWagePerHour || 0);
      return sum + regularPay + overtimePay;
    }, 0);
  }, [watchedEntries]);

  // Calculate entries with totals for preview
  const previewEntries = useMemo(() => {
    return watchedEntries.map((entry, index) => {
      const regularPay = (entry.workingHours || 0) * (entry.wagePerHour || 0);
      const overtimePay =
        (entry.overtimeHours || 0) * (entry.overtimeWagePerHour || 0);
      return {
        ...entry,
        totalTk: regularPay + overtimePay,
        signature: signatures[index] || "",
        paymentStatus: paymentStatuses[index] || "cash",
      };
    });
  }, [watchedEntries, signatures, paymentStatuses]);

  const addWorkerEntry = () => {
    append({
      workerName: "",
      workingHours: undefined,
      wagePerHour: undefined,
      overtimeHours: undefined,
      overtimeWagePerHour: undefined,
    } as Parameters<typeof append>[0]);
  };

  const handleSave = async () => {
    try {
      // Map entries with their original indices, then filter out invalid ones
      const entriesWithIndices = watchedEntries
        .map((entry, index) => ({ entry, index }))
        .filter(
          ({ entry }) =>
            entry.workerName &&
            typeof entry.workerName === "string" &&
            entry.workerName.trim().length > 0,
        );

      if (entriesWithIndices.length === 0) {
        toast.error("At least one entry with a worker name is required");
        return;
      }

      const entries: IBillEntry[] = entriesWithIndices.map(
        ({ entry, index }) => {
          const regularPay =
            (entry.workingHours || 0) * (entry.wagePerHour || 0);
          const overtimePay =
            (entry.overtimeHours || 0) * (entry.overtimeWagePerHour || 0);
          return {
            workerName: entry.workerName.trim(),
            workingHours: entry.workingHours || 0,
            wagePerHour: entry.wagePerHour || 0,
            overtimeHours: entry.overtimeHours || 0,
            overtimeWagePerHour: entry.overtimeWagePerHour || 0,
            paymentStatus: paymentStatuses[index] || "cash",
            totalTk: regularPay + overtimePay,
            signature: signatures[index] || undefined,
          };
        },
      );

      // Format duration as "DD.MM.YYYY to DD.MM.YYYY"
      const formatDuration = (from: string, to: string) => {
        if (!from || !to) return undefined;
        const formatDate = (dateStr: string) => {
          const [year, month, day] = dateStr.split("-");
          return `${day}.${month}.${year}`;
        };
        return `${formatDate(from)} to ${formatDate(to)}`;
      };

      // Recalculate totalTk from the filtered entries
      const calculatedTotalTk = entries.reduce(
        (sum, entry) => sum + entry.totalTk,
        0,
      );

      const billData = {
        entries,
        notes: notes || undefined,
        preparedBy: preparedBy || undefined,
        checkedBy: checkedBy || undefined,
        approvedBy: approvedBy || undefined,
        signatoryName: signatoryName || "Prodip Kumar Sarker",
        duration: formatDuration(durationFrom, durationTo),
        totalTk: calculatedTotalTk,
      };

      if (billId) {
        await updateBillMutation.mutateAsync({
          id: billId,
          data: billData,
        });
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/bills/${billId}/print`);
        }
      } else {
        const result = await createBillMutation.mutateAsync(billData);
        if (onSuccess) {
          onSuccess();
        } else if (result?._id) {
          router.push(`/bills/${result._id}/print`);
        } else {
          router.push("/bills");
        }
      }
    } catch (error) {
      console.error("Error saving bill:", error);
    }
  };

  const handlePrint = () => {
    // Create a temporary print view
    window.print();
  };

  return (
    <Card className="mx-auto w-full max-w-6xl print:border-0 print:shadow-none">
      <CardHeader className="print:hidden">
        <CardTitle className="text-2xl">
          {billId ? "Edit Bill" : "Create New Bill"}
        </CardTitle>
      </CardHeader>
      <CardContent className="print:p-0">
        <Form {...form}>
          <form className="space-y-6 print:hidden">
            <div className="flex flex-col gap-2 md:flex-row">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Duration From (Optional)
                </label>
                <Input
                  type="date"
                  value={durationFrom}
                  onChange={(e) => setDurationFrom(e.target.value)}
                  className="min-h-[44px]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Duration To (Optional)
                </label>
                <Input
                  type="date"
                  value={durationTo}
                  onChange={(e) => setDurationTo(e.target.value)}
                  className="min-h-[44px]"
                  min={durationFrom || undefined}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Bill Date</label>
              <Input
                type="date"
                value={billDate}
                onChange={(e) => setBillDate(e.target.value)}
                className="min-h-[44px]"
              />
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="mb-4 text-lg font-semibold">Worker Entries</h3>
              </div>

              <div className="space-y-4">
                {fields.map((field, index) => {
                  const entryTotal =
                    (watchedEntries[index]?.workingHours || 0) *
                      (watchedEntries[index]?.wagePerHour || 0) +
                    (watchedEntries[index]?.overtimeHours || 0) *
                      (watchedEntries[index]?.overtimeWagePerHour || 0);

                  return (
                    <Card key={field.id} className="p-4">
                      <div className="mb-4">
                        <h4 className="font-medium">Worker {index + 1}</h4>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FormField
                          // @ts-expect-error - Type mismatch due to Zod union/pipe schema
                          control={form.control}
                          name={`entries.${index}.workerName`}
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>Worker Name</FormLabel>
                              <FormControl>
                                <WorkerCombobox
                                  value={field.value}
                                  onValueChange={field.onChange}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          // @ts-expect-error - Type mismatch due to Zod union/pipe schema
                          control={form.control}
                          name={`entries.${index}.workingHours`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Working Hours</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.5"
                                  {...field}
                                  value={field.value ?? ""}
                                  onChange={(e) =>
                                    field.onChange(
                                      e.target.value === ""
                                        ? undefined
                                        : e.target.value,
                                    )
                                  }
                                  className="min-h-[44px] text-lg"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          // @ts-expect-error - Type mismatch due to Zod union/pipe schema
                          control={form.control}
                          name={`entries.${index}.wagePerHour`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Wage Per Hour (Tk)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.01"
                                  {...field}
                                  value={field.value ?? ""}
                                  onChange={(e) =>
                                    field.onChange(
                                      e.target.value === ""
                                        ? undefined
                                        : e.target.value,
                                    )
                                  }
                                  className="min-h-[44px] text-lg"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          // @ts-expect-error - Type mismatch due to Zod union/pipe schema
                          control={form.control}
                          name={`entries.${index}.overtimeHours`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Overtime (Hours)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.5"
                                  {...field}
                                  value={field.value ?? ""}
                                  onChange={(e) =>
                                    field.onChange(
                                      e.target.value === ""
                                        ? undefined
                                        : e.target.value,
                                    )
                                  }
                                  className="min-h-[44px] text-lg"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          // @ts-expect-error - Type mismatch due to Zod union/pipe schema
                          control={form.control}
                          name={`entries.${index}.overtimeWagePerHour`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Overtime Wage Per Hour (Tk)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.01"
                                  {...field}
                                  value={field.value ?? ""}
                                  onChange={(e) =>
                                    field.onChange(
                                      e.target.value === ""
                                        ? undefined
                                        : e.target.value,
                                    )
                                  }
                                  className="min-h-[44px] text-lg"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="bg-muted rounded-lg p-3 md:col-span-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Entry Total:</span>
                            <span className="text-lg font-bold">
                              {entryTotal.toLocaleString("en-BD")} Tk
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Reminder for dirty fields */}
                      {(() => {
                        const entryDirtyFields =
                          form.formState.dirtyFields.entries?.[index];
                        const hasDirtyFields =
                          entryDirtyFields &&
                          Object.keys(entryDirtyFields).length > 0;
                        const hasValidWorkerName =
                          watchedEntries[index]?.workerName &&
                          typeof watchedEntries[index]?.workerName ===
                            "string" &&
                          watchedEntries[index]?.workerName.trim().length > 0;
                        const isNotCompleted = !completedEntries.has(index);

                        if (
                          hasDirtyFields &&
                          hasValidWorkerName &&
                          isNotCompleted
                        ) {
                          return (
                            <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                              <p className="text-sm font-medium text-yellow-800">
                                ⚠️ Don&apos;t forget to click &quot;Add to
                                Bill&quot; to save this entry!
                              </p>
                            </div>
                          );
                        }
                        return null;
                      })()}

                      {/* Action buttons at the bottom */}
                      <div className="mt-4 flex justify-between gap-2 border-t pt-4">
                        <Button
                          type="button"
                          onClick={() => {
                            const newCompleted = new Set(completedEntries);
                            if (completedEntries.has(index)) {
                              newCompleted.delete(index);
                            } else {
                              newCompleted.add(index);
                              // Automatically add a new worker entry when marked as done
                              addWorkerEntry();
                            }
                            setCompletedEntries(newCompleted);
                          }}
                          variant={
                            completedEntries.has(index) ? "ghost" : "default"
                          }
                          className="min-h-[44px] flex-1"
                          disabled={
                            !watchedEntries[index]?.workerName ||
                            (typeof watchedEntries[index]?.workerName ===
                              "string" &&
                              watchedEntries[index]?.workerName.trim()
                                .length === 0)
                          }
                        >
                          {completedEntries.has(index) ? (
                            <div className="flex items-center">
                              <Check className="mr-2 h-4 w-4" />
                              Inserted
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <Plus className="mr-2 h-4 w-4" />
                              Add to Bill
                            </div>
                          )}
                        </Button>
                        {/* <Button
                          type="button"
                          onClick={addWorkerEntry}
                          variant="default"
                          className="min-h-[44px]"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Worker
                        </Button> */}
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              const newCompleted = new Set(completedEntries);
                              newCompleted.delete(index);
                              setCompletedEntries(newCompleted);
                              remove(index);
                            }}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            size="lg"
                          >
                            <Trash2 className="h-4 w-4" />
                            Remove entry
                          </Button>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            <div className="bg-primary/10 border-primary rounded-lg border-2 p-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Grand Total (Tk):</span>
                <span className="text-2xl font-bold">
                  {totalTk.toLocaleString("en-BD")}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/bills")}
                className="min-h-[44px] min-w-[100px]"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>

        {/* Live Preview */}
        {(() => {
          // Show preview if there's at least one entry with a worker name
          const validEntries = previewEntries.filter(
            (e) =>
              e.workerName &&
              typeof e.workerName === "string" &&
              e.workerName.trim().length > 0,
          );
          return validEntries.length > 0 ? (
            <div className="mt-8">
              <BillPreview
                entries={validEntries.map((entry) => ({
                  ...entry,
                  workingHours: entry.workingHours || 0,
                  wagePerHour: entry.wagePerHour || 0,
                  overtimeHours: entry.overtimeHours || 0,
                  overtimeWagePerHour: entry.overtimeWagePerHour || 0,
                }))}
                totalTk={totalTk}
                notes={notes}
                preparedBy={preparedBy}
                checkedBy={checkedBy}
                approvedBy={approvedBy}
                signatoryName={signatoryName}
                duration={
                  durationFrom && durationTo
                    ? (() => {
                        const formatDate = (dateStr: string) => {
                          const [year, month, day] = dateStr.split("-");
                          return `${day.padStart(2, "0")}.${month.padStart(2, "0")}.${year}`;
                        };
                        return `${formatDate(durationFrom)} to ${formatDate(durationTo)}`;
                      })()
                    : undefined
                }
                billDate={billDate}
                onNotesChange={setNotes}
                onPreparedByChange={setPreparedBy}
                onCheckedByChange={setCheckedBy}
                onApprovedByChange={setApprovedBy}
                onSignatoryNameChange={setSignatoryName}
                onSignatureChange={(index, signature) => {
                  const newSigs = [...signatures];
                  // Find the entry in validEntries at this index
                  const entry = validEntries[index];
                  if (entry) {
                    // Find the original index in watchedEntries
                    const originalIndex = watchedEntries.findIndex(
                      (e) => e.workerName === entry.workerName,
                    );
                    if (originalIndex >= 0) {
                      newSigs[originalIndex] = signature;
                      setSignatures(newSigs);
                    } else {
                      // Fallback: use the index directly if we can't find it
                      newSigs[index] = signature;
                      setSignatures(newSigs);
                    }
                  }
                }}
                onPaymentStatusChange={(index, paymentStatus) => {
                  const newStatuses = [...paymentStatuses];
                  // Find the entry in validEntries at this index
                  const entry = validEntries[index];
                  if (entry) {
                    // Find the original index in watchedEntries
                    const originalIndex = watchedEntries.findIndex(
                      (e) => e.workerName === entry.workerName,
                    );
                    if (originalIndex >= 0) {
                      newStatuses[originalIndex] = paymentStatus;
                      setPaymentStatuses(newStatuses);
                    } else {
                      // Fallback: use the index directly if we can't find it
                      newStatuses[index] = paymentStatus;
                      setPaymentStatuses(newStatuses);
                    }
                  }
                }}
                onPrint={handlePrint}
                onSave={handleSave}
                isSaving={
                  createBillMutation.isPending || updateBillMutation.isPending
                }
              />
            </div>
          ) : null;
        })()}
      </CardContent>
    </Card>
  );
}
