"use client";

import type { Country } from "@/types";
import { COUNTRIES } from "@/lib/utils";

/**
 * @description 国家筛选器组件
 * @param selected - 已选中的国家列表
 * @param onChange - 选中状态变化回调
 */
export default function CountryFilter({
  selected,
  onChange,
}: {
  selected: Country[];
  onChange: (countries: Country[]) => void;
}) {
  const toggle = (code: Country) => {
    if (selected.includes(code)) {
      onChange(selected.filter((c) => c !== code));
    } else {
      onChange([...selected, code]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {COUNTRIES.map((country) => {
        const isSelected = selected.includes(country.code);
        return (
          <button
            key={country.code}
            onClick={() => toggle(country.code)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              isSelected
                ? "bg-navy-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <span>{country.flag}</span>
            <span>{country.name}</span>
          </button>
        );
      })}
    </div>
  );
}
