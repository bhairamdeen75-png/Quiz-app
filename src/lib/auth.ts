import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { createClient } from '@/lib/supabase/server';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }) {
      const supabase = createClient();
      await supabase.from('profiles').upsert(
        { id: user.id, name: user.name, avatar_url: user.image },
        { onConflict: 'id' }
      );
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        const supabase = createClient();
        const { data } = await supabase
          .from('profiles').select('role').eq('id', user.id).maybeSingle();
        token.role = (data?.role as string) ?? 'student';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = (token.role as string) ?? 'student';
      }
      return session;
    },
  },
};
