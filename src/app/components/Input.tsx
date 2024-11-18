"use client";
import React, { useState } from "react";

interface InputProps {
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  options: string[];
  charLimit?: number;
  className?: string;
  type?: string;
  value?:string
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const Input: React.FC<InputProps> = ({
  name,
  label,
  placeholder,
  options,
  required,
  charLimit,
  className,
  type = "text",
  onChange
}) => {
  const today = new Date().toISOString().split("T")[0];
  const [inputValue, setInputValue] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = ( e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let value = e.target.value;

    if (charLimit && value.length > charLimit) {
      value = value.slice(0, charLimit);
      setError(`Character limit of ${charLimit} exceeded!`);
    } else {
      setError(null);
    }

    setInputValue(value);
    setIsDropdownVisible(
      Boolean(
        value &&
          options.some((option) =>
            option.toLowerCase().includes(value.toLowerCase())
          )
      )
    );

    if (onChange) onChange(e);
  };

  const handleOptionClick = (option: string) => {
    setInputValue(option);
    setIsDropdownVisible(false);
  };

  return (
    <div className={`relative ${className}`}>
      <label htmlFor={name} aria-labelledby={name} className="block text-xs text-gray-700">
        {label}{" "}
        {required && <span className="text-red-600 font-extrabold">*</span>}
      </label>
      {type === "textarea" ? (
        <textarea
          id={name}
          name={name}
          className="mt-1 block w-full border border-gray-400 shadow-sm bg-transparent p-2 h-12"
          placeholder={placeholder}
          value={inputValue}
          rows={3}
          onChange={handleInputChange}
        />
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          {...(type === "date" && { max: today })}
          className="mt-1 block w-full border border-gray-400 shadow-sm bg-transparent p-2 h-12"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
        />
      )}

      {isDropdownVisible && (
        <div className="absolute mt-1 w-full border border-gray-400 bg-white shadow-lg z-10">
          {options
            .filter((option) =>
              option.toLowerCase().includes(inputValue.toLowerCase())
            )
            .map((filteredOption) => (
              <div
                key={filteredOption}
                className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => handleOptionClick(filteredOption)}
              >
                {filteredOption}
              </div>
            ))}
        </div>
      )}

      {error && <div className="text-red-600 text-xs mt-2">{error}</div>}
    </div>
  );
};

export default Input;
