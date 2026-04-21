import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export function useDisplayName(): string | null {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setDisplayName(null);
      return;
    }

    // On lit d'abord depuis user_metadata (instant, déjà en mémoire)
    const fromMetadata = user.user_metadata?.display_name as string | undefined;
    if (fromMetadata) {
      setDisplayName(fromMetadata);
      return;
    }

    // Fallback : on va le chercher dans la table profiles
    supabase
      .from('profiles')
      .select('display_name')
      .eq('user_id', user.id)
      .single()
      .then(({ data }) => {
        if (data?.display_name) setDisplayName(data.display_name);
      });
  }, [user]);

  return displayName;
}