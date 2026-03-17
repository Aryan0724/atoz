import { supabase } from './client';

/**
 * Uploads a file to a Supabase bucket.
 * @param bucket - The name of the bucket (e.g., 'products', 'designs')
 * @param path - The path inside the bucket (e.g., 'logo-123.png')
 * @param file - The File object to upload
 */
export async function uploadFile(bucket: string, path: string, file: File) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (error) {
    throw error;
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return publicUrl;
}

/**
 * Deletes a file from Supabase storage.
 */
export async function deleteFile(bucket: string, path: string) {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) {
    throw error;
  }
}
