/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";

interface DropdownProps {
  options: string[] | number[];
  onSelect: (selectedOption: string) => void;
  value: string | number | undefined;
  name: string;
}

export default function Dropdown({
  options,
  onSelect,
  value,
  name,
}: DropdownProps) {
  const [selectedOption, setSelectedOption] = useState<string | number>("");

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setSelectedOption(selectedValue);
    onSelect(selectedValue);
    value = selectedValue;
  };

  return (
    <div className="flex flex-col items-center">
      <label>What category are you looking for?</label>
      <select
        value={selectedOption}
        onChange={handleSelectChange}
        className="block w-full px-3 py-2 mt-2 mb-4 border rounded-lg"
      >
        <option value="">Choose {name}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
