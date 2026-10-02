import { motion, useReducedMotion } from 'motion/react'
import type { HTMLMotionProps } from 'motion/react'
import type { ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary'

export interface ButtonProps extends HTMLMotionProps<'button'> {
  children: ReactNode
  variant?: ButtonVariant
}

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-primary-500 text-gray-900 shadow-elevation-02 hover:bg-primary-600 active:bg-primary-700',
  secondary: 'border border-primary-500 bg-gray-0 text-gray-turquoise-300 hover:bg-primary-50 active:bg-primary-100',
}

export function Button({ children, className = '', disabled, variant = 'primary', ...props }: ButtonProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.button
      whileHover={disabled || reduceMotion ? undefined : { y: -2 }}
      whileTap={disabled || reduceMotion ? undefined : { scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 500, damping: 32 }}
      className={`inline-flex min-h-12 items-center justify-center rounded-sm px-6 text-button-small transition-colors disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600 disabled:shadow-none ${variants[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  )
}
