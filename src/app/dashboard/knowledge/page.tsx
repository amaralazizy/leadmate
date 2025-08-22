"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText, ArrowLeft } from "lucide-react";

export default function KnowledgePage() {
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "text/plain") {
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onload = (event) => {
        setContent(event.target?.result as string);
      };
      reader.readAsText(selectedFile);
    } else {
      setMessage("Please select a text file");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setMessage("Please enter or upload content");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/knowledge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        setMessage("Knowledge base updated successfully!");
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        const error = await response.json();
        setMessage(error.message || "Failed to update knowledge base");
      }
    } catch (error) {
      setMessage("Error updating knowledge base");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <button
              onClick={() => router.push("/dashboard")}
              className="mr-4 p-2 rounded-md text-gray-400 hover:text-gray-600"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Knowledge Base</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Upload Your Business Information
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Add your FAQ, menu, or business information that the AI will use
              to answer customer questions.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="border-t border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              {message && (
                <div
                  className={`mb-4 p-4 rounded ${
                    message.includes("successfully")
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {message}
                </div>
              )}

              {/* File Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Text File
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
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
                          onChange={handleFileUpload}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      Text files up to 10MB
                    </p>
                  </div>
                </div>
                {file && (
                  <div className="mt-2 flex items-center text-sm text-gray-600">
                    <FileText className="h-4 w-4 mr-1" />
                    {file.name}
                  </div>
                )}
              </div>

              {/* Manual Input */}
              <div className="mb-6">
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Or paste your content directly
                </label>
                <textarea
                  id="content"
                  name="content"
                  rows={12}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Enter your FAQ, menu items, business information, or any content you want the AI to know about..."
                />
              </div>

              {/* Tips */}
              <div className="bg-blue-50 p-4 rounded-md mb-6">
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

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading || !content.trim()}
                  className="bg-blue-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Save Knowledge Base"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
