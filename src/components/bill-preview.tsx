"use client";

import { IBillEntry } from "@/backend/models/bill.model";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Check, Edit2, Printer, Save, X } from "lucide-react";
import { useEffect, useState } from "react";

interface BillPreviewProps {
  entries: IBillEntry[];
  totalTk: number;
  notes?: string;
  preparedBy?: string;
  checkedBy?: string;
  approvedBy?: string;
  onNotesChange?: (notes: string) => void;
  onPreparedByChange?: (name: string) => void;
  onCheckedByChange?: (name: string) => void;
  onApprovedByChange?: (name: string) => void;
  onSignatureChange?: (index: number, signature: string) => void;
  onPaymentStatusChange?: (index: number, paymentStatus: string) => void;
  onPrint?: () => void;
  onSave?: () => void;
  isSaving?: boolean;
}

export function BillPreview({
  entries,
  totalTk,
  notes = "",
  preparedBy = "",
  checkedBy = "",
  approvedBy = "",
  onNotesChange,
  onPreparedByChange,
  onCheckedByChange,
  onApprovedByChange,
  onSignatureChange,
  onPaymentStatusChange,
  onPrint,
  onSave,
  isSaving = false,
}: BillPreviewProps) {
  // Individual edit states for each field
  const [editingNotes, setEditingNotes] = useState(false);
  const [editingPreparedBy, setEditingPreparedBy] = useState(false);
  const [editingCheckedBy, setEditingCheckedBy] = useState(false);
  const [editingApprovedBy, setEditingApprovedBy] = useState(false);
  const [editingSignatures, setEditingSignatures] = useState<Set<number>>(
    new Set(),
  );
  const [editingPaymentStatuses, setEditingPaymentStatuses] = useState<
    Set<number>
  >(new Set());

  // Local state for each field
  const [localNotes, setLocalNotes] = useState(notes);
  const [localPreparedBy, setLocalPreparedBy] = useState(preparedBy);
  const [localCheckedBy, setLocalCheckedBy] = useState(checkedBy);
  const [localApprovedBy, setLocalApprovedBy] = useState(approvedBy);
  const [localSignatures, setLocalSignatures] = useState<string[]>(
    entries.map((e) => e.signature || ""),
  );
  const [localPaymentStatuses, setLocalPaymentStatuses] = useState<string[]>(
    entries.map((e) => e.paymentStatus || "cash"),
  );

  // Update local state when props change
  useEffect(() => {
    setLocalNotes(notes);
  }, [notes]);
  useEffect(() => {
    setLocalPreparedBy(preparedBy);
  }, [preparedBy]);
  useEffect(() => {
    setLocalCheckedBy(checkedBy);
  }, [checkedBy]);
  useEffect(() => {
    setLocalApprovedBy(approvedBy);
  }, [approvedBy]);
  useEffect(() => {
    setLocalSignatures(entries.map((e) => e.signature || ""));
  }, [entries]);
  useEffect(() => {
    setLocalPaymentStatuses(entries.map((e) => e.paymentStatus || "cash"));
  }, [entries]);

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  // Save all pending changes and the bill
  const handleSaveBill = () => {
    // Save all individual field changes
    if (onNotesChange) onNotesChange(localNotes);
    if (onPreparedByChange) onPreparedByChange(localPreparedBy);
    if (onCheckedByChange) onCheckedByChange(localCheckedBy);
    if (onApprovedByChange) onApprovedByChange(localApprovedBy);
    localSignatures.forEach((sig, idx) => {
      if (onSignatureChange) onSignatureChange(idx, sig);
    });
    // Save the bill
    if (onSave) onSave();
  };

  // Individual field save handlers
  const handleSaveNotes = () => {
    if (onNotesChange) onNotesChange(localNotes);
    setEditingNotes(false);
  };

  const handleCancelNotes = () => {
    setLocalNotes(notes);
    setEditingNotes(false);
  };

  const handleSavePreparedBy = () => {
    if (onPreparedByChange) onPreparedByChange(localPreparedBy);
    setEditingPreparedBy(false);
  };

  const handleCancelPreparedBy = () => {
    setLocalPreparedBy(preparedBy);
    setEditingPreparedBy(false);
  };

  const handleSaveCheckedBy = () => {
    if (onCheckedByChange) onCheckedByChange(localCheckedBy);
    setEditingCheckedBy(false);
  };

  const handleCancelCheckedBy = () => {
    setLocalCheckedBy(checkedBy);
    setEditingCheckedBy(false);
  };

  const handleSaveApprovedBy = () => {
    if (onApprovedByChange) onApprovedByChange(localApprovedBy);
    setEditingApprovedBy(false);
  };

  const handleCancelApprovedBy = () => {
    setLocalApprovedBy(approvedBy);
    setEditingApprovedBy(false);
  };

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

  // Convert number to words
  const numberToWords = (num: number): string => {
    const ones = [
      "",
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine",
    ];
    const tens = [
      "",
      "",
      "twenty",
      "thirty",
      "forty",
      "fifty",
      "sixty",
      "seventy",
      "eighty",
      "ninety",
    ];
    const teens = [
      "ten",
      "eleven",
      "twelve",
      "thirteen",
      "fourteen",
      "fifteen",
      "sixteen",
      "seventeen",
      "eighteen",
      "nineteen",
    ];

    if (num === 0) return "zero";
    if (num < 10) return ones[num];
    if (num < 20) return teens[num - 10];
    if (num < 100)
      return (
        tens[Math.floor(num / 10)] +
        (num % 10 !== 0 ? " " + ones[num % 10] : "")
      );
    if (num < 1000)
      return (
        ones[Math.floor(num / 100)] +
        " hundred" +
        (num % 100 !== 0 ? " " + numberToWords(num % 100) : "")
      );
    if (num < 100000)
      return (
        numberToWords(Math.floor(num / 1000)) +
        " thousand" +
        (num % 1000 !== 0 ? " " + numberToWords(num % 1000) : "")
      );
    if (num < 10000000)
      return (
        numberToWords(Math.floor(num / 100000)) +
        " lakh" +
        (num % 100000 !== 0 ? " " + numberToWords(num % 100000) : "")
      );
    return (
      numberToWords(Math.floor(num / 10000000)) +
      " crore" +
      (num % 10000000 !== 0 ? " " + numberToWords(num % 10000000) : "")
    );
  };

  const amountInWords = numberToWords(Math.floor(totalTk));

  return (
    <div
      className="border-primary/20 rounded-lg border-2 bg-white p-6"
      data-bill-preview
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold">Bill Preview</h3>
        <div className="flex gap-2">
          {onSave && (
            <Button
              variant="default"
              size="sm"
              onClick={handleSaveBill}
              disabled={isSaving}
              className="min-h-[44px]"
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Saving..." : "Save Bill"}
            </Button>
          )}
          <Button
            variant="default"
            size="sm"
            onClick={handlePrint}
            className="min-h-[44px]"
          >
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1
            className="mb-2 text-2xl font-bold"
            style={{ fontFamily: "Times New Roman" }}
          >
            INDEPENDENT AGRISCIENCE FACTORY
          </h1>
          <h2
            className="mb-1 text-lg font-semibold"
            style={{ fontFamily: "Times New Roman" }}
          >
            RANIRHAT, SAHJAHANPUR, BOGURA
          </h2>
          <p className="text-sm" style={{ fontFamily: "Times New Roman" }}>
            (WORKER WAGES Payment Sheet)
          </p>
        </div>

        {/* Date */}
        <div className="mb-2 flex justify-end">
          <p className="text-sm" style={{ fontFamily: "Times New Roman" }}>
            {format(new Date(), "dd/MM/yyyy")}
          </p>
        </div>

        {/* Table */}
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
                <td className="border border-black p-2 text-center">
                  {index + 1}
                </td>
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

        {/* Notes Section - Above border */}
        <div>
          <div className="flex items-start gap-2">
            {editingNotes ? (
              <>
                <Textarea
                  value={localNotes}
                  onChange={(e) => setLocalNotes(e.target.value)}
                  placeholder="Add notes (optional)"
                  className="min-h-[60px] flex-1 text-sm"
                  style={{ fontFamily: "Arial" }}
                  autoFocus
                />
                <div className="flex flex-col gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-green-100 hover:bg-green-200"
                    onClick={handleSaveNotes}
                  >
                    <Check className="h-4 w-4 text-green-600" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-red-100 hover:bg-red-200"
                    onClick={handleCancelNotes}
                  >
                    <X className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="flex-1 text-sm" style={{ fontFamily: "Arial" }}>
                  {localNotes || ""}
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="bg-muted hover:bg-muted/80 h-8 w-8 rounded-full"
                  onClick={() => setEditingNotes(true)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Border line after notes */}
        <div className="my-2 border-t border-black"></div>

        {/* In Words */}
        <div>
          <p className="text-sm" style={{ fontFamily: "Times New Roman" }}>
            <strong>In Words:</strong> {amountInWords} taka only
          </p>
        </div>

        {/* Footer */}
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <div className="flex items-start gap-2">
              <div className="flex-1">
                {editingPreparedBy ? (
                  <Input
                    value={localPreparedBy}
                    onChange={(e) => setLocalPreparedBy(e.target.value)}
                    placeholder="Name"
                    className="h-8 text-xs"
                    style={{ fontFamily: "Arial" }}
                    autoFocus
                  />
                ) : (
                  <p style={{ fontFamily: "Arial" }}>
                    {localPreparedBy ? `(${localPreparedBy})` : ""}
                  </p>
                )}
                {!editingPreparedBy ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="bg-muted hover:bg-muted/80 h-6 w-6 rounded-full"
                    onClick={() => setEditingPreparedBy(true)}
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                ) : (
                  <div className="mt-1 flex flex-col gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 rounded-full bg-green-100 hover:bg-green-200"
                      onClick={handleSavePreparedBy}
                    >
                      <Check className="h-3 w-3 text-green-600" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 rounded-full bg-red-100 hover:bg-red-200"
                      onClick={handleCancelPreparedBy}
                    >
                      <X className="h-3 w-3 text-red-600" />
                    </Button>
                  </div>
                )}
                <div className="mb-1 w-32 border-t border-black"></div>
                <p style={{ fontFamily: "Times New Roman" }}>Prepared by</p>
              </div>
            </div>

            <div className="text-right">
              {/* Line above Signature field */}
              <div className="mb-1 ml-auto w-40 border-t border-black"></div>
              <p style={{ fontFamily: "Arial" }}>(Prodip Kumar Sarker)</p>
              <p className="mt-1" style={{ fontFamily: "Arial" }}>
                For, Independent Agriscience Factory
              </p>
              <p className="mt-1" style={{ fontFamily: "Times New Roman" }}>
                Bogura
              </p>
            </div>
          </div>

          <div className="flex justify-center gap-8 text-sm">
            <div className="flex items-start gap-2">
              <div>
                {/* Line above Checked by */}
                <div className="mb-1 w-32 border-t border-black"></div>
                <p style={{ fontFamily: "Arial" }}>Checked by:</p>
                {editingCheckedBy ? (
                  <Input
                    value={localCheckedBy}
                    onChange={(e) => setLocalCheckedBy(e.target.value)}
                    placeholder="Name"
                    className="mt-1 h-8 w-32 text-xs"
                    style={{ fontFamily: "Arial" }}
                    autoFocus
                  />
                ) : (
                  <p style={{ fontFamily: "Arial" }}>{localCheckedBy || ""}</p>
                )}
              </div>
              {!editingCheckedBy ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="bg-muted hover:bg-muted/80 mt-1 h-6 w-6 rounded-full"
                  onClick={() => setEditingCheckedBy(true)}
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
              ) : (
                <div className="mt-1 flex flex-col gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full bg-green-100 hover:bg-green-200"
                    onClick={handleSaveCheckedBy}
                  >
                    <Check className="h-3 w-3 text-green-600" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full bg-red-100 hover:bg-red-200"
                    onClick={handleCancelCheckedBy}
                  >
                    <X className="h-3 w-3 text-red-600" />
                  </Button>
                </div>
              )}
            </div>
            <div className="flex items-start gap-2">
              <div>
                {/* Line above Approved by */}
                <div className="mb-1 w-32 border-t border-black"></div>
                <p style={{ fontFamily: "Arial" }}>Approved by:</p>
                {editingApprovedBy ? (
                  <Input
                    value={localApprovedBy}
                    onChange={(e) => setLocalApprovedBy(e.target.value)}
                    placeholder="Name"
                    className="mt-1 h-8 w-32 text-xs"
                    style={{ fontFamily: "Arial" }}
                    autoFocus
                  />
                ) : (
                  <p style={{ fontFamily: "Arial" }}>{localApprovedBy || ""}</p>
                )}
              </div>
              {!editingApprovedBy ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="bg-muted hover:bg-muted/80 mt-1 h-6 w-6 rounded-full"
                  onClick={() => setEditingApprovedBy(true)}
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
              ) : (
                <div className="mt-1 flex flex-col gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full bg-green-100 hover:bg-green-200"
                    onClick={handleSaveApprovedBy}
                  >
                    <Check className="h-3 w-3 text-green-600" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full bg-red-100 hover:bg-red-200"
                    onClick={handleCancelApprovedBy}
                  >
                    <X className="h-3 w-3 text-red-600" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
