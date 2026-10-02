import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Check, RotateCcw } from 'lucide-react'
import toocaLogo from '@/assets/brand/tooca-logo.svg'
import { SetupScreen } from '@/features/setup/SetupScreen'
import { SortScreen } from '@/features/sort/SortScreen'
import { useSessionStore } from '@/store/session'
import './features/flow/flow.css'

function StepIndicator({ phase }: { phase: 'setup' | 'sort' | 'reflection' }) {
  const returnToSetup = useSessionStore((state) => state.returnToSetup)
  const firstDone = phase !== 'setup'
  const secondDone = phase === 'reflection'

  return (
    <nav aria-label="Progress" className="step-indicator">
      <button
        className={`step-indicator__step ${firstDone ? 'is-complete' : 'is-current'}`}
        type="button"
        aria-current={phase === 'setup' ? 'step' : undefined}
        onClick={returnToSetup}
      >
        <span className="step-indicator__number">{firstDone ? <Check size={12} aria-hidden="true" /> : '1'}</span>
        <span>Add cards</span>
      </button>
      <span className="step-indicator__line" aria-hidden="true" />
      <span
        className={`step-indicator__step ${secondDone ? 'is-complete' : phase === 'sort' ? 'is-current' : 'is-upcoming'}`}
        aria-current={phase === 'sort' ? 'step' : undefined}
      >
        <span className="step-indicator__number">{secondDone ? <Check size={12} aria-hidden="true" /> : '2'}</span>
        <span>Sort cards</span>
      </span>
    </nav>
  )
}

function ReflectionHandoff() {
  const resetSession = useSessionStore((state) => state.resetSession)
  return (
    <section className="handoff-screen" aria-labelledby="reflection-heading">
      <div>
        <p className="handoff-screen__eyebrow">Your reflection</p>
        <h1 id="reflection-heading">All sorted, for now.</h1>
        <p>You can begin again whenever you like.</p>
        <button type="button" onClick={resetSession} className="handoff-screen__back">
          <RotateCcw size={18} aria-hidden="true" /> Begin again
        </button>
      </div>
    </section>
  )
}

function App() {
  const phase = useSessionStore((state) => state.phase)
  const reduceMotion = useReducedMotion()

  return (
    <div className="flow-shell">
      <header className="flow-header">
        <div className="flow-header__inner">
          <a href="#main" aria-label="Tooca, skip to main content" className="flow-header__logo">
            <img src={toocaLogo} width="93" height="32" alt="Tooca" />
          </a>
          <StepIndicator phase={phase} />
        </div>
      </header>
      <main id="main" className={`flow-main ${phase === 'sort' ? 'flow-main--sort' : ''}`}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={phase}
            className="flow-stage"
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            {phase === 'setup' ? (
              <SetupScreen />
            ) : phase === 'sort' ? (
              <SortScreen />
            ) : (
              <ReflectionHandoff />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}

export default App
