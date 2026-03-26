"use client";

import { Search, Filter, ArrowUpDown } from "lucide-react";
import CustomSelect from "./CustomSelect";
import type { SelectOption, SortOption } from "@/features/dashboard/types/dashboard.types";

type Props = {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedType: string;
  setSelectedType: (value: string) => void;
  sortBy: SortOption;
  setSortBy: (value: SortOption) => void;
  typeOptions: SelectOption[];
  sortOptions: SelectOption[];
};

export default function DashboardFilters({
  searchQuery,
  setSearchQuery,
  selectedType,
  setSelectedType,
  sortBy,
  setSortBy,
  typeOptions,
  sortOptions,
}: Props) {
  return (
    <div className="flex flex-col gap-3 rounded-[2rem] border border-white/10 bg-white/[0.03] p-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative w-full lg:max-w-md">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher par nom ou type..."
          className="w-full rounded-2xl border border-white/10 bg-black/30 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-cyan-500/40"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <CustomSelect
          icon={<Filter size={16} />}
          value={selectedType}
          options={typeOptions}
          onChange={setSelectedType}
          placeholder="Tous les types"
        />

        <CustomSelect
          icon={<ArrowUpDown size={16} />}
          value={sortBy}
          options={sortOptions}
          onChange={(value) => setSortBy(value as SortOption)}
          placeholder="Tri"
        />
      </div>
    </div>
  );
}