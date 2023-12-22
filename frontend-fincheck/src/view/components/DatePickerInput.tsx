import { useState } from "react";
import { CrossCircledIcon } from "@radix-ui/react-icons";

import { cn } from "../../app/utils/cn";
import { formatDate } from "../../app/utils/formatDate";
import { Popover } from "./Popover";
import { DatePicker } from "./DatePicker";

interface DatePickerInputProps {
  error?: string;
  className?: string;
  value?: Date;
  onChange?(date: Date): void;
}

export function DatePickerInput({ error, className, value, onChange }: DatePickerInputProps) {
  const [selectedDate, setSelectedDate] = useState(value ?? new Date())

  function handleDateChange(date: Date) {
    setSelectedDate(date)
    onChange?.(date)
  }

  return (
    <div>
      <Popover.Root>
        <Popover.Trigger>
          <button
            type="button"
            className={cn(
              "w-full bg-white rounded-lg border border-gray-400 px-3 h-[52px] text-gray-700 focus:border-teal-500 transition-all outline-none appearance-none text-left relative pt-4",
              error && "!border-red-900",
              className
              )}
          >
            <span className="absolute text-gray-700 text-xs left-[13px] top-2 pointer-events-none">
              Data
            </span>
            <span>
              {formatDate(selectedDate)}
            </span>
          </button>
        </Popover.Trigger>

        <Popover.Content>
          <DatePicker value={selectedDate} onChange={handleDateChange} />
        </Popover.Content>
      </Popover.Root>

      {error && (
        <div className="flex items-center gap-2 mt-2 text-red-900">
          <CrossCircledIcon />
          <span className="text-xs">{error}</span>
        </div>
      )}
    </div>
  )
}
