import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react'
import type { PanInfo } from 'motion/react'
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react'
import { type RefObject, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { colorAccentBlue500, colorPrimary500, colorSystemError500 } from '@/styles/generated-colors'
import moocaHappy from '@/assets/mascot/mooca-happy.svg'
import moocaHugging from '@/assets/mascot/mooca-hugging.svg'
import moocaUsingPhone from '@/assets/mascot/mooca-using-phone.svg'
import { useFrozenSessionValue, useSessionStore } from '@/store/session'
import type { Category, Thought } from '@/store/session'
import './sort.css'

const dragColors = [
  colorSystemError500,
  colorAccentBlue500,
  colorPrimary500,
]

function cardTextSizeClass(text: string) {
  if (text.length > 100) return 'sort-deck__card--compact'
  if (text.length > 75) return 'sort-deck__card--condensed'
  return ''
}

export function SortScreen() {
  const thoughts = useFrozenSessionValue((state) => state.thoughts)
  const pending = thoughts.filter((thought) => thought.category === null)
  const current = pending[0]
  const headingRef = useRef<HTMLHeadingElement>(null)

  useLayoutEffect(() => {
    headingRef.current?.focus({ preventScroll: true })
  }, [])

  return current ? <SortTurn key={current.id} current={current} remaining={pending.length} total={thoughts.length} headingRef={headingRef} /> : null
}

function SortTurn({ current, remaining, total, headingRef }: { current: Thought; remaining: number; total: number; headingRef: RefObject<HTMLHeadingElement | null> }) {
  const categorizeThought = useSessionStore((state) => state.categorizeThought)
  const undoLastDecision = useSessionStore((state) => state.undoLastDecision)
  const history = useFrozenSessionValue((state) => state.history)
  const canUndo = history.length > 0
  const reduceMotion = useReducedMotion()
  const [busy, setBusy] = useState(false)
  const [dragging, setDragging] = useState(false)
  const locked = useRef(false)
  const mounted = useRef(true)
  const animation = useRef<ReturnType<typeof animate> | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-135, 0, 135], reduceMotion ? [0, 0, 0] : [-12, 0, 12])
  const color = useTransform(x, [-120, 0, 120], dragColors)
  const shadow = useTransform(x, (offset) => {
    const strength = Math.min(Math.abs(offset) / 120, 1)
    const shadowColor = offset < 0
      ? 'var(--color-system-error-500)'
      : offset > 0 ? 'var(--color-primary-500)' : 'var(--color-accent-blue-500)'
    return `0 ${8 + 10 * strength}px ${12 + 14 * strength}px color-mix(in srgb, ${shadowColor} ${9 + 16 * strength}%, transparent)`
  })

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      animation.current?.stop()
    }
  }, [])

  async function choose(category: Category) {
    if (locked.current) return
    locked.current = true
    setBusy(true)
    animation.current?.stop()
    if (!reduceMotion) {
      const distance = window.innerWidth + (cardRef.current?.offsetWidth ?? 500)
      const direction = category === 'rest-it-here' ? -1 : 1
      const departure = direction * Math.max(150, direction * x.get())
      animation.current = animate(x, [x.get(), departure, direction * distance], {
        duration: 0.42, times: [0, 0.45, 1], ease: 'easeIn',
      })
      await animation.current
    }
    if (mounted.current) categorizeThought(current.id, category)
  }

  function handleDragEnd(_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    setDragging(false)
    if (locked.current) return
    const threshold = Math.max(80, Math.min((cardRef.current?.offsetWidth ?? 400) * 0.25, 120))
    const distance = Math.abs(info.offset.x)
    if (distance >= threshold || (distance >= 40 && Math.abs(info.velocity.x) >= 600)) {
      void choose(info.offset.x < 0 ? 'rest-it-here' : 'in-my-hands')
    } else {
      animation.current = animate(x, 0, reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 360, damping: 30 })
    }
  }

  return (
    <section className="sort-screen" aria-labelledby="sort-title">
      <div className="sort-screen__intro">
        <h1 ref={headingRef} id="sort-title" tabIndex={-1}>What's in your hands right now?</h1>
        <p>There are no wrong answers. You can bring a card back anytime.</p>
      </div>
      <div className="sort-screen__scene">
        <div className="sort-screen__mascot sort-screen__mascot--left" aria-hidden="true"><img src={moocaHugging} alt="" /></div>
        <div className="sort-screen__center">
          <img className="sort-screen__mobile-mascot" src={moocaUsingPhone} alt="" aria-hidden="true" />
          <div className={`sort-deck ${remaining === 1 ? 'sort-deck--last' : ''}`} aria-label={`${remaining} ${remaining === 1 ? 'card' : 'cards'} left to sort`}>
            {remaining > 1 && <div className="sort-deck__underlay" aria-hidden="true" />}
            <motion.div
              key={current.id}
              ref={cardRef}
              className={`sort-deck__card ${cardTextSizeClass(current.text)}`}
              role="group"
              aria-label={`Card ${total - remaining + 1} of ${total}`}
              aria-live="polite"
              aria-atomic="true"
              style={{ x, rotate, color, borderColor: color, boxShadow: shadow }}
              drag={busy ? false : 'x'}
              dragMomentum={false}
              onDragStart={() => { animation.current?.stop(); setDragging(true) }}
              onDragEnd={handleDragEnd}
              initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.18 }}
            ><span>{current.text}</span></motion.div>
          </div>
        </div>
        <div className="sort-screen__mascot sort-screen__mascot--right" aria-hidden="true"><img src={moocaHappy} alt="" /></div>
      </div>
      <div className="sort-screen__actions">
        <div className="sort-screen__undo-slot">
          {canUndo && <button type="button" className="sort-screen__undo" disabled={busy || dragging} onClick={() => { if (!locked.current) undoLastDecision() }}><RotateCcw size={16} aria-hidden="true" />Bring it back</button>}
        </div>
        <p>Swipe the card or choose the space that feels right today.</p>
        <div className="sort-screen__buttons">
          <button type="button" className="sort-screen__button sort-screen__button--rest" onClick={() => void choose('rest-it-here')} disabled={busy || dragging}>
            <ArrowLeft size={21} strokeWidth={1.8} aria-hidden="true" />
            Rest It Here
          </button>
          <button type="button" className="sort-screen__button sort-screen__button--hands" onClick={() => void choose('in-my-hands')} disabled={busy || dragging}>
            In My Hands
            <ArrowRight size={21} strokeWidth={1.8} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  )
}
