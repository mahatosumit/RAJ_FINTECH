import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function uploadFileToSupabase(
  file: File | Blob,
  bucket: string,
  path: string
): Promise<{ url: string; key: string } | null> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return { url: `/uploads/${path}`, key: path };
    }

    const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: "3600",
      upsert: true,
    });

    if (error) {
      console.error("Supabase Storage Upload Error:", error);
      return null;
    }

    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
    return { url: publicUrlData.publicUrl, key: data.path };
  } catch (err) {
    console.error("Storage upload exception:", err);
    return null;
  }
}
