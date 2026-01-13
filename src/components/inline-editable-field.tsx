"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Check, Edit2, X } from "lucide-react";
import { useEffect, useState } from "react";

interface InlineEditableFieldProps {
  value: string;
  onSave: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  className?: string;
  displayClassName?: string;
  inputClassName?: string;
  showLabel?: boolean;
  label?: string;
  displayValue?: string; // Custom display value (e.g., with parentheses)
}

export function InlineEditableField({
  value,
  onSave,
  placeholder = "",
  multiline = false,
  className = "",
  displayClassName = "",
  inputClassName = "",
  showLabel = false,
  label = "",
  displayValue,
}: InlineEditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleSave = () => {
    onSave(localValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setLocalValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className={`flex items-start gap-1.5 ${className}`}>
        {multiline ? (
          <Textarea
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            placeholder={placeholder}
            className={`flex-1 text-sm ${inputClassName}`}
            autoFocus
            onKeyDown={handleKeyDown}
          />
        ) : (
          <Input
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            placeholder={placeholder}
            className={`flex-1 ${inputClassName}`}
            autoFocus
            onKeyDown={handleKeyDown}
          />
        )}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-green-50"
            onClick={handleSave}
          >
            <Check className="h-3.5 w-3.5 text-green-600" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-red-50"
            onClick={handleCancel}
          >
            <X className="h-3.5 w-3.5 text-red-600" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {showLabel && label && (
        <span className="text-sm font-medium">{label}</span>
      )}
      <span className={`min-w-0 flex-1 ${displayClassName}`}>
        {displayValue !== undefined
          ? displayValue
          : value || (
              <span className="text-muted-foreground italic">
                {placeholder || "Click to edit"}
              </span>
            )}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="hover:bg-muted/50 h-5 w-5 shrink-0 opacity-50 hover:opacity-100 print:hidden"
        onClick={() => setIsEditing(true)}
      >
        <Edit2 className="h-3 w-3" />
      </Button>
    </div>
  );
}
