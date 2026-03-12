// Supabase Configuration
const supabaseUrl = 'https://qjurthicrkwrbhnjxrlz.supabase.co';
const supabaseKey = 'sb_publishable_NHxDtlqk6MVCK6nxVEmpdQ_Ld63yVlz'; // Note: This key looks different than expected, please double check in Supabase Settings -> API if code errors.

const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

async function getTodosFromSupabase() {
    const { data, error } = await _supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: true });
    
    if (error) {
        console.error('Error fetching todos:', error);
        return [];
    }
    return data;
}

async function addTodoToSupabase(todoText) {
    const { data, error } = await _supabase
        .from('todos')
        .insert([{ text: todoText, completed: false }])
        .select();
    
    if (error) {
        console.error('Error adding todo:', error);
        return null;
    }
    return data[0];
}

async function updateTodoInSupabase(id, completed) {
    const { error } = await _supabase
        .from('todos')
        .update({ completed: completed })
        .eq('id', id);
    
    if (error) {
        console.error('Error updating todo:', error);
    }
}

async function deleteTodoFromSupabase(id) {
    const { error } = await _supabase
        .from('todos')
        .delete()
        .eq('id', id);
    
    if (error) {
        console.error('Error deleting todo:', error);
    }
}

async function signUpUser(email, password) {
    const { data, error } = await _supabase.auth.signUp({
        email,
        password,
    });
    if (error) throw error;
    return data;
}

async function signInUser(email, password) {
    const { data, error } = await _supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (error) throw error;
    return data;
}

async function signOutUser() {
    const { error } = await _supabase.auth.signOut();
    if (error) console.error('Error signing out:', error);
}

async function getCurrentUser() {
    const { data: { user } } = await _supabase.auth.getUser();
    return user;
}

