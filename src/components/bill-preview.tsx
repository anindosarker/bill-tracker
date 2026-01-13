"use client";

import { IBillEntry } from "@/backend/models/bill.model";
import { BillFooter } from "@/components/bill-footer";
import { BillHeader } from "@/components/bill-header";
import { BillNotes } from "@/components/bill-notes";
import { BillTable } from "@/components/bill-table";
import { Button } from "@/components/ui/button";
import { numberToWords } from "@/lib/utils";
import { Printer, Save } from "lucide-react";

interface BillPreviewProps {
  entries: IBillEntry[];
  totalTk: number;
  notes?: string;
  preparedBy?: string;
  checkedBy?: string;
  approvedBy?: string;
  signatoryName?: string;
  onNotesChange?: (notes: string) => void;
  onPreparedByChange?: (name: string) => void;
  onCheckedByChange?: (name: string) => void;
  onApprovedByChange?: (name: string) => void;
  onSignatoryNameChange?: (name: string) => void;
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
  signatoryName = "Prodip Kumar Sarker",
  onNotesChange,
  onPreparedByChange,
  onCheckedByChange,
  onApprovedByChange,
  onSignatoryNameChange,
  onSignatureChange,
  onPaymentStatusChange,
  onPrint,
  onSave,
  isSaving = false,
}: BillPreviewProps) {
  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  // Save all pending changes and the bill
  const handleSaveBill = () => {
    // Save the bill
    if (onSave) onSave();
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
        <BillHeader />

        <BillTable
          entries={entries}
          totalTk={totalTk}
          onSignatureChange={onSignatureChange}
          onPaymentStatusChange={onPaymentStatusChange}
        />

        <BillNotes notes={notes} onNotesChange={onNotesChange} />

        {/* Border line after notes */}
        <div className="my-2 border-t border-black"></div>

        {/* In Words */}
        <div>
          <p className="text-sm" style={{ fontFamily: "Times New Roman" }}>
            <strong>In Words:</strong> {amountInWords} taka only
          </p>
        </div>

        <BillFooter
          preparedBy={preparedBy}
          checkedBy={checkedBy}
          approvedBy={approvedBy}
          signatoryName={signatoryName}
          onPreparedByChange={onPreparedByChange}
          onCheckedByChange={onCheckedByChange}
          onApprovedByChange={onApprovedByChange}
          onSignatoryNameChange={onSignatoryNameChange}
        />
      </div>
    </div>
  );
}
