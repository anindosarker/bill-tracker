"use client";

import { InlineEditableField } from "@/components/inline-editable-field";

interface BillFooterProps {
  preparedBy?: string;
  checkedBy?: string;
  approvedBy?: string;
  signatoryName?: string;
  onPreparedByChange?: (name: string) => void;
  onCheckedByChange?: (name: string) => void;
  onApprovedByChange?: (name: string) => void;
  onSignatoryNameChange?: (name: string) => void;
}

export function BillFooter({
  preparedBy = "",
  checkedBy = "",
  approvedBy = "",
  signatoryName = "Prodip Kumar Sarker",
  onPreparedByChange,
  onCheckedByChange,
  onApprovedByChange,
  onSignatoryNameChange,
}: BillFooterProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm">
        {/* Left: Prepared by */}
        <div className="flex flex-col">
          {onPreparedByChange ? (
            <InlineEditableField
              value={preparedBy}
              onSave={onPreparedByChange}
              placeholder="Name"
              displayValue={preparedBy ? `(${preparedBy})` : undefined}
              className="mb-1 items-start"
              displayClassName="text-sm"
              inputClassName="h-8 text-xs"
            />
          ) : (
            <p className="mb-1 text-sm" style={{ fontFamily: "Arial" }}>
              {preparedBy ? `(${preparedBy})` : ""}
            </p>
          )}
          <div className="mb-1 w-32 border-t border-black"></div>
          <p className="text-sm" style={{ fontFamily: "Times New Roman" }}>
            Prepared by
          </p>
        </div>

        {/* Right: Company info */}
        <div className="flex flex-col items-end">
          {onSignatoryNameChange ? (
            <div className="mb-1 min-w-[180px]">
              <InlineEditableField
                value={signatoryName}
                onSave={onSignatoryNameChange}
                placeholder="Name"
                displayValue={signatoryName ? signatoryName : undefined}
                className="items-start"
                displayClassName="text-sm text-right whitespace-nowrap"
                inputClassName="h-8 text-xs min-w-[180px]"
              />
            </div>
          ) : (
            <p
              className="mb-1 min-w-[180px] text-right text-sm whitespace-nowrap"
              style={{ fontFamily: "Arial" }}
            >
              {signatoryName ? `(${signatoryName})` : ""}
            </p>
          )}
          <div className="mb-1 min-w-[180px] border-t border-black"></div>
          <p className="mt-1 text-sm" style={{ fontFamily: "Arial" }}>
            For, Independent Agriscience Factory
          </p>
          <p className="mt-1 text-sm" style={{ fontFamily: "Times New Roman" }}>
            Bogura
          </p>
        </div>
      </div>

      {/* Checked by and Approved by */}
      <div className="flex justify-center gap-8 text-sm">
        {/* Checked by */}
        <div className="flex flex-col">
          {onCheckedByChange ? (
            <InlineEditableField
              value={checkedBy}
              onSave={onCheckedByChange}
              placeholder="Name"
              className="mb-1 items-start"
              displayClassName="text-sm min-h-[20px]"
              inputClassName="h-8 w-32 text-xs"
            />
          ) : (
            <p className="mb-1 text-sm" style={{ fontFamily: "Arial" }}>
              {checkedBy || ""}
            </p>
          )}
          <div className="mb-1 w-32 border-t border-black"></div>
          <p className="text-sm" style={{ fontFamily: "Arial" }}>
            Checked by:
          </p>
        </div>

        {/* Approved by */}
        <div className="flex flex-col">
          {onApprovedByChange ? (
            <InlineEditableField
              value={approvedBy}
              onSave={onApprovedByChange}
              placeholder="Name"
              className="mb-1 items-start"
              displayClassName="text-sm min-h-[20px]"
              inputClassName="h-8 w-32 text-xs"
            />
          ) : (
            <p className="mb-1 text-sm" style={{ fontFamily: "Arial" }}>
              {approvedBy || ""}
            </p>
          )}
          <div className="mb-1 w-32 border-t border-black"></div>
          <p className="text-sm" style={{ fontFamily: "Arial" }}>
            Approved by:
          </p>
        </div>
      </div>
    </div>
  );
}
