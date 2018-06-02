/* eslint-disable no-magic-numbers, no-unused-vars, id-match */
/* eslint-disable one-var, one-var-declaration-per-line */
import test from 'ava'

import { Option, Some, None } from '../index'


test('exported Some and None is equal Option static props', (t) => {
  t.is(None, Option.none)
  t.is(Some, Option.some)
})

test('no constructor of Option', (t) => {
  t.true(typeof Option === 'object')
})

test('Option.of :: Option f => a -> f a', (t) => {
  t.is(Option.of(1).unwrap(), 1)
  t.is(Option.of(null).isNone(), true)
})

test('Some :: Option f => a -> f a', (t) => {
  t.is(Option.some(1).unwrap(), 1)
  t.is(Some(1).unwrap(), 1)
})

test('None :: Option f, a => b -> f a', (t) => {
  t.true(Option.none().isNone())
  t.true(None().isNone())
})

test('Option.isOption :: Option f => f a -> Boolean', (t) => {
  t.true(Option.isOption(Some(1)))
  t.true(Option.isOption(None(1)))

  t.false(Option.isOption(new Error('Bar')))
  t.false(Option.isOption(12))
  t.false(Option.isOption(Option))
  t.false(Option.isOption(Option.some))
  t.false(Option.isOption(Option.none))
})

test('isSome :: Option f => f a ~> Boolean', (t) => {
  t.true(Some(0).isSome())
  t.false(None().isSome())
  t.true(Some.isSome(Some(1)))
  t.false(None.isNone(Some(1)))
})

test('isNone :: Option f => f a ~> Boolean', (t) => {
  t.false(Some(0).isNone())
  t.true(None().isNone())
  t.true(None.isNone(None()))
  t.false(Some.isSome(None()))
})

test('equals :: Option f => f a ~> f b -> Boolean', (t) => {
  t.true(Some(1).equals(Some(1)))
  t.false(Some(2).equals(Some(1)))
  t.false(None().equals(Some(1)))
  t.true(None().equals(None()))
})

test('unwrap :: Option f => f a ~> a!', (t) => {
  t.notThrows(() => {
    t.is(Some(1).unwrap(), 1)
  })
  t.throws(() => {
    None().unwrap()
  }, /called on None/)
})

test('unwrapOr :: Option f => f a ~> a -> a', (t) => {
  t.is(Some(1).unwrapOr(2), 1)
  t.is(None().unwrapOr(10), 10)
})

test('unwrapOrElse :: Option f => f a ~> (() -> a) -> a', (t) => {
  t.is(Some(1).unwrapOrElse(() => 2), 1)
  t.is(None().unwrapOrElse(() => 2), 2)
})

test('map :: Option f => f a ~> (a -> q) -> f q', (t) => {
  t.is(Option.some(1).map((a) => a + 1).unwrap(), 2)
  t.true(Option.none(1).map((a) => a + 1).isNone())
  t.true(Option.some(1).map((a) => null).isNone())
})

test('mapOr :: Option f => f a ~> (b, (a -> b)) -> b', (t) => {
  t.is(Some(2).mapOr(32, (x) => x + x).unwrap(), 4)
  t.is(None().mapOr(32, (x) => x + x).unwrap(), 32)
  t.true(None().mapOr(null, (x) => x + x).isNone())
  t.true(Some(2).mapOr(32, (x) => null).isNone())
})

test('mapOrElse :: Option f => f a ~> ((() -> b), (a -> b)) -> b', (t) => {
  const def = () => 5
  const map = (x) => x * 3

  t.is(Some(2).mapOrElse(def, map).unwrap(), 6)
  t.is(None().mapOrElse(def, map).unwrap(), 5)
  t.true(None().mapOrElse(() => null, map).isNone())
  t.true(Some(2).mapOrElse(def, (x) => null).isNone())
})

test('chain :: Option f => f a ~> (a -> f b) -> f b', (t) => {
  const inc = (x) => Some(x + 1)
  const non = () => None()

  t.is(Some(2).chain(inc).unwrap(), 3)
  t.true(None().chain(inc).isNone())
  t.true(None().chain(non).isNone())
  t.true(Some(2).chain(non).isNone())
})


