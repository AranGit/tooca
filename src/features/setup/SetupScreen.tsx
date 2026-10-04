import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowRight, Plus, X } from 'lucide-react'
import { useLayoutEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import moocaWelcome from '@/assets/mascot/mooca-welcome.png'
import moocaUsingPhone from '@/assets/mascot/mooca-using-phone.svg'
import { useFrozenSessionValue, useSessionStore } from '@/store/session'
import { pickExamples, WORRY_EXAMPLES } from './examples'

function cardCountLabel(count: number) {
  if (count === 0) return 'Add a thought to continue'
  return `Let's sort these ${count} ${count === 1 ? 'thing' : 'things'}`
}

const thoughtCharacterLimit = 150

export function SetupScreen({ shouldFocusHeading = false }: { shouldFocusHeading?: boolean }) {
  const [draft, setDraft] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const reduceMotion = useReducedMotion()
  const thoughts = useFrozenSessionValue((state) => state.thoughts)
  const addThought = useSessionStore((state) => state.addThought)
  const addThoughts = useSessionStore((state) => state.addThoughts)
  const removeThought = useSessionStore((state) => state.removeThought)
  const startSorting = useSessionStore((state) => state.startSorting)
  const existingTexts = new Set(thoughts.map((thought) => thought.text.trim().toLocaleLowerCase()))
  const examplesExhausted = WORRY_EXAMPLES.every(
    (example) => existingTexts.has(example.toLocaleLowerCase()),
  )

  useLayoutEffect(() => {
    if (shouldFocusHeading) headingRef.current?.focus({ preventScroll: true })
  }, [shouldFocusHeading])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!draft.trim()) return
    addThought(draft)
    setDraft('')
    inputRef.current?.focus()
  }

  function handleExamples() {
    const picked = pickExamples(thoughts.map((thought) => thought.text), 1)
    if (picked.length > 0) addThoughts(picked)
  }

  return (
    <section className="setup-screen" aria-labelledby="setup-title">
      <div className="setup-intro">
        <div className="setup-intro__copy">
          <h1 ref={headingRef} id="setup-title" tabIndex={-1}>What's on your mind<br className="desktop-break" /> right now?</h1>
          <p>Take your time, let's lay them out one by one.</p>
        </div>
        <img
          className="setup-intro__mascot"
          src={moocaWelcome}
          width="1254"
          height="1254"
          alt="Mooca waving beside a smiling sun"
        />
      </div>

      <div className="setup-workspace">
        <form className="thought-form" onSubmit={handleSubmit}>
          <div className="thought-form__heading">
            <label htmlFor="thought-input">What's on your mind?</label>
            <img
              className="setup-workspace__mascot"
              src={moocaUsingPhone}
              width="210"
              height="172"
              alt="Mooca holding a phone while thoughts float nearby"
            />
          </div>
          <input
            id="thought-input"
            ref={inputRef}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Just a few words is fine..."
            maxLength={thoughtCharacterLimit}
            aria-describedby="thought-character-count"
            autoComplete="off"
          />
          <p id="thought-character-count" className="thought-form__character-count">
            {draft.length} / {thoughtCharacterLimit} characters
          </p>
          <button
            type="submit"
            className="thought-form__add"
            disabled={!draft.trim()}
          >
            <Plus size={24} strokeWidth={1.8} aria-hidden="true" />
            Add another
          </button>
        </form>

        <button
          className="examples-button"
          type="button"
          onClick={handleExamples}
          disabled={examplesExhausted}
        >
          {examplesExhausted ? 'All examples added' : 'Try with examples'}
        </button>

        <div className="thought-list-wrap">
          <ul className="thought-list" aria-label="Your thoughts">
            <AnimatePresence initial={false}>
              {thoughts.toReversed().map((thought) => (
                <motion.li
                  key={thought.id}
                  layout={!reduceMotion}
                  initial={reduceMotion ? false : { opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, x: 24 }}
                  transition={{ duration: 0.18 }}
                  className="thought-card"
                >
                  <span>{thought.text}</span>
                  <button
                    type="button"
                    aria-label={`Remove: ${thought.text}`}
                    onClick={() => removeThought(thought.id)}
                  >
                    <X size={19} strokeWidth={1.8} aria-hidden="true" />
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>

        <button
          type="button"
          className="setup-next"
          disabled={thoughts.length === 0}
          onClick={startSorting}
        >
          <span>{cardCountLabel(thoughts.length)}</span>
          <ArrowRight size={21} strokeWidth={1.8} aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}
