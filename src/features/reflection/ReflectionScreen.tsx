import moocaHappy from '@/assets/mascot/mooca-happy.svg';
import moocaHugging from '@/assets/mascot/mooca-hugging.svg';
import moocaThanks from '@/assets/mascot/mooca-thanks.svg';
import type { Thought } from '@/store/session';
import { useFrozenSessionValue, useSessionStore } from '@/store/session';
import { Check, ChevronDown, Clock3, RotateCcw } from 'lucide-react';
import { useLayoutEffect, useRef, useState } from 'react';
import './reflection.css';

type Group = 'hands' | 'rest'

interface SummaryGroupProps {
  group: Group
  title: string
  thoughts: Thought[]
  open: boolean
  onToggle: () => void
}

function SummaryGroup({ group, title, thoughts, open, onToggle }: SummaryGroupProps) {
  const headingId = `reflection-${group}-heading`
  const panelId = `reflection-${group}-panel`
  const countLabel = `${thoughts.length} ${thoughts.length === 1 ? 'card' : 'cards'}`

  return (
    <div className={`reflection-group reflection-group--${group}`}>
      <button
        id={headingId}
        type="button"
        className="reflection-group__toggle"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`${title}, ${countLabel}`}
        onClick={onToggle}
      >
        <span className="reflection-group__icon" aria-hidden="true">
          {group === 'hands' ? <Check size={17} strokeWidth={2.2} /> : <Clock3 size={17} strokeWidth={2.2} />}
        </span>
        <span className="reflection-group__title">{title}</span>
        <span className="reflection-group__count">{countLabel}</span>
        <ChevronDown className={`reflection-group__chevron ${open ? 'is-open' : ''}`} size={26} strokeWidth={2.2} aria-hidden="true" />
      </button>

      <div id={panelId} role="region" aria-labelledby={headingId} className="reflection-group__panel" hidden={!open}>
        {thoughts.length > 0 ? (
          <ol className="reflection-group__list">
            {thoughts.map((thought, index) => (
              <li key={thought.id} className="reflection-group__card">
                <span className="reflection-group__number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <span>{thought.text}</span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="reflection-group__empty">No cards here for now.</p>
        )}
      </div>
    </div>
  )
}

export function ReflectionScreen() {
  const thoughts = useFrozenSessionValue((state) => state.thoughts)
  const history = useFrozenSessionValue((state) => state.history)
  const undoLastDecision = useSessionStore((state) => state.undoLastDecision)
  const resetSession = useSessionStore((state) => state.resetSession)
  const [openGroups, setOpenGroups] = useState<Record<Group, boolean>>({ hands: true, rest: false })
  const headingRef = useRef<HTMLHeadingElement>(null)
  const hands = thoughts.filter((thought) => thought.category === 'in-my-hands')
  const rest = thoughts.filter((thought) => thought.category === 'rest-it-here')

  useLayoutEffect(() => {
    headingRef.current?.focus({ preventScroll: true })
  }, [])

  function toggle(group: Group) {
    setOpenGroups((current) => ({ ...current, [group]: !current[group] }))
  }

  let summaryState = {
    reflectionDescription: ['Some things are in your hands.', 'Others can rest here for now.'],
    moocaState: moocaThanks,
  }
  if (hands.length === 0) {
    summaryState = {
      reflectionDescription: ['These things can rest here for now.', 'You don\'t have to figure everything out today.'],
      moocaState: moocaHugging,
    }
  } else if (rest.length === 0) {
    summaryState = {
      reflectionDescription: ['These things are in your hands.', 'You can take them one at a time.'],
      moocaState: moocaHappy,
    }
  }

  return (
    <section className="reflection-screen" aria-labelledby="reflection-title">
      <div className="reflection-screen__intro">
        <div className="reflection-screen__copy">
          <h1 ref={headingRef} id="reflection-title" tabIndex={-1}>All sorted, for now.</h1>
          <p>{summaryState.reflectionDescription[0]}<br className="reflection-screen__mobile-break" /> {summaryState.reflectionDescription[1]}</p>
        </div>
        <img className="reflection-screen__mascot" src={summaryState.moocaState} alt="Mooca smiling with the sun" />
      </div>

      <div className="reflection-screen__groups">
        <SummaryGroup group="hands" title="In My Hands" thoughts={hands} open={openGroups.hands} onToggle={() => toggle('hands')} />
        <SummaryGroup group="rest" title="Rest It Here" thoughts={rest} open={openGroups.rest} onToggle={() => toggle('rest')} />
      </div>

      <div className="reflection-screen__actions">
        <button type="button" className="reflection-screen__bring-back" disabled={history.length === 0} onClick={undoLastDecision}>
          <RotateCcw size={16} strokeWidth={1.8} aria-hidden="true" />
          Bring it back
        </button>
        <button type="button" className="reflection-screen__begin-again" onClick={resetSession}>Clear & Begin again</button>
      </div>
    </section>
  )
}
