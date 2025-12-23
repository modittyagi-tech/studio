import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL");
}
if (!supabaseAnonKey) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Example usage:
 * 
 * import { supabase } from '@/lib/supabase';
 * 
 * async function getStays() {
 *   const { data: stays, error } = await supabase.from('stays').select('*');
 *   if (error) {
 *     console.error('Error fetching stays:', error);
 *     return [];
 *   }
 *   return stays;
 * }
 */
