import React from "react";
import type { ChangeEvent } from "react";

interface ResultsInputProps {
  value: number;
  onChange: (value: number) => void;
}
 
const ResultsInput: React.FC<ResultsInputProps> = ({ value, onChange }) => {
  return (
    <div>
      <label htmlFor="limit" className="block text-sm font-medium text-gray-700 mb-2">
        Number of results
      </label>
      <input
        type="number"
        name="limit"
        id="limit"
        value={value}
        min={1}
        max={25}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(Number(e.target.value))}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      />
    </div>
  );
}

export default ResultsInput;