import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Check } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import toocaLogo from '@/assets/brand/tooca-logo.svg'
import { ReflectionScreen } from '@/features/reflection/ReflectionScreen'
import { SetupScreen } from '@/features/setup/SetupScreen'
import { SplashScreen } from '@/features/splash/SplashScreen'
import { SortScreen } from '@/features/sort/SortScreen'
import { useSessionStore } from '@/store/session'
import './features/flow/flow.css'

const SPLASH_SESSION_KEY = 'tooca-splash-seen'

function shouldShowSplash(): boolean {
  try {
    return sessionStorage.getItem(SPLASH_SESSION_KEY) !== 'true'
  } catch {
    return true
  }
}

function markSplashSeen() {
  try {
    sessionStorage.setItem(SPLASH_SESSION_KEY, 'true')
  } catch {
    // Continue without persistence when browser storage is unavailable.
  }
}

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
      <span className={`step-indicator__line${firstDone ? ' is-complete' : ''}`} aria-hidden="true" />
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

function App() {
  const phase = useSessionStore((state) => state.phase)
  const reduceMotion = useReducedMotion()
  const previousPhase = useRef(phase)
  const [shouldFocusHeading, setShouldFocusHeading] = useState(false)
  const [showSplash, setShowSplash] = useState(shouldShowSplash)
  const splashMarked = useRef(false)

  useEffect(() => {
    if (showSplash && !splashMarked.current) {
      markSplashSeen()
      splashMarked.current = true
    }
  }, [showSplash])

  useEffect(() => {
    if (previousPhase.current !== phase) {
      previousPhase.current = phase
      setShouldFocusHeading(true)
    }
  }, [phase])

  return (
    <>
      <div className={`flow-shell ${phase === 'reflection' ? 'flow-shell--reflection' : ''}`}>
        <header className="flow-header">
          <div className="flow-header__inner">
            <a href="#main" aria-label="Tooca, skip to main content" className="flow-header__logo">
              <img src={toocaLogo} width="93" height="32" alt="Tooca" />
            </a>
            <StepIndicator phase={phase} />
          </div>
        </header>
        <main id="main" className="flow-main">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={phase}
              className={`flow-stage flow-stage--${phase}`}
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
            >
              {phase === 'setup' ? (
                <SetupScreen shouldFocusHeading={shouldFocusHeading} />
              ) : phase === 'sort' ? (
                <SortScreen shouldFocusHeading={shouldFocusHeading} />
              ) : (
                <ReflectionScreen shouldFocusHeading={shouldFocusHeading} />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <AnimatePresence>{showSplash ? <SplashScreen onFinish={() => setShowSplash(false)} /> : null}</AnimatePresence>
    </>
  )
}

export default App
