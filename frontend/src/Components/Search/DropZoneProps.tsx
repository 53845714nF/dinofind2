import React from "react";
import { useRef, useCallback, useState } from "react";
import type { DragEvent, ChangeEvent } from "react";
import UploadIcon from "../Generic/UploadIcon";

interface DropZoneProps {
  onFileSelect: (file: File) => void;
  fileSelected: boolean;
}
 
const DropZone: React.FC<DropZoneProps> = ({ onFileSelect, fileSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) onFileSelect(file);
    },
    [onFileSelect]
  );
 
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) onFileSelect(e.target.files[0]);
  };
 
  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg transition-colors ${
        isDragging ? "border-indigo-500 bg-blue-50" : "border-gray-300"
      }`}
    >
      <div className="space-y-1 text-center">
        <UploadIcon />
        <div className="flex text-sm text-gray-600 justify-center">
          <label
            htmlFor="file"
            className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
          >
            <span>Upload an image</span>
            <input
              id="file"
              ref={fileInputRef}
              name="file"
              type="file"
              className="sr-only"
              accept="image/*"
              onChange={handleChange}
            />
          </label>
          <p className="pl-1">or Drag & Drop</p>
        </div>
        <p className="text-xs text-gray-500">PNG and JPG up to 5MB</p>
        {fileSelected && (
          <p className="text-green-600 text-sm mt-2">✅ Image selected!</p>
        )}
      </div>
    </div>
  );
}

export default DropZone;