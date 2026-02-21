import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gxgvhuwsstupjgpziejg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4Z3ZodXdzc3R1cGpncHppZWpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwODQ0NDksImV4cCI6MjA4NjY2MDQ0OX0.t9F-yMUKRZS2s2KciVP3iQM4Ex_3S0cDmejOt_j-zIs';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function listTenants() {
    console.log('--- 🏫 TENANT LİSTESİ ---');
    const { data, error } = await supabase.from('tenants').select('id, name, slug');
    if (error) { console.error(error); return; }
    data.forEach(t => console.log(`ID: ${t.id} | Name: "${t.name}" | Slug: ${t.slug}`));
}

listTenants();