test('iter :: (Option f, Iterator i) => f a ~> i a', (t) => {
  t.is(Some(5).iter().next().value, 5)
  t.is(None().iter().next().done, true)
  t.is(None().iter().next().value, undefined)
})

test('and :: Option f => f a ~> f b -> f b', (t) => {
  t.true(None().and(Some(5)).isNone())
  t.true(Some(1).and(Some(2)).isSome())
  t.is(Some(1).and(Some(2)).unwrap(), 2)
  t.true(Some(5).and(None()).isNone())
})

test('andThen :: Option f => f a ~> (a -> f b) -> f b', (t) => {
  const sq = (x) => Some(x * x)
  const np = () => None()

  t.is(Some(2).andThen(sq).andThen(sq).unwrap(), 16)
  t.true(Some(2).andThen(sq).andThen(np).isNone())
  t.true(Some(2).andThen(np).andThen(sq).isNone())
  t.true(None().andThen(sq).andThen(sq).isNone())
})

test('filter :: Option f => f a ~> (a -> Boolean) -> f a', (t) => {
  const isEven = (n) => n % 2 === 0

  t.true(None().filter(isEven).isNone())
  t.is(Some(2).filter(isEven).unwrap(), 2)
  t.true(Some(3).filter(isEven).isNone())
})

test('or :: Option f => f a ~> f a -> f a', (t) => {
  t.is(Some(2).or(None()).unwrap(), 2)
  t.is(None().or(Some(100)).unwrap(), 100)
  t.is(Some(2).or(Some(100)).unwrap(), 2)
  t.true(None().or(None()).isNone())
})

test('orElse :: Option f => f a ~> (() -> f a) -> f a', (t) => {
  const nobody = () => None()
  const vikings = () => Some('vikings')

  t.is(Some('barbarians').orElse(vikings).unwrap(), 'barbarians')
  t.is(None().orElse(vikings).unwrap(), 'vikings')
  t.true(None().orElse(nobody).isNone())
})

test('Option.encase :: Option f => (r -> a) -> (r -> f a)', (t) => {
  const f1 = Option.encase(() => 1)
  const f2 = Option.encase((a) => a + 1)
  const f3 = Option.encase((...args) => args)
  const f4 = Option.encase(() => {
    throw new Error('foo')
  })
  const f5 = Option.encase(() => { })
  const f6 = Option.encase(() => null)
  const f7 = Option.encase(() => 0 / 0)
  const f8 = Option.encase(() => '')
  const f9 = Option.encase(() => [])
  const fF = Option.encase(() => ({}))

  t.is(f1().unwrap(), 1)
  t.is(f2(2).unwrap(), 3)
  t.deepEqual(f3(1, 5, 9, 12).unwrap(), [1, 5, 9, 12])
  t.true(f4().isNone())

  t.true(f5().isSome())
  t.true(f6().isSome())
  t.true(f7().isSome())
  t.true(f8().isSome())
  t.true(f9().isSome())
  t.true(fF().isSome())
})

test('Option.wrap :: Option f => (r -> a) -> (r -> f a)', (t) => {
  const f1 = Option.wrap(() => 1)
  const f2 = Option.wrap((a) => a + 1)
  const f3 = Option.wrap((...args) => args)
  const f4 = Option.wrap(() => {
    throw new Error('foo')
  })
  const f5 = Option.wrap(() => { })
  const f6 = Option.wrap(() => null)
  const f7 = Option.wrap(() => 0 / 0)
  const f8 = Option.wrap(() => '')
  const f9 = Option.wrap(() => [])
  const fF = Option.wrap(() => ({}))

  t.is(f1().unwrap(), 1)
  t.is(f2(2).unwrap(), 3)
  t.deepEqual(f3(1, 5, 9, 12).unwrap(), [1, 5, 9, 12])
  t.true(f4().isNone())
  t.true(f5().isNone())
  t.true(f6().isNone())
  t.true(f7().isNone())
  t.true(f8().isSome())
  t.true(f9().isSome())
  t.true(fF().isSome())
})

test('Option.into :: Option f => a -> f a', (t) => {
  t.is(Option.into(1).unwrap(), 1)
  t.is(Option.into(Option.some(1)).unwrap(), 1)
  t.true(Option.into(Option.none()).isNone())
})
