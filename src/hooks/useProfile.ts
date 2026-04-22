import { useEffect, useState, useCallback } from 'react';
import type { Profile } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  getActiveProgram,
  createProgram,
  archiveActiveProgram,
} from '../features/program/programService';

const EMPTY_PROFILE: Profile = {
  objective: null,
  level: null,
  constraints: [],
};

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile>(EMPTY_PROFILE);
  const [loading, setLoading] = useState(true);

  // Charger le programme actif au montage / changement d'user
  useEffect(() => {
    if (!user) {
      setProfile(EMPTY_PROFILE);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    getActiveProgram(user.id).then((program) => {
      if (cancelled) return;
      if (program) {
        setProfile({
          objective: program.objective as Profile['objective'],
          level: program.level as Profile['level'],
          constraints: program.constraints as Profile['constraints'],
        });
      } else {
        setProfile(EMPTY_PROFILE);
      }
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [user]);

  // Cleanup de l'ancienne clé localStorage (migration one-shot)
  useEffect(() => {
    try {
      localStorage.removeItem('iron45_profile');
    } catch {
      // localStorage indisponible, on ignore
    }
  }, []);

  const isComplete = Boolean(profile.objective && profile.level);

  const saveProfile = useCallback(
    async (newProfile: Profile): Promise<boolean> => {
      if (!user || !newProfile.objective || !newProfile.level) return false;

      const program = await createProgram(user.id, {
        objective: newProfile.objective,
        level: newProfile.level,
        constraints: newProfile.constraints,
      });

      if (program) {
        setProfile(newProfile);
        return true;
      }
      return false;
    },
    [user]
  );

  const resetProfile = useCallback(async () => {
    if (!user) return;
    await archiveActiveProgram(user.id);
    setProfile(EMPTY_PROFILE);
  }, [user]);

  return { profile, isComplete, loading, saveProfile, resetProfile };
}