"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useWorkerAction } from "@/hooks/actions/useWorkerAction";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import * as React from "react";

interface WorkerComboboxProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

export function WorkerCombobox({
  value,
  onValueChange,
  disabled,
}: WorkerComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const { useWorkersQuery, createWorkerMutation } = useWorkerAction();
  const { data: workers = [], isLoading } = useWorkersQuery();

  const filteredWorkers = React.useMemo(() => {
    if (!searchQuery.trim()) return workers;
    return workers.filter((worker) =>
      worker.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [workers, searchQuery]);

  const showCreateOption =
    searchQuery.trim() &&
    !filteredWorkers.some(
      (w) => w.name.toLowerCase() === searchQuery.toLowerCase(),
    );

  const handleCreateWorker = async () => {
    if (!searchQuery.trim()) return;
    try {
      const workerName = searchQuery.trim();
      await createWorkerMutation.mutateAsync(workerName);
      onValueChange(workerName);
      setSearchQuery("");
      setOpen(false);
    } catch (error) {
      console.error("Error creating worker:", error);
    }
  };

  const handleSelect = (selectedValue: string) => {
    if (selectedValue === searchQuery || selectedValue === "__create__") {
      // If selecting the create option or the search query itself, create the worker
      handleCreateWorker();
    } else {
      onValueChange(selectedValue);
      setOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="min-h-[44px] w-full justify-between"
          disabled={disabled || isLoading}
        >
          {value
            ? workers.find((worker) => worker.name === value)?.name || value
            : "Select or type worker name..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search or type new worker name..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            {filteredWorkers.length === 0 && !showCreateOption && (
              <CommandEmpty>No worker found.</CommandEmpty>
            )}
            {filteredWorkers.length > 0 && (
              <CommandGroup heading="Workers">
                {filteredWorkers.map((worker) => (
                  <CommandItem
                    key={worker._id.toString()}
                    value={worker.name}
                    onSelect={handleSelect}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === worker.name ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {worker.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {showCreateOption && (
              <CommandGroup>
                <CommandItem
                  value={searchQuery}
                  onSelect={handleSelect}
                  className="text-primary font-medium"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create &quot;{searchQuery}&quot;
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
