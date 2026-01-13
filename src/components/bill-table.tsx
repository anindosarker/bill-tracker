"use client";

import { IBillEntry } from "@/backend/models/bill.model";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Edit2, X } from "lucide-react";
import { useState } from "react";

interface BillTableProps {
  entries: IBillEntry[];
  totalTk: number;
  onSignatureChange?: (index: number, signature: string) => void;
  onPaymentStatusChange?: (index: number, paymentStatus: string) => void;
}

export function BillTable({
  entries,
  totalTk,
  onSignatureChange,
  onPaymentStatusChange,
}: BillTableProps) {
  const [editingSignatures, setEditingSignatures] = useState<Set<number>>(
    new Set(),
  );
  const [editingPaymentStatuses, setEditingPaymentStatuses] = useState<
    Set<number>
  >(new Set());
  const [localSignatures, setLocalSignatures] = useState<string[]>(() =>
    entries.map((e) => e.signature || ""),
  );
  const [localPaymentStatuses, setLocalPaymentStatuses] = useState<string[]>(
    () => entries.map((e) => e.paymentStatus || "cash"),
  );
  const [prevEntriesLength, setPrevEntriesLength] = useState(entries.length);

  // Adjust state during render when entries change (React-recommended pattern)
  if (entries.length !== prevEntriesLength) {
    setPrevEntriesLength(entries.length);
    setLocalSignatures(entries.map((e) => e.signature || ""));
    setLocalPaymentStatuses(entries.map((e) => e.paymentStatus || "cash"));
  }

  const handleSaveSignature = (index: number) => {
    if (onSignatureChange)
      onSignatureChange(index, localSignatures[index] || "");
    const newEditing = new Set(editingSignatures);
    newEditing.delete(index);
    setEditingSignatures(newEditing);
  };

  const handleCancelSignature = (index: number) => {
    const originalSig = entries[index]?.signature || "";
    const newSigs = [...localSignatures];
    newSigs[index] = originalSig;
    setLocalSignatures(newSigs);
    const newEditing = new Set(editingSignatures);
    newEditing.delete(index);
    setEditingSignatures(newEditing);
  };

  const handleSavePaymentStatus = (index: number) => {
    if (onPaymentStatusChange)
      onPaymentStatusChange(index, localPaymentStatuses[index] || "cash");
    const newEditing = new Set(editingPaymentStatuses);
    newEditing.delete(index);
    setEditingPaymentStatuses(newEditing);
  };

  const handleCancelPaymentStatus = (index: number) => {
    const originalStatus = entries[index]?.paymentStatus || "cash";
    const newStatuses = [...localPaymentStatuses];
    newStatuses[index] = originalStatus;
    setLocalPaymentStatuses(newStatuses);
    const newEditing = new Set(editingPaymentStatuses);
    newEditing.delete(index);
    setEditingPaymentStatuses(newEditing);
  };

  return (
    <table
      className="w-full border-collapse border border-black"
      style={{ fontFamily: "Times New Roman" }}
    >
      <thead>
        <tr>
          <th className="border border-black p-2 text-center text-sm font-bold">
            Sl.No.
          </th>
          <th className="border border-black p-2 text-center text-sm font-bold">
            Worker Name
          </th>
          <th className="border border-black p-2 text-center text-sm font-bold">
            Working Hour
          </th>
          <th className="border border-black p-2 text-center text-sm font-bold">
            Wages per Hour (Tk)
          </th>
          <th className="border border-black p-2 text-center text-sm font-bold">
            Over time (Hour)
          </th>
          <th className="border border-black p-2 text-center text-sm font-bold">
            Over time per Hour (Tk)
          </th>
          <th className="border border-black p-2 text-center text-sm font-bold">
            Payment status
          </th>
          <th className="border border-black p-2 text-center text-sm font-bold">
            Total tk.
          </th>
          <th className="border border-black p-2 text-center text-sm font-bold">
            Signature
          </th>
        </tr>
      </thead>
      <tbody>
        {entries.map((entry, index) => (
          <tr key={index}>
            <td className="border border-black p-2 text-center">{index + 1}</td>
            <td className="border border-black p-2 text-left">
              {entry.workerName}
            </td>
            <td className="border border-black p-2 text-center">
              {entry.workingHours}
            </td>
            <td className="border border-black p-2 text-center">
              {entry.wagePerHour}
            </td>
            <td className="border border-black p-2 text-center">
              {entry.overtimeHours}
            </td>
            <td className="border border-black p-2 text-center">
              {entry.overtimeWagePerHour}
            </td>
            <td className="border border-black p-2">
              <div className="flex items-center justify-center gap-1">
                {editingPaymentStatuses.has(index) ? (
                  <>
                    <select
                      value={localPaymentStatuses[index] || "cash"}
                      onChange={(e) => {
                        const newStatuses = [...localPaymentStatuses];
                        newStatuses[index] = e.target.value;
                        setLocalPaymentStatuses(newStatuses);
                      }}
                      className="h-8 flex-1 border-0 text-xs focus-visible:ring-1"
                      autoFocus
                    >
                      <option value="cash">Cash</option>
                      <option value="bank">Bank</option>
                      <option value="pending">Pending</option>
                    </select>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 rounded-full bg-green-100 hover:bg-green-200"
                      onClick={() => handleSavePaymentStatus(index)}
                    >
                      <Check className="h-3 w-3 text-green-600" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 rounded-full bg-red-100 hover:bg-red-200"
                      onClick={() => handleCancelPaymentStatus(index)}
                    >
                      <X className="h-3 w-3 text-red-600" />
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="block min-h-[20px]">
                      {localPaymentStatuses[index] || "cash"}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="bg-muted hover:bg-muted/80 h-6 w-6 rounded-full"
                      onClick={() => {
                        const newEditing = new Set(editingPaymentStatuses);
                        newEditing.add(index);
                        setEditingPaymentStatuses(newEditing);
                      }}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                  </>
                )}
              </div>
            </td>
            <td className="border border-black p-2 text-center">
              {entry.totalTk.toLocaleString("en-BD")}
            </td>
            <td className="border border-black p-2">
              <div className="flex items-center gap-1">
                {editingSignatures.has(index) ? (
                  <>
                    <Input
                      value={localSignatures[index] || ""}
                      onChange={(e) => {
                        const newSigs = [...localSignatures];
                        newSigs[index] = e.target.value;
                        setLocalSignatures(newSigs);
                      }}
                      placeholder="Signature"
                      className="h-8 flex-1 border-0 text-xs focus-visible:ring-1"
                      autoFocus
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 rounded-full bg-green-100 hover:bg-green-200"
                      onClick={() => handleSaveSignature(index)}
                    >
                      <Check className="h-3 w-3 text-green-600" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 rounded-full bg-red-100 hover:bg-red-200"
                      onClick={() => handleCancelSignature(index)}
                    >
                      <X className="h-3 w-3 text-red-600" />
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="block min-h-[20px] flex-1">
                      {localSignatures[index] || ""}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="bg-muted hover:bg-muted/80 h-6 w-6 rounded-full"
                      onClick={() => {
                        const newEditing = new Set(editingSignatures);
                        newEditing.add(index);
                        setEditingSignatures(newEditing);
                      }}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                  </>
                )}
              </div>
            </td>
          </tr>
        ))}
        {/* Total Row */}
        <tr>
          <td className="border border-black p-2"></td>
          <td className="border border-black p-2 font-bold" colSpan={6}>
            Total
          </td>
          <td className="border border-black p-2 text-center font-bold">
            {totalTk.toLocaleString("en-BD")}
          </td>
          <td className="border border-black p-2"></td>
        </tr>
      </tbody>
    </table>
  );
}
