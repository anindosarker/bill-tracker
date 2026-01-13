"use client";

import { InlineEditableField } from "@/components/inline-editable-field";

interface BillNotesProps {
  notes: string;
  onNotesChange?: (notes: string) => void;
}

export function BillNotes({ notes, onNotesChange }: BillNotesProps) {
  if (!onNotesChange) {
    return notes ? (
      <div>
        <p className="text-sm" style={{ fontFamily: "Arial" }}>
          {notes}
        </p>
      </div>
    ) : null;
  }

  return (
    <div>
      <InlineEditableField
        value={notes}
        onSave={onNotesChange}
        placeholder="Add notes (optional)"
        multiline
        className="items-start"
        displayClassName="text-sm"
        inputClassName="min-h-[60px] text-sm"
        showLabel={false}
      />
    </div>
  );
}
