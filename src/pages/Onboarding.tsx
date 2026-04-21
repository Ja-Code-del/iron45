import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDisplayName } from '../hooks/useDisplayName';
import { Navbar } from '../components/Navbar';
import { useProfile } from '../hooks/useProfile';
import type { Objective, Level, Constraint, Profile } from '../types';

interface Option<T extends string> {
  value: T;
  label: string;
  desc: string;
}

const OBJECTIVES: Option<Objective>[] = [
  { value: 'muscle',    label: 'Gagner du muscle', desc: 'Hypertrophie, volume, définition.' },
  { value: 'fat',       label: 'Perdre du gras',   desc: 'Dépense calorique, circuits courts.' },
  { value: 'endurance', label: 'Endurance',        desc: 'Capacité cardio-musculaire.' },
  { value: 'balance',   label: 'Équilibre général', desc: 'Fitness complet, santé, forme.' },
];

const LEVELS: Option<Level>[] = [
  { value: 'beginner',     label: 'Débutant',      desc: "Peu ou pas d'entraînement régulier." },
  { value: 'intermediate', label: 'Intermédiaire', desc: 'Sport occasionnel, bonnes bases.' },
  { value: 'advanced',     label: 'Avancé',        desc: 'Entraînement régulier, technique solide.' },
];

const CONSTRAINTS: Option<Constraint>[] = [
  { value: 'noise',  label: 'Éviter le bruit',       desc: "Pas de sauts, pas d'impact." },
  { value: 'injury', label: 'Douleurs / blessures',  desc: "Mouvements contrôlés, pas d'à-coups." },
  { value: 'none',   label: 'Aucune contrainte',     desc: 'Programme classique.' },
];

export function Onboarding() {
  const navigate = useNavigate();
  const { saveProfile } = useProfile();
  const displayName = useDisplayName();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [objective, setObjective] = useState<Objective | null>(null);
  const [level, setLevel] = useState<Level | null>(null);
  const [constraints, setConstraints] = useState<Constraint[]>([]);

  function toggleConstraint(value: Constraint) {
    if (value === 'none') {
      setConstraints(['none']);
      return;
    }
    setConstraints((prev) => {
      const without = prev.filter((c) => c !== 'none');
      if (without.includes(value)) return without.filter((c) => c !== value);
      return [...without, value];
    });
  }

  function next() {
    if (step < 3) setStep((step + 1) as 1 | 2 | 3);
  }

  function prev() {
    if (step > 1) setStep((step - 1) as 1 | 2 | 3);
  }

  function finish() {
    if (!objective || !level) return;
    const finalConstraints = constraints.length === 0 ? (['none'] as Constraint[]) : constraints;
    const profile: Profile = { objective, level, constraints: finalConstraints };
    saveProfile(profile);
    navigate('/program');
  }

  const canAdvance =
    (step === 1 && !!objective) ||
    (step === 2 && !!level) ||
    step === 3;

  return (
    <div className="shell">
      <Navbar meta="Configuration" />
      <section className="onboarding">
        <div className="onboarding-inner">
            <div className="onb-tag">
                {displayName ? `Bienvenue, ${displayName}` : 'Configuration du programme'}
            </div>
            <h2 className="onb-title">
                Trouve<br />
                ton <span className="italic">plan</span>.
            </h2>
          <p className="onb-sub">
            Trois questions pour adapter le programme à ton objectif, ton niveau, et tes contraintes.{' '}
            <em>Quarante-cinq secondes, et tu commences demain matin.</em>
          </p>

          <div className="onb-progress">
            <span>Étape {step} / 3</span>
            <div className="onb-progress-dots">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className={`onb-dot ${n < step ? 'done' : n === step ? 'current' : ''}`}
                />
              ))}
            </div>
          </div>

          {step === 1 && (
            <div className="onb-step" key="step1">
              <div className="onb-q-num">QUESTION 01</div>
              <h3 className="onb-q">
                Quel est ton <span className="italic">objectif</span> principal ?
              </h3>
              <div className="onb-options">
                {OBJECTIVES.map((opt) => (
                  <button
                    key={opt.value}
                    className={`onb-option ${objective === opt.value ? 'selected' : ''}`}
                    onClick={() => setObjective(opt.value)}
                  >
                    <span className="onb-option-check"></span>
                    <div className="onb-option-label">{opt.label}</div>
                    <div className="onb-option-desc">{opt.desc}</div>
                  </button>
                ))}
              </div>
              <div className="onb-nav">
                <div></div>
                <button className="onb-btn" disabled={!canAdvance} onClick={next}>
                  Continuer →
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="onb-step" key="step2">
              <div className="onb-q-num">QUESTION 02</div>
              <h3 className="onb-q">
                Quel est ton <span className="italic">niveau</span> actuel ?
              </h3>
              <div className="onb-options">
                {LEVELS.map((opt) => (
                  <button
                    key={opt.value}
                    className={`onb-option ${level === opt.value ? 'selected' : ''}`}
                    onClick={() => setLevel(opt.value)}
                  >
                    <span className="onb-option-check"></span>
                    <div className="onb-option-label">{opt.label}</div>
                    <div className="onb-option-desc">{opt.desc}</div>
                  </button>
                ))}
              </div>
              <div className="onb-nav">
                <button className="onb-btn onb-btn-back" onClick={prev}>
                  ← Retour
                </button>
                <button className="onb-btn" disabled={!canAdvance} onClick={next}>
                  Continuer →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="onb-step" key="step3">
              <div className="onb-q-num">QUESTION 03</div>
              <h3 className="onb-q">
                Des <span className="italic">contraintes</span> ?
              </h3>
              <div className="onb-hint">Sélection multiple possible.</div>
              <div className="onb-options">
                {CONSTRAINTS.map((opt) => (
                  <button
                    key={opt.value}
                    className={`onb-option ${constraints.includes(opt.value) ? 'selected' : ''}`}
                    onClick={() => toggleConstraint(opt.value)}
                  >
                    <span className="onb-option-check"></span>
                    <div className="onb-option-label">{opt.label}</div>
                    <div className="onb-option-desc">{opt.desc}</div>
                  </button>
                ))}
              </div>
              <div className="onb-nav">
                <button className="onb-btn onb-btn-back" onClick={prev}>
                  ← Retour
                </button>
                <button className="onb-btn" onClick={finish}>
                  Générer mon plan →
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}