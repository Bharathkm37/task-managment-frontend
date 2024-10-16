import { createClient } from '@supabase/supabase-js';




const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_KEY);

export const signUp = async (email, password, username, isGoogleLogin = false) => {
    const fetchedUserProfile = await supabase.from('user_profiles').select('*').eq('email', email).maybeSingle();

    if (fetchedUserProfile.data) {
        return { error: 'User with this email already exists.' };
    }



    if (!fetchedUserProfile.data) {
        await createProfile( username, email, password, isGoogleLogin);
    }
    return {}
};

const createProfile = async ( username, email, password,isGoogleLogin) => {
    const { data, error } = await supabase
        .from('user_profiles')
        .insert([{  username, email, password, isGoogleLogin }]);

    if (error) {
        console.error('Error creating user profile:', error.message);
        return { error };
    }
    return { data };
};

export const signIn = async (email, password) => {
    try {
        const fetchedUserProfile = await supabase.from('user_profiles').select('*').eq('email', email).maybeSingle();

        const isPassowordVerified = fetchedUserProfile.data?.password === password;

        if (!isPassowordVerified) {
            return { error: 'Invalid email or password.' };
        }

        const randomToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        await supabase.from('user_profiles').update({ Token: randomToken }).match({ email });

        return { user: fetchedUserProfile.data };

    } catch (error) {
        console.error('Sign-in error:', error.message);
        return { error };
    }
};

export const signInWithGoogle = async (name, email) => {
    const fetchUserProfile = await supabase.from('user_profiles').select('*').eq('email', email).maybeSingle();

    console.log(fetchUserProfile)

    if(!fetchUserProfile.data) {
     const {error, user} =   await signUp(email, null, name)

     const createdUserProfile = await supabase.from('user_profiles').select('*').eq('email', email).maybeSingle();

     if(error  || !createdUserProfile.data) {
        return {error}
     }
     return {user: createdUserProfile.data}
    }

    await supabase.from('user_profiles').update({ isGoogleLogin: true }).match({ email });

    return {user: {...fetchUserProfile.data, isGoogleLogin: true}}
};

export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
};

export default supabase;
