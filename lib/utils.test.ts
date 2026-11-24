import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('deduplicates tailwind classes according to twMerge', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })

  it('ignores falsy values', () => {
    expect(cn('foo', false && 'bar')).toBe('foo')
  })
})
