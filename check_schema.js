import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gxgvhuwsstupjgpziejg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4Z3ZodXdzc3R1cGpncHppZWpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwODQ0NDksImV4cCI6MjA4NjY2MDQ0OX0.t9F-yMUKRZS2s2KciVP3iQM4Ex_3S0cDmejOt_j-zIs';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
    console.log('--- Announcements Columns ---');
    const { data: annCols, error: annErr } = await supabase
        .from('announcements')
        .select('*')
        .limit(1);

    if (annErr) {
        console.log('Error fetching announcements:', annErr.message);
    } else {
        console.log('Data sample:', annCols[0] ? Object.keys(annCols[0]) : 'No data');
    }

    console.log('\n--- Blogs Columns ---');
    const { data: blogCols, error: blogErr } = await supabase
        .from('blogs')
        .select('*')
        .limit(1);

    if (blogErr) {
        console.log('Error fetching blogs:', blogErr.message);
    } else {
        console.log('Data sample:', blogCols[0] ? Object.keys(blogCols[0]) : 'No data');
    }
}

check();
