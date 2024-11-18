"use client";
import { useRef, useState } from "react";
import Done from "./Done";


type handleChangeprops = {
  handleChange: (
    mime: string,
    original_name: string,
    new_filename: string
  ) => void;
};

export default function FileUpload({ handleChange }: handleChangeprops) {
  const [isloading, setIsloading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  

  return (
    <div className="flex gap-4">
      <label className="w-full">
        <input type="file" name="file" accept=".jpg,.png,.jpeg,.pdf,.doc,.docs" ref={fileInput} onChange={uploadFile} className="border-dashed border" />
      </label>
        {isloading && (
          <div className="flex justify-center items-center">
            <div className="w-5 h-5 border-y-2 border-solid rounded-full border-b-green-600 animate-spin" />
          </div>
        )}
        {isUploaded && (<Done/>)}
    </div>
  );
}