"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import type { SelectOption } from "@/features/dashboard/types/dashboard.types";

type Props = {
  icon?: React.ReactNode;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  minWidthClass?: string;
};

export default function CustomSelect({
  icon,
  value,
  options,
  onChange,
  placeholder,
  minWidthClass = "min-w-[180px]",
}: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative ${minWidthClass}`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-left text-sm text-white outline-none transition hover:border-white/20 hover:bg-white/[0.05] focus:border-cyan-500/40"
      >
        <div className="flex min-w-0 items-center gap-3">
          {icon && <span className="shrink-0 text-white/30">{icon}</span>}
          <span className="truncate">
            {selectedOption?.label || placeholder || "Sélectionner"}
          </span>
        </div>

        <ChevronDown
          size={16}
          className={`shrink-0 text-white/40 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0d]/95 shadow-2xl backdrop-blur-xl">
          <div className="max-h-64 overflow-y-auto p-2">
            {options.map((option) => {
              const active = option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm transition-all ${
                    active
                      ? "bg-white text-black"
                      : "text-white/70 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  <span className="truncate">{option.label}</span>
                  {active && <Check size={14} className="shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}