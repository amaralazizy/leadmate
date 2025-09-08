"use client";

import { useState } from "react";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { OnboardingStepProps } from "./types";
import { Textarea } from "../ui/textarea";

export default function KnowledgeUploadStep({
  data,
  setData,
}: OnboardingStepProps) {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = (selectedFile: File) => {
    if (selectedFile && selectedFile.type === "text/plain") {
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setData({ ...data, knowledgeContent: content });
      };
      reader.readAsText(selectedFile);
    } else {
      alert("Please select a text file (.txt)");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileUpload(selectedFile);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      handleFileUpload(droppedFile);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">
          Upload Your Business Knowledge
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          Add your FAQ, menu, or business information that the AI will use to
          answer customer questions.
        </p>
      </div>

      {/* File Upload Area */}
      <div
        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors ${
          dragActive
            ? "border-blue-400 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="space-y-1 text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="flex text-sm text-gray-600">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
            >
              <span>Upload a file</span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                accept=".txt"
                className="sr-only"
                onChange={handleFileChange}
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">Text files up to 10MB</p>
        </div>
      </div>

      {/* Show uploaded file */}
      {file && (
        <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
          <FileText className="h-4 w-4 mr-2" />
          <span>{file.name}</span>
          <span className="ml-2 text-xs text-gray-500">
            ({Math.round(file.size / 1024)} KB)
          </span>
        </div>
      )}

      {/* Manual Input */}
      <div>
        <label
          htmlFor="knowledge-content"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Or paste your content directly
        </label>
        <Textarea
          id="knowledge-content"
          name="knowledge-content"
          rows={8}
          value={data.knowledgeContent || ""}
          onChange={(e) =>
            setData({ ...data, knowledgeContent: e.target.value })
          }
          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
          placeholder="Enter your FAQ, menu items, business information, or any content you want the AI to know about..."
        />
      </div>

      {/* Tips */}
      <div className="bg-blue-50 p-4 rounded-md">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-blue-800 mb-2">
              Tips for better AI responses:
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Include frequently asked questions and answers</li>
              <li>• Add menu items with descriptions and prices</li>
              <li>• Include business hours and contact information</li>
              <li>• Add booking procedures or ordering processes</li>
              <li>• Keep information clear and well-organized</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Required field note */}
      <div className="text-xs text-gray-500 text-center">
        <span className="text-red-500">*</span> Knowledge content is required to
        train your AI bot
      </div>
    </div>
  );
}
