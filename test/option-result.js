/* eslint-disable no-magic-numbers, no-unused-vars, id-match */
/* eslint-disable one-var, one-var-declaration-per-line */
import test from 'ava'

import { Option, Some, None, Ok, Err } from '../index'

// okOr :: Option f, Result t => f a ~> b -> t a b
test('Option..okOr', (t) => {
  t.deepEqual(Some.of(2).okOr('foo'), Ok.of(2))
  t.deepEqual(Option.zero().okOr('foo'), Err.of('foo'))
})

// okOrElse :: Option f, Result t => f a ~> (() -> b) -> t a b
test('Option..okOrElse', (t) => {
  const d = () => 5

  t.deepEqual(Some.of(2).okOrElse(d), Ok.of(2))
  t.deepEqual(Option.zero().okOrElse(d), Err.of(5))
})


// test('okOrElse :: (Option f, Result t) => f a ~> (() -> b) -> t a b', (t) => {
//   const get = () => 5

//   t.true(Some(4).okOrElse(get).isOk())
//   t.is(Some(4).okOrElse(get).unwrap(), 4)
//   t.true(None().okOrElse(get).isErr())
//   t.is(None().okOrElse(get).unwrapErr(), 5)
// })

// test('ok :: (Result f, Option t) => Result f a b ~> t a', (t) => {
//   t.true(Ok(1).ok().isSome())
//   t.is(Ok(2).ok().unwrap(), 2)
//   t.true(Err(12).ok().isNone())
// })

// test('err :: (Result f, Option t) => Result f a b ~> t b', (t) => {
//   t.true(Err(1).err().isSome())
//   t.is(Err(2).err().unwrap(), 2)
//   t.true(Ok(12).err().isNone())
// })
