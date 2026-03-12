// Supabase Configuration
const supabaseUrl = 'https://qjurthicrkwrbhnjxrlz.supabase.co';
const supabaseKey = 'sb_publishable_NHxDtlqk6MVCK6nxVEmpdQ_Ld63yVlz';

const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Make functions globally available
window.getTodosFromSupabase = async function() {
    const { data, error } = await _supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: true });
    
    if (error) {
        console.error('Error fetching todos:', error);
        return [];
    }
    return data;
};

window.addTodoToSupabase = async function(todoText) {
    const { data: { user } } = await _supabase.auth.getUser();
    if (!user) {
        console.error('User must be logged in to save to Supabase');
        return null;
    }

    const { data, error } = await _supabase
        .from('todos')
        .insert([{ text: todoText, completed: false, user_id: user.id }])
        .select();
    
    if (error) {
        console.error('Error adding todo:', error);
        return null;
    }
    return data[0];
};


window.updateTodoInSupabase = async function(id, completed) {
    const { error } = await _supabase
        .from('todos')
        .update({ completed: completed })
        .eq('id', id);
    
    if (error) {
        console.error('Error updating todo:', error);
    }
};

window.deleteTodoFromSupabase = async function(id) {
    const { error } = await _supabase
        .from('todos')
        .delete()
        .eq('id', id);
    
    if (error) {
        console.error('Error deleting todo:', error);
    }
};

window.signUpUser = async function(email, password) {
    const { data, error } = await _supabase.auth.signUp({
        email,
        password,
    });
    if (error) throw error;
    return data;
};

window.signInUser = async function(email, password) {
    const { data, error } = await _supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (error) throw error;
    return data;
};

window.signOutUser = async function() {
    const { error } = await _supabase.auth.signOut();
    if (error) console.error('Error signing out:', error);
};

window.getCurrentUser = async function() {
    const { data: { user } } = await _supabase.auth.getUser();
    return user;
};


