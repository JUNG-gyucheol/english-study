import { supabase } from './supabase'

export async function uploadToSupabase(file: File) {
  try {
    const filePath = `uploads/${Date.now()}_${file.name}`

    const { error } = await supabase.storage
      .from('photos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      throw error
    }

    const { data } = await supabase.storage
      .from('photos')
      .createSignedUrl(filePath, 60 * 60)

    return { filePath, url: data?.signedUrl }
  } catch (error) {
    console.error('Upload error:', error)
    return null
  }
}

export async function deleteImage() {
  const { error } = await supabase.storage.emptyBucket('photos')
  if (error) {
    console.error('Delete error:', error)
  }
}
