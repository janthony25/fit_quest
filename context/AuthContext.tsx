import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export type Character = {
  id: string;
  name: string;
  class: 'Knight' | 'Barbarian' | 'Assassin';
  level: number;
  experience: number;
  strength: number;
  dexterity: number;
  intelligence: number;
  physical_attack: number;
  physical_defense: number;
  mentality: number;
};

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  character: Character | null;
  hasCharacter: boolean;
  refreshCharacter: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  character: null,
  hasCharacter: false,
  refreshCharacter: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [character, setCharacter] = useState<Character | null>(null);

  async function fetchCharacter(userId: string) {
    const { data } = await supabase
      .from('characters')
      .select('id, name, class, level, experience, strength, dexterity, intelligence, physical_attack, physical_defense, mentality')
      .eq('user_id', userId)
      .single();
    setCharacter(data ?? null);
  }

  async function refreshCharacter() {
    if (session?.user) await fetchCharacter(session.user.id);
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchCharacter(session.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchCharacter(session.user.id);
      } else {
        setCharacter(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{
      session,
      user: session?.user ?? null,
      loading,
      character,
      hasCharacter: !!character,
      refreshCharacter,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
