"use client";

import type { IBill, IBillVersion } from "@/types/bill.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { numberToWords } from "@/lib/utils";
import { BillHeader } from "@/components/bill-header";

interface BillVersionDisplayProps {
  bill: IBill;
}

function VersionDetails({ version, index }: { version: IBillVersion; index: number }) {
  const [isExpanded, setIsExpanded] = useState(index === 0);
  const amountInWords = numberToWords(Math.floor(version.totalTk));

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
      <CollapsibleTrigger className="w-full">
        <div className="bg-muted p-4 rounded-lg space-y-2 hover:bg-muted/80 transition-colors">
          <div className="flex items-center justify-between">
            <div className="text-left">
              <p className="text-sm font-semibold">
                Version {index + 1}
              </p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(version.updatedAt), "PPp")}
              </p>
            </div>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm pt-2 border-t">
            <div>
              <p className="text-muted-foreground">Workers</p>
              <p className="font-semibold">{version.entries.length}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Total</p>
              <p className="font-semibold">
                {version.totalTk.toLocaleString("en-BD")} Tk
              </p>
            </div>
          </div>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-4">
        <div className="bg-muted/50 p-4 rounded-lg space-y-4 border border-border">
          {/* Header */}
          <BillHeader
            date={new Date(version.updatedAt)}
            duration={version.duration}
          />

          {/* Table */}
          <div className="overflow-x-auto">
            <table
              className="w-full border-collapse border border-black text-xs"
              style={{ fontFamily: "Times New Roman" }}
            >
              <thead>
                <tr>
                  <th className="border border-black p-1 text-center font-bold">
                    Sl.
                  </th>
                  <th className="border border-black p-1 text-center font-bold">
                    Worker
                  </th>
                  <th className="border border-black p-1 text-center font-bold">
                    Hours
                  </th>
                  <th className="border border-black p-1 text-center font-bold">
                    Wage/Hr
                  </th>
                  <th className="border border-black p-1 text-center font-bold">
                    OT Hrs
                  </th>
                  <th className="border border-black p-1 text-center font-bold">
                    OT/Hr
                  </th>
                  <th className="border border-black p-1 text-center font-bold">
                    Status
                  </th>
                  <th className="border border-black p-1 text-center font-bold">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {version.entries.map((entry, idx) => (
                  <tr key={idx}>
                    <td className="border border-black p-1 text-center">
                      {idx + 1}
                    </td>
                    <td className="border border-black p-1 text-left">
                      {entry.workerName}
                    </td>
                    <td className="border border-black p-1 text-center">
                      {entry.workingHours}
                    </td>
                    <td className="border border-black p-1 text-center">
                      {entry.wagePerHour}
                    </td>
                    <td className="border border-black p-1 text-center">
                      {entry.overtimeHours}
                    </td>
                    <td className="border border-black p-1 text-center">
                      {entry.overtimeWagePerHour}
                    </td>
                    <td className="border border-black p-1 text-center">
                      {entry.paymentStatus}
                    </td>
                    <td className="border border-black p-1 text-center">
                      {entry.totalTk.toLocaleString("en-BD")}
                    </td>
                  </tr>
                ))}
                {/* Total Row */}
                <tr>
                  <td className="border border-black p-1"></td>
                  <td className="border border-black p-1 font-bold" colSpan={5}>
                    Total
                  </td>
                  <td className="border border-black p-1"></td>
                  <td className="border border-black p-1 text-center font-bold">
                    {version.totalTk.toLocaleString("en-BD")}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Notes */}
          {version.notes && (
            <div>
              <p className="text-xs font-semibold mb-1">Notes:</p>
              <p className="text-xs" style={{ fontFamily: "Arial" }}>
                {version.notes}
              </p>
            </div>
          )}

          {/* In Words */}
          <div>
            <p className="text-xs" style={{ fontFamily: "Times New Roman" }}>
              <strong>In Words:</strong> {amountInWords} taka only
            </p>
          </div>

          {/* Footer Info */}
          <div className="space-y-2 pt-2 border-t">
            {version.preparedBy && (
              <div className="text-xs">
                <span className="text-muted-foreground">Prepared by: </span>
                <span>{version.preparedBy}</span>
              </div>
            )}
            {version.checkedBy && (
              <div className="text-xs">
                <span className="text-muted-foreground">Checked by: </span>
                <span>{version.checkedBy}</span>
              </div>
            )}
            {version.approvedBy && (
              <div className="text-xs">
                <span className="text-muted-foreground">Approved by: </span>
                <span>{version.approvedBy}</span>
              </div>
            )}
            {version.signatoryName && (
              <div className="text-xs">
                <span className="text-muted-foreground">Signatory: </span>
                <span>{version.signatoryName}</span>
              </div>
            )}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function BillVersionDisplay({ bill }: BillVersionDisplayProps) {
  if (!bill.versions || bill.versions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Version History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No previous versions. This is the original bill.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Version History</CardTitle>
        <p className="text-sm text-muted-foreground">
          {bill.versions.length} previous version{bill.versions.length !== 1 ? "s" : ""}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bill.versions.map((version, index) => (
            <VersionDetails key={index} version={version} index={index} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
