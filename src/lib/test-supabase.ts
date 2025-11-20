import { createClient } from '@supabase/supabase-js'

// Test Supabase connection
const supabaseUrl = 'https://xybrjrecphoavhtvcsnn.supabase.co'
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'your_anon_key_here'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...')
    
    // Test basic connection
    const { data, error } = await supabase
      .from('generated_files')
      .select('count')
      .limit(1)
    
    if (error) {
      console.log('❌ Connection failed:', error.message)
      return false
    }
    
    console.log('✅ Supabase connection successful!')
    return true
  } catch (error) {
    console.error('❌ Connection error:', error.message)
    return false
  }
}

export { supabase }