"use server";
import { TSettingsInput } from "@/app/dashboard/settings/schema";
import { TSettingsFormPrevState } from "@/app/dashboard/settings/schema";
import { SettingsInputSchema } from "@/app/dashboard/settings/schema";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import sharp from "sharp";

export async function updateSettings(
  prevState: TSettingsFormPrevState,
  formData: FormData
): Promise<TSettingsFormPrevState> {
  const raw = {
    business_logo_url: String(formData.get("business_logo_url") || ""),
    username: String(formData.get("username") || ""),
  } satisfies TSettingsInput;

  const parsed = SettingsInputSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: TSettingsFormPrevState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof TSettingsInput;
      fieldErrors[key] = [...(fieldErrors[key] ?? []), issue.message];
    }
    return { success: false, errors: fieldErrors, inputs: raw };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return {
      success: false,
      errors: { supabase: ["Not authenticated"] },
      inputs: raw,
    };
  }

  const { error } = await supabase
    .from("users")
    .update(parsed.data)
    .eq("id", user.id)
    .select()
    .single();

  if (error) {
    return {
      success: false,
      errors: { supabase: [error.message] },
      inputs: parsed.data,
    };
  }

  revalidatePath("/dashboard/settings");

  return { success: true, inputs: parsed.data };
}

export async function uploadProfilePic(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, errors: { supabase: ["Not authenticated"] } };
  }

  const file = formData.get("file") as File;
  if (!file) {
    return { success: false, errors: { file: ["No file provided"] } };
  }

  // Validate file type
  if (!file.type.startsWith("image/")) {
    return {
      success: false,
      errors: { file: ["Please upload a valid image file"] },
    };
  }

  // Validate original file size (max 50MB before processing)
  if (file.size > 50 * 1024 * 1024) {
    return {
      success: false,
      errors: { file: ["Original file size must be less than 50MB"] },
    };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const webpBuffer = await sharp(buffer)
    .resize(200, 200, { fit: "cover" })
    .webp({ quality: 80 })
    .toBuffer();

  // Validate compressed file size (max 5MB after compression)
  if (webpBuffer.length > 5 * 1024 * 1024) {
    return {
      success: false,
      errors: { file: ["Compressed file size must be less than 5MB"] },
    };
  }

  const fileName = `profile-pics/${user.id}-${Date.now()}.webp`;

  const { error: uploadError } = await supabase.storage
    .from("leadmate")
    .upload(fileName, webpBuffer, {
      contentType: "image/webp",
      upsert: false,
    });

  if (uploadError) {
    console.error("uploadError", uploadError);
    return { success: false, errors: { storage: [uploadError.message] } };
  }

  // Get the public URL
  const { data} = supabase.storage.from("leadmate").getPublicUrl(fileName);

  if (!data) {
      return { success: false, errors: { storage: ["Cannot get public URL"] } };
    }


  // Update user's business_logo_url in the database
  const { error: updateError } = await supabase
    .from("users")
    .update({ business_logo_url: data.publicUrl })
    .eq("id", user.id);

  if (updateError) {
    return { success: false, errors: { database: [updateError.message] } };
  }

  revalidatePath("/dashboard/settings");

  return { success: true, url: data.publicUrl };
}
