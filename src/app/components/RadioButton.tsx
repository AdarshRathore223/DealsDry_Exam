import React from "react";

interface RadioButtonProps {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  selectedValue?: string;
  onChange: (name: string, value: string) => void;
}

const RadioButton: React.FC<RadioButtonProps> = ({
  label,
  name,
  options,
  selectedValue = "", // default to empty string if not provided
  onChange
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onChange(name, value); // Pass the name and value to the parent handler
  };

  return (
    <div className="col-span-2">
      <label className="block text-sm font-bold mt-5">{label}</label>
      <div className="mt-2 flex gap-4">
        {options.map((option) => (
          <label key={option.value} className="flex items-center space-x-2">
            <input
              type="radio"
              name={name}
              id={name}
              value={option.value}
              checked={selectedValue === option.value}
              className="text-blue-600 border-gray-300 focus:ring-blue-500 m-3"
              aria-checked={selectedValue === option.value}
              onChange={handleChange} // Attach the onChange handler
            />
            <span className="text-sm text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioButton;
