import { useState, useCallback, useEffect } from 'react';
import type { Profile } from '../types';

const STORAGE_KEY = 'iron45_profile';

const EMPTY_PROFILE: Profile = {
  objective: null,
  level: null,
  constraints: [],
};

function loadProfile(): Profile {
  if (typeof window === 'undefined') return EMPTY_PROFILE;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return EMPTY_PROFILE;
    const parsed = JSON.parse(saved) as Profile;
    if (parsed && parsed.objective && parsed.level) return parsed;
    return EMPTY_PROFILE;
  } catch {
    return EMPTY_PROFILE;
  }
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile>(loadProfile);

  const isComplete = Boolean(profile.objective && profile.level);

  useEffect(() => {
    if (isComplete) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    }
  }, [profile, isComplete]);

  const saveProfile = useCallback((newProfile: Profile) => {
    setProfile(newProfile);
  }, []);

  const resetProfile = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setProfile(EMPTY_PROFILE);
  }, []);

  return { profile, isComplete, saveProfile, resetProfile };
}