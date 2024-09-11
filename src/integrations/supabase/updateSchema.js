import { supabase } from './supabase';
import fs from 'fs';
import path from 'path';

export const updateSupabaseSchema = async () => {
  try {
    const schemaFilePath = path.join(__dirname, 'schema.sql');
    const schemaSQL = fs.readFileSync(schemaFilePath, 'utf8');

    const { data, error } = await supabase.rpc('exec_sql', { sql: schemaSQL });

    if (error) {
      console.error('Error updating Supabase schema:', error);
      return false;
    }

    console.log('Supabase schema updated successfully');
    return true;
  } catch (err) {
    console.error('Error reading schema file or updating Supabase:', err);
    return false;
  }
};