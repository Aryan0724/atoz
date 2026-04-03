import { NextResponse } from 'next/server'
// The client-side supabase import is potentially different from server-side
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in search params, use it as the redirection URL
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = createClient()
    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && session?.user) {
      // Check if profile exists, otherwise create it
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', session.user.id)
        .single();
      
      if (!profile) {
        const { error: insertError } = await (supabase.from('profiles') as any).insert([
          {
            id: session.user.id,
            full_name: session.user.user_metadata.full_name || session.user.user_metadata.name || 'New User',
            email: session.user.email,
            role: 'customer'
          }
        ]);
        
        if (insertError) {
          console.error('Error creating profile in callback:', insertError);
        }
      }

      // Fetch profile to determine redirect
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single() as any;
      
      const targetPath = profileData?.role === 'admin' ? '/admin' : next;

      const forwardedHost = request.headers.get('x-forwarded-host') 
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${targetPath}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${targetPath}`)
      } else {
        return NextResponse.redirect(`${origin}${targetPath}`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
