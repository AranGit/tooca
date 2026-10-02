import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('calls onClick when enabled', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Continue</Button>)
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button disabled onClick={onClick}>Continue</Button>)
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(onClick).not.toHaveBeenCalled()
  })
})
