"use client";

import Done from "@/app/components/Done";
import Input from "@/app/components/Input";
import RadioButton from "@/app/components/RadioButton";
import React, { useEffect, useRef, useState } from "react";

type InputData = {
  name: string;
  label: string;
  className: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
};

type FormData = {
  fundSource: string | null;
  expenseDate: string | null;
  category: string | null;
  head: string | null;
  remark: string | null;
  vendor: string | null;
  amount: string | null;
  reference: string | null;
  isReimburseable: string | null;
  reimbursementSource: string | null;
  reimbursementDate: string | null;
  comment: string | null;
  mimeType: string | null;
  newFilename: string | null;
  originalName: string | null;
};

type FormDataKeys = keyof FormData;

function Form() {
  const [isloading, setIsloading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [uploadedfile, setUploadedFile] = useState<File>();
  const [isFileUploaded, setisFileUploaded] = useState(false);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);

  const fileInput = useRef<HTMLInputElement>(null);
  const inputData: InputData[][] = [
    [
      {
        name: "fundSource",
        label: "Fund Source",
        placeholder: "Source",
        required: true,
        className: "w-1/2",
      },
      {
        name: "expenseDate",
        label: "Expense Date",
        type: "date",

        required: true,
        className: "w-1/2",
      },
    ],
    [
      {
        name: "category",
        label: "Category",
        placeholder: "Select Category",
        required: true,
        className: "w-1/2",
      },
      {
        name: "head",
        label: "Expense Head",
        placeholder: "Select Head",
        required: true,
        className: "w-1/2",
      },
    ],
    [
      {
        name: "remark",
        label: "Remark",
        placeholder: "Remark",
        className: "w-full",
      },
    ],
    [
      {
        name: "vendor",
        label: "Paid To",
        placeholder: "Select Vendor",
        required: true,
        className: "w-1/2",
      },
      {
        name: "amount",
        label: "Amount",
        placeholder: "Enter Amount",
        type: "number",
        required: true,
        className: "w-1/2",
      },
    ],
    [
      {
        name: "reference",
        label: "Reference #",
        placeholder: "Enter Reference",
        className: "w-full",
      },
    ],
    [
      {
        name: "isReimburseable",
        label: "Is this expense eligible for reimbursement?",
        type: "radio",
        className: "w-full",
      },
    ],
  ];

  const reimbersementData = [
    [
      {
        name: "reimbursementSource",
        label: "Reimbursement Source",
        placeholder: "Select Source",
        options: [],
        required: true,
        className: "w-1/2",
      },
      {
        name: "reimbursementDate",
        label: "Reimbursement Date",
        options: [],
        type: "date",
        className: "w-1/2",
      },
    ],
    [
      {
        name: "comment",
        label: "Add Comment",
        options: [],
        type: "textarea",
        className: "w-full",
      },
    ],
  ];

  const getRequiredFields = () => {
    const baseRequiredFields = {
      fundSource: "Fund Source",
      expenseDate: "Expense Data",
      category: "Category",
      head: "Head",
      vendor: "Paid to",
      amount: "Amount",
      isReimburseable: "Is Reimburseable",
    };

    if (formData.isReimburseable === "yes") {
      return {
        ...baseRequiredFields,
        reimbursementSource: "Reimburseable Source"
      };
    }

    return baseRequiredFields;
  };

  const validateFormData = () => {
    const requiredField = getRequiredFields();

    const missingFields = Object.entries(requiredField).filter(
      ([key]) => !formData[key as keyof FormData]
    );
  
    return missingFields.map(([key, label]) => label);
  };

  const [formData, setFormData] = useState<FormData>({
    fundSource: null,
    expenseDate: null,
    category: null,
    head: null,
    remark: null,
    vendor: null,
    amount: null,
    reference: null,
    isReimburseable: null,
    reimbursementSource: null,
    reimbursementDate: null,
    comment: null,
    mimeType: null,
    newFilename: null,
    originalName: null,
  });

  const handleUpdate = (name: FormDataKeys, data: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: data,
    }));
  };

  const handleFileUpdate = (
    mime: string,
    newFilename: string,
    originalName: string
  ) => {
    setisFileUploaded(true);
    setFormData((prev) => ({
      ...prev,
      mimeType: mime,
      newFilename: newFilename,
      originalName: originalName,
    }));
  };

  const uploadFile = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files?.[0];
    if (!file) return;
    setUploadedFile(file);
    const mimeType = file.type;
    const originalName = file.name;
    const newFilename = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    handleFileUpdate(mimeType, newFilename , originalName);
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const missingFields = validateFormData();

    if (missingFields.length > 0) {
      setResponseMessage(`Error: Missing data for ${missingFields.join(", ")}`);
      setIsloading(false);
      return;
    }

    

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if(process.env.NEXT_PUBLIC_DEBUG_MODE==="true") console.log(response)
        
      const message = response.ok
        ? "Data submitted successfully!"
        : `Error: ${(await response.json()).message || "Something went wrong"}`;
      setResponseMessage(message);
    } catch (error) {
      console.error("Error occurred:", error);
      setResponseMessage("Request failed: " + error);
      return
    }

    if (!uploadedfile) {
      if (isFileUploaded) setResponseMessage(`Error: Document not found`);
      return;
    }
    
    try {
      const Data = new FormData();
      Data.append("file", uploadedfile,formData.newFilename || undefined);
      setIsloading(true);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: Data,
      });
      const result = await response.json();
      if (process.env.NEXT_PUBLIC_DEBUG_MODE==="true") console.log(result);
      setIsUploaded(true);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsloading(false);
    }
  };

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_DEBUG_MODE === "true") {
      console.log("Form data updated:", formData);
    }
  }, [formData]);

  return (
    <div className="w-full bg-white max-w-[50rem] pb-5 rounded-lg select-none">
      <h1 className="text-xl text-white bg-green-400 font-bold p-2 rounded-t-md mb-5">
        Form
      </h1>

      <form onSubmit={handleSubmit} className="p-4 w-full">
        {inputData.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-4 mb-4">
            {row.map((input, colIndex) =>
              input.type === "radio" ? (
                <RadioButton
                  key={colIndex}
                  label={input.label}
                  name={input.name}
                  selectedValue={formData.isReimburseable || ""}
                  onChange={handleRadioChange}
                  options={[
                    { value: "yes", label: "Yes" },
                    { value: "no", label: "No" },
                  ]}
                />
              ) : (
                <Input
                  key={colIndex}
                  name={input.name}
                  label={input.label}
                  placeholder={input.placeholder || ""}
                  options={[]}
                  required={input.required}
                  type={input.type || "text"}
                  value={formData[input.name as FormDataKeys] || ""}
                  className={input.className}
                  onChange={(e) =>
                    handleUpdate(input.name as FormDataKeys, e.target.value)
                  }
                />
              )
            )}
          </div>
        ))}
        {formData.isReimburseable === "yes" &&
          reimbersementData.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-4 mb-4">
              {row.map((input, colIndex) => (
                <Input
                  key={colIndex}
                  name={input.name}
                  label={input.label}
                  placeholder={input.placeholder}
                  options={input.options}
                  required={input.required}
                  type={input.type}
                  className={input.className}
                  value={formData[input.name as FormDataKeys] || ""}
                  onChange={(e) =>
                    handleUpdate(input.name as FormDataKeys, e.target.value)
                  }
                />
              ))}
            </div>
          ))}
        <div className="flex gap-4">
          <label className="w-full">
            File upload:
            <input
              type="file"
              name="file"
              accept=".jpg,.png,.jpeg,.pdf,.doc,.docs"
              ref={fileInput}
              onChange={uploadFile}
              className="border-dashed border"
            />
          </label>
          {isloading && (
            <div role="status" className="flex justify-center items-center">
              <div className="w-5 h-5 border-y-2 border-solid rounded-full border-b-green-600 animate-spin" />
            </div>
          )}
          {isUploaded && <Done />}
        </div>
        <button className="bg-green-400 hover:bg-green-500 mt-2 w-full p-2 my-1 rounded-md text-white font-bold">
          Submit
        </button>
        {responseMessage && (
          <p
            className={`text-sm mt-2 p-2 rounded-md ${
              responseMessage.startsWith("Error")
                ? "text-red-600 bg-red-100"
                : "text-green-600 bg-green-100"
            }`}
          >
            {responseMessage}
          </p>
        )}
      </form>
    </div>
  );
}

export default Form;
