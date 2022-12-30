import { assertStrictEquals } from 'std/testing/asserts.ts';
import { it } from 'std/testing/bdd.ts';

import { isChrome, isDeno, isFirefox } from '../predicates.ts';

it('should check if context is chromium', () => {
  assertStrictEquals(isChrome(), false);
});

it('should check if context is firefox', () => {
  assertStrictEquals(isFirefox(), false);
});

it('should check if context is test env', () => {
  assertStrictEquals(isDeno(), true);
});
