import { supabase } from './src/lib/supabase';

async function main() {
    const { data, error } = await supabase.from('products').select('category');
    if (error) {
        console.error(error);
        return;
    }
    const cats = [...new Set(data?.map(p => p.category))];
    console.log('Current categories:', cats);
}

main();
