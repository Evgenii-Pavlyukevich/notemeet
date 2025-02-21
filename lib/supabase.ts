import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const uploadLargeFile = async (file: File): Promise<string> => {
  const fileName = `temp_${Date.now()}_${file.name}`;
  const { data, error } = await supabase.storage
    .from('large-files')
    .upload(fileName, file);

  if (error) {
    throw new Error('Failed to upload file to Supabase');
  }

  // Store metadata in the database with expiration
  const { error: dbError } = await supabase
    .from('temp_files')
    .insert([
      {
        file_name: fileName,
        original_name: file.name,
        expires_at: new Date(Date.now() + 60000).toISOString(), // 1 minute from now
      },
    ]);

  if (dbError) {
    // If database insert fails, delete the uploaded file
    await supabase.storage.from('large-files').remove([fileName]);
    throw new Error('Failed to store file metadata');
  }

  return fileName;
};

export const getLargeFile = async (fileName: string): Promise<Blob | null> => {
  const { data: fileData } = await supabase
    .from('temp_files')
    .select('*')
    .eq('file_name', fileName)
    .single();

  if (!fileData || new Date(fileData.expires_at) < new Date()) {
    return null;
  }

  const { data, error } = await supabase.storage
    .from('large-files')
    .download(fileName);

  if (error || !data) {
    return null;
  }

  return data;
};

// Function to clean up expired files
export const cleanupExpiredFiles = async () => {
  const { data: expiredFiles, error: fetchError } = await supabase
    .from('temp_files')
    .select('*')
    .lt('expires_at', new Date().toISOString());

  if (fetchError || !expiredFiles) {
    return;
  }

  for (const file of expiredFiles) {
    // Delete from storage
    await supabase.storage
      .from('large-files')
      .remove([file.file_name]);

    // Delete from database
    await supabase
      .from('temp_files')
      .delete()
      .eq('file_name', file.file_name);
  }
}; 
