// components/Dropdown.tsx

import React, { useState } from "react";

interface DropdownProps {
  options: string[];
  onSelect: (selectedOption: string) => void;
}

export default function Dropdown({ options, onSelect }: DropdownProps) {
  const [selectedOption, setSelectedOption] = useState<string>("");

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setSelectedOption(selectedValue);
    onSelect(selectedValue);
  };

  return (
    <div>
      <label>Category:</label>
      <select value={selectedOption} onChange={handleSelectChange}>
        <option value="">Choose product category</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
