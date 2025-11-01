"use client";
import React from "react";
import { cn } from "@/lib/utils";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  ShadcnSelect,
} from "./select-shadcn";

export type SelectOption = {
  value: string;
  label: string;
};

export type SelectProps = {
  placeholder?: string;
  value?: string;
  className?: string;
  onChange?: (value: string) => void;
  options?: SelectOption[];
  children?: React.ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  id?: string;
};

export const Select = React.forwardRef<HTMLInputElement, SelectProps>(
  (
    {
      options,
      fullWidth = false,
      id,
      value,
      className,
      onChange,
      disabled = false,
      children,
      placeholder = "Select an option",
    },
    ref
  ) => {
    return (
      <div
        className={cn(
          "space-y-1",
          fullWidth && "w-full",
          className && className
        )}
        ref={ref}
      >
        <ShadcnSelect
          value={value}
          onValueChange={onChange}
          disabled={disabled}
        >
          <SelectTrigger id={id} className={cn(fullWidth && "w-full")}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
            {children}
          </SelectContent>
        </ShadcnSelect>
      </div>
    );
  }
) as React.ForwardRefExoticComponent<
  SelectProps & React.RefAttributes<HTMLInputElement>
> & {
  Option: typeof SelectOption;
};

const SelectOption = ({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) => {
  return <SelectItem value={value}>{children}</SelectItem>;
};

Select.Option = SelectOption;
Select.displayName = "Select";
