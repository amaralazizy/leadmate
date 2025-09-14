"use client";

import { useState } from "react";
import { Upload, FileText, Brain, AlertCircle, X } from "lucide-react";
import { OnboardingStepProps } from "./types";
import { Textarea } from "../ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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

  const removeFile = () => {
    setFile(null);
    setData({ ...data, knowledgeContent: "" });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto w-12 h-12 bg-main rounded-base border-2 border-border shadow-shadow flex items-center justify-center mb-4">
          <Brain className="h-6 w-6 text-main-foreground" />
        </div>
        <h3 className="text-xl font-heading text-foreground mb-2">
          Upload Your Business Knowledge
        </h3>
        <p className="text-sm text-foreground/70">
          Add your FAQ, menu, or business information that the AI will use to
          answer customer questions
        </p>
      </div>

      <div className="space-y-6">
        {/* File Upload Area */}
        <div>
          <Label className="text-sm font-base text-foreground mb-3 block">
            Upload Knowledge File <span className="text-red-500">*</span>
          </Label>
          <div
            className={`flex justify-center px-6 py-8 border-2 border-dashed rounded-base transition-all duration-200 ${
              dragActive
                ? "border-main bg-main/10 shadow-shadow"
                : "border-border hover:border-main/50 bg-secondary-background"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="space-y-4 text-center">
              <Upload
                className={`mx-auto h-12 w-12 transition-colors ${
                  dragActive ? "text-main" : "text-foreground/40"
                }`}
              />
              <div className="space-y-2">
                <div className="flex text-sm text-foreground/70 justify-center">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer font-base text-main hover:text-main/80 focus-within:outline-none"
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
                <p className="text-xs text-foreground/50">
                  Text files up to 10MB
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Show uploaded file */}
        {file && (
          <div className="flex items-center justify-between p-4 bg-secondary-background rounded-base border-2 border-border">
            <div className="flex items-center text-sm text-foreground">
              <FileText className="h-5 w-5 mr-3 text-main" />
              <div>
                <p className="font-base">{file.name}</p>
                <p className="text-xs text-foreground/60">
                  {Math.round(file.size / 1024)} KB
                </p>
              </div>
            </div>
            <Button
              type="button"
              onClick={removeFile}
              variant="neutral"
              size="sm"
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Manual Input */}
        <div className="space-y-3">
          <Label
            htmlFor="knowledge-content"
            className="text-sm font-base text-foreground"
          >
            Or paste your content directly
          </Label>
          <Textarea
            id="knowledge-content"
            name="knowledge-content"
            rows={10}
            value={data.knowledgeContent || ""}
            onChange={(e) =>
              setData({ ...data, knowledgeContent: e.target.value })
            }
            className="w-full resize-none"
            placeholder="Enter your FAQ, menu items, business information, or any content you want the AI to know about..."
          />
          <div className="flex justify-between text-xs text-foreground/60">
            <span>This content will train your AI assistant</span>
            <span>{data.knowledgeContent?.length || 0} characters</span>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-secondary-background p-6 rounded-base border-2 border-border">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-main mt-0.5 flex-shrink-0" />
          <div className="space-y-3">
            <h4 className="text-sm font-base text-foreground">
              💡 Tips for better AI responses:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <ul className="text-xs text-foreground/70 space-y-1">
                <li>• Include frequently asked questions and answers</li>
                <li>• Add menu items with descriptions and prices</li>
                <li>• Include business hours and contact information</li>
              </ul>
              <ul className="text-xs text-foreground/70 space-y-1">
                <li>• Add booking procedures or ordering processes</li>
                <li>• Include return/refund policies</li>
                <li>• Keep information clear and well-organized</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Required field note */}
      <div className="text-center p-3 bg-red-50 rounded-base border border-red-200">
        <p className="text-xs text-red-700">
          <span className="text-red-500 font-bold">*</span> Knowledge content is
          required to train your AI bot effectively
        </p>
      </div>
    </div>
  );
}
