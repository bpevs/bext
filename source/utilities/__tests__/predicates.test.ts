import { assertStrictEquals } from '@std/assert'
import { it } from '@std/testing/bdd'

import { isChrome, isDeno, isFirefox } from '../predicates.ts'

it('should check if context is chromium', () => {
  assertStrictEquals(isChrome(), false)
})

it('should check if context is firefox', () => {
  assertStrictEquals(isFirefox(), false)
})

it('should check if context is test env', () => {
  assertStrictEquals(isDeno(), true)
})
