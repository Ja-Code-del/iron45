import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface UseDisplayNameReturn {
  displayName: string | null;
  isSet: boolean;
  loading: boolean;
  refresh: () => Promise<void>;
}

export function useDisplayName(): UseDisplayNameReturn {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [isSet, setIsSet] = useState(false);
  const [loading, setLoading] = useState(true);

  async function fetchProfile() {
    if (!user) {
      setDisplayName(null);
      setIsSet(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data } = await supabase
      .from('profiles')
      .select('display_name, display_name_is_set')
      .eq('user_id', user.id)
      .single();

    if (data) {
      setDisplayName(data.display_name);
      setIsSet(data.display_name_is_set);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return { displayName, isSet, loading, refresh: fetchProfile };
}