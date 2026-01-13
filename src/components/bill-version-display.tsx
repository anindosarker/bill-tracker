"use client";

import { IBill } from "@/backend/models/bill.model";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface BillVersionDisplayProps {
  bill: IBill;
}

export function BillVersionDisplay({ bill }: BillVersionDisplayProps) {
  const [isOpen, setIsOpen] = useState(false);

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

  const previousVersion = bill.versions[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Previous Version</CardTitle>
        <p className="text-sm text-muted-foreground">
          Last updated: {format(new Date(previousVersion.updatedAt), "PPp")}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="text-sm">
              <p className="text-muted-foreground mb-2">Workers</p>
              <p className="font-semibold">{previousVersion.entries.length}</p>
            </div>
            <div className="pt-2 border-t">
              <p className="text-muted-foreground">Total</p>
              <p className="font-bold text-lg">
                {previousVersion.totalTk.toLocaleString("en-BD")} Tk
              </p>
            </div>
          </div>

          {bill.versions.length > 1 && (
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
              <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
                Show {bill.versions.length - 1} more version
                {bill.versions.length - 1 > 1 ? "s" : ""}
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4 space-y-4">
                {bill.versions.slice(1).map((version, index) => (
                  <div
                    key={index}
                    className="bg-muted/50 p-4 rounded-lg space-y-2"
                  >
                    <p className="text-xs text-muted-foreground mb-2">
                      {format(new Date(version.updatedAt), "PPp")}
                    </p>
                    <div className="text-sm">
                      <p className="text-muted-foreground">Workers</p>
                      <p className="font-semibold">{version.entries.length}</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-muted-foreground">Total</p>
                      <p className="font-semibold">
                        {version.totalTk.toLocaleString("en-BD")} Tk
                      </p>
                    </div>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
