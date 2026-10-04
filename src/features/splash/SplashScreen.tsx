import { motion, useReducedMotion } from 'motion/react'
import { useEffect } from 'react'
import './splash.css'

const SPLASH_DURATION_MS = 1800

interface SplashScreenProps {
  onFinish: () => void
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const timer = window.setTimeout(onFinish, reduceMotion ? 120 : SPLASH_DURATION_MS)
    return () => window.clearTimeout(timer)
  }, [onFinish, reduceMotion])

  return (
    <motion.div
      className="splash-screen"
      data-testid="splash-screen"
      aria-hidden="true"
      initial={false}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.24 }}
    >
      <motion.div
        className="splash-screen__content"
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="splash-screen__mark" aria-hidden="true">
          <span className="splash-screen__halo splash-screen__halo--coral" />
          <span className="splash-screen__halo splash-screen__halo--blue" />
          <motion.img
            src="/favicon.svg"
            alt=""
            initial={reduceMotion ? false : { opacity: 0, rotate: -10, scale: 0.78, y: 14 }}
            animate={{ opacity: 1, rotate: 0, scale: 1, y: 0 }}
            transition={{ delay: reduceMotion ? 0 : 0.1, duration: 0.68, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}
