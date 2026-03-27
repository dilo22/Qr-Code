import { supabase } from "@/lib/supabase/client";

export async function uploadQrFile(file: File, type: string) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error("Utilisateur non connecté.");

  const extension = file.name.includes(".") ? file.name.split(".").pop() : "";
  const safeExt = extension ? `.${extension}` : "";
  const filePath = `${user.id}/${crypto.randomUUID()}${safeExt}`;

  const { error: uploadError } = await supabase.storage
    .from("qr-files")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) throw uploadError;

  const { data: publicUrlData } = supabase.storage
    .from("qr-files")
    .getPublicUrl(filePath);

  return {
    storagePath: filePath,
    publicUrl: publicUrlData.publicUrl,
    url: publicUrlData.publicUrl,
    fileName: file.name,
    mimeType: file.type,
    size: file.size,
    fileCategory: type,
    kind: "hosted_file",
  };
}