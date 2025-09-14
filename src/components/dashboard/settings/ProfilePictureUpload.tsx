"use client";

import { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Camera, UserIcon } from "lucide-react";
import { toast } from "sonner";
import { uploadProfilePic } from "@/app/dashboard/settings/action";

interface ProfilePictureUploadProps {
  currentImageUrl?: string;
  onUploadSuccess?: (url: string) => void;
}

export default function ProfilePictureUpload({
  currentImageUrl,
  onUploadSuccess,
}: ProfilePictureUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    toast.loading("Uploading profile picture...");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const result = await uploadProfilePic(formData);
      if (result.success) {
        toast.dismiss();
        toast.success("Profile picture uploaded successfully!");
        onUploadSuccess?.(result.url!);
      } else {
        toast.dismiss();
        const errorMessage =
          result.errors?.file?.[0] ||
          result.errors?.storage?.[0] ||
          result.errors?.database?.[0] ||
          result.errors?.supabase?.[0] ||
          "Failed to upload profile picture";
        toast.error(errorMessage);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error instanceof Error ? error.message : "Failed to upload profile picture");
    } finally {
      setIsUploading(false);
      // Reset the input value so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <Label htmlFor="profile-picture">Profile Picture</Label>
      <div className="relative">
        <Avatar
          className={`h-24 w-24 cursor-pointer transition-all duration-200 ${
            isUploading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleClick}
        >
          <AvatarImage src={currentImageUrl} alt="Profile picture" />
          <AvatarFallback>
            <UserIcon className="h-12 w-12" />
          </AvatarFallback>
        </Avatar>

        {/* Camera icon overlay */}
        <div
          className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full transition-opacity duration-200 ${
            isHovered && !isUploading ? "opacity-100" : "opacity-0"
          }`}
          style={{ pointerEvents: "none" }}
        >
          <Camera className="h-6 w-6 text-white" />
        </div>

        {/* Loading spinner overlay */}
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        id="profile-picture"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />

      <Button
        variant="reverse"
        size="sm"
        onClick={handleClick}
        disabled={isUploading}
        className="text-xs"
      >
        {isUploading ? "Uploading..." : "Change Picture"}
      </Button>
    </div>
  );
}
