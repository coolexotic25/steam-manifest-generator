import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Using fallback storage.')
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Helper functions for database operations
export async function createGeneratedFile(fileData) {
  if (!supabase) {
    console.log('Supabase not available, using fallback')
    return null
  }

  try {
    const { data, error } = await supabase
      .from('generated_files')
      .insert([
        {
          access_key: fileData.accessKey,
          discord_user_id: fileData.discordUserId,
          discord_username: fileData.discordUsername,
          steam_app_id: fileData.steamAppId,
          steam_app_name: fileData.steamAppName,
          manifest_content: fileData.manifestContent,
          lua_content: fileData.luaContent,
          manifest_size: fileData.manifestSize,
          lua_size: fileData.luaSize,
          expires_at: fileData.expiresAt
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error creating file record:', error)
    return null
  }
}

export async function getGeneratedFile(accessKey) {
  if (!supabase) {
    console.log('Supabase not available, using fallback')
    return null
  }

  try {
    const { data, error } = await supabase
      .from('generated_files')
      .select('*')
      .eq('access_key', accessKey)
      .single()

    if (error) {
      console.error('Supabase select error:', error)
      return null
    }

    // Check if expired
    if (new Date() > new Date(data.expires_at)) {
      await deleteGeneratedFile(accessKey)
      return null
    }

    return data
  } catch (error) {
    console.error('Error fetching file record:', error)
    return null
  }
}

export async function deleteGeneratedFile(accessKey) {
  if (!supabase) return null

  try {
    const { error } = await supabase
      .from('generated_files')
      .delete()
      .eq('access_key', accessKey)

    if (error) {
      console.error('Supabase delete error:', error)
      return null
    }

    return true
  } catch (error) {
    console.error('Error deleting file record:', error)
    return null
  }
}