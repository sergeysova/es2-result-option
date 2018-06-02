/* eslint-disable no-magic-numbers, no-unused-vars, id-match */
/* eslint-disable one-var, one-var-declaration-per-line */
import test from 'ava'

import { Option, Some, None, Ok, Err } from '../index'


test('okOr :: (Option f, Result t) => f a ~> b -> t a b', (t) => {
  t.true(Some(2).okOr('foo').isOk())
  t.is(Some(2).okOr('foo').unwrap(), 2)
  t.true(None().okOr('foo').isErr())
  t.is(None().okOr('foo').unwrapErr(), 'foo')
})

test('okOrElse :: (Option f, Result t) => f a ~> (() -> b) -> t a b', (t) => {
  const get = () => 5

  t.true(Some(4).okOrElse(get).isOk())
  t.is(Some(4).okOrElse(get).unwrap(), 4)
  t.true(None().okOrElse(get).isErr())
  t.is(None().okOrElse(get).unwrapErr(), 5)
})

test('ok :: (Result f, Option t) => Result f a b ~> t a', (t) => {
  t.true(Ok(1).ok().isSome())
  t.is(Ok(2).ok().unwrap(), 2)
  t.true(Err(12).ok().isNone())
})

test('err :: (Result f, Option t) => Result f a b ~> t b', (t) => {
  t.true(Err(1).err().isSome())
  t.is(Err(2).err().unwrap(), 2)
  t.true(Ok(12).err().isNone())
})
