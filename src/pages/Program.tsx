import { useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Modal } from '../components/Modal';
import { Tabs } from '../components/Tabs';
import { DayCard } from '../components/DayCard';
import { useProfile } from '../hooks/useProfile';
import { PROFILE_CONFIG, buildPrinciples } from '../features/program/profileConfig';
import { PHASE_BUILDERS } from '../features/program/builders';
import { buildSchedule } from '../features/program/schedules';
import type { Exercise, Objective, Level } from '../types';

const OBJECTIVE_LABELS: Record<Objective, string> = {
  muscle: 'MUSCLE',
  fat: 'PERTE DE GRAS',
  endurance: 'ENDURANCE',
  balance: 'ÉQUILIBRE',
};

const LEVEL_LABELS: Record<Level, string> = {
  beginner: 'DÉBUTANT',
  intermediate: 'INTERMÉDIAIRE',
  advanced: 'AVANCÉ',
};

const CONSTRAINT_LABELS: Record<string, string> = {
  noise: 'Sans bruit',
  injury: 'Mouvements contrôlés',
  none: 'Sans contrainte',
};

export function Program() {
  const navigate = useNavigate();
  const { profile, isComplete, loading, resetProfile } = useProfile();
  const [modalExercise, setModalExercise] = useState<Exercise | null>(null);

  const hasProfile = Boolean(
    isComplete && profile.objective && profile.level
  );

  const conf = useMemo(() => {
    if (!hasProfile || !profile.objective) return null;
    return PROFILE_CONFIG[profile.objective];
  }, [hasProfile, profile.objective]);

  const objLabel = useMemo(() => {
    if (!hasProfile || !profile.objective) return '';
    return OBJECTIVE_LABELS[profile.objective];
  }, [hasProfile, profile.objective]);

  const levelLabel = useMemo(() => {
    if (!hasProfile || !profile.level) return '';
    return LEVEL_LABELS[profile.level];
  }, [hasProfile, profile.level]);

  const phases = useMemo(() => {
    if (!hasProfile || !conf || !profile.level) {
      return { p1: [], p2: [] };
    }

    return {
      p1: PHASE_BUILDERS[conf.phases[0]](profile.level, profile.constraints),
      p2: PHASE_BUILDERS[conf.phases[1]](profile.level, profile.constraints),
    };
  }, [hasProfile, conf, profile.level, profile.constraints]);

  const schedule = useMemo(() => {
    if (!hasProfile || !profile.objective) return [];
    return buildSchedule(profile.objective);
  }, [hasProfile, profile.objective]);

  const principles = useMemo(() => {
    if (!hasProfile || !profile.objective) return [];
    return buildPrinciples(profile.objective);
  }, [hasProfile, profile.objective]);

  async function handleReset() {
    await resetProfile();
    navigate('/');
  }

  if (loading) {
    return (
      <div className="shell">
        <Navbar />
        <section className="onboarding">
          <div className="onboarding-inner">
            <div className="onb-tag">Chargement de ton programme...</div>
          </div>
        </section>
      </div>
    );
  }

  if (!hasProfile || !conf) {
    return <Navigate to="/" replace />;
  }

  const pills = [
    `Objectif <strong>${objLabel}</strong>`,
    `Niveau <strong>${levelLabel}</strong>`,
    ...profile.constraints.map((c) => CONSTRAINT_LABELS[c] || c),
  ];

  const tabs = [
    {
      id: 'phase1',
      number: '01',
      label: 'Phase 1',
      content: (
        <>
          <div className="phase-banner">
            <div className="phase-banner-num">01</div>
            <div className="phase-banner-body">
              <h3>{conf.p1_title}</h3>
              <p>{conf.p1_sub}</p>
            </div>
          </div>
          <div className="days">
            {phases.p1.map((day) => (
              <DayCard key={day.letter} day={day} onExerciseClick={setModalExercise} />
            ))}
          </div>
        </>
      ),
    },
    {
      id: 'phase2',
      number: '02',
      label: 'Phase 2',
      content: (
        <>
          <div className="phase-banner p2">
            <div className="phase-banner-num">02</div>
            <div className="phase-banner-body">
              <h3>{conf.p2_title}</h3>
              <p>{conf.p2_sub}</p>
            </div>
          </div>
          <div className="days">
            {phases.p2.map((day) => (
              <DayCard key={day.letter} day={day} onExerciseClick={setModalExercise} />
            ))}
          </div>
        </>
      ),
    },
    {
      id: 'schedule',
      number: '03',
      label: 'Semaine type',
      content: (
        <>
          <div className="schedule">
            {schedule.map((s) => (
              <div key={s.day} className={`sched-day ${s.cls === 'rest' ? 'rest' : ''}`}>
                <div className="sched-day-name">{s.day}</div>
                <div className={`sched-day-type ${s.cls}`}>{s.type}</div>
                <div className="sched-day-dur">{s.dur}</div>
              </div>
            ))}
          </div>

          <div className="timeline-wrap">
            <h3>Anatomie des 45 minutes</h3>
            <div className="timeline">
              <div className="tl-slot warm">
                <div className="tl-time">05'</div>
                <div className="tl-name">Échauffement</div>
              </div>
              <div className="tl-bar warm"></div>
              <div className="tl-slot">
                <div className="tl-time">35'</div>
                <div className="tl-name">Bloc principal</div>
              </div>
              <div className="tl-bar"></div>
              <div className="tl-slot cool">
                <div className="tl-time">05'</div>
                <div className="tl-name">Retour au calme</div>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'principles',
      number: '04',
      label: 'Principes',
      content: (
        <div className="principles">
          {principles.map((p) => (
            <article key={p.n} className="principle">
              <div className="principle-num">{p.n}</div>
              <h4 dangerouslySetInnerHTML={{ __html: p.title }} />
              <p dangerouslySetInnerHTML={{ __html: p.text }} />
            </article>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="shell">
      <Navbar meta={`${objLabel} · ${levelLabel}`} showReset onReset={handleReset} />

      <header className="hero">
        <div className="hero-tag">
          <span>Programme personnalisé</span>
          <span className="hero-tag-pill">{objLabel} · {levelLabel}</span>
        </div>

        <h1 dangerouslySetInnerHTML={{ __html: conf.hero_title }} />
        <p className="hero-sub" dangerouslySetInnerHTML={{ __html: conf.hero_sub }} />

        <div className="profile-pills">
          {pills.map((pill, i) => (
            <span key={i} className="profile-pill" dangerouslySetInnerHTML={{ __html: pill }} />
          ))}
        </div>

        <div className="stats">
          <div className="stat">
            <div className="stat-val">8<small>SEM</small></div>
            <div className="stat-label">Durée</div>
          </div>
          <div className="stat">
            <div className="stat-val">45<small>MIN</small></div>
            <div className="stat-label">Par séance</div>
          </div>
          <div className="stat">
            <div className="stat-val">{conf.sessions}<small>×</small></div>
            <div className="stat-label">Séances / sem.</div>
          </div>
          <div className="stat">
            <div className="stat-val">0<small>€</small></div>
            <div className="stat-label">Matériel</div>
          </div>
        </div>
      </header>

      <section className="main">
        <div className="section-head">
          <h2>
            Le <span className="italic">plan</span><br />complet.
          </h2>
          <p>
            Un programme construit pour ton profil. Deux phases progressives. Chaque semaine, tu pousses un peu plus.
          </p>
        </div>
        <Tabs items={tabs} />
      </section>

      <footer className="manifesto">
        <p className="manifesto-text" dangerouslySetInnerHTML={{ __html: conf.manifesto }} />
        <div className="manifesto-sig">Coach · Programme IRON 45</div>
      </footer>

      <Modal exercise={modalExercise} onClose={() => setModalExercise(null)} />
    </div>
  );
}