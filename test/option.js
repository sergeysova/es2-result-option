/* eslint-disable no-magic-numbers, no-unused-vars, id-match */
/* eslint-disable one-var, one-var-declaration-per-line */
import test from 'ava'

import { Option, Some, None } from '../index'


test('exported Some and None is equal Option static props', (t) => {
  t.is(None.of, Option.none)
  t.is(Some.of, Option.some)
})

test('::zero returns None', (t) => {
  t.true(Option.zero().isNone())
  t.true(Option.zero(1).isNone())
  t.deepEqual(Option.zero(), None.of())
  t.deepEqual(Option.zero(2), None.of())
  t.deepEqual(Option.zero(), new None())
  t.deepEqual(Option.zero(3), new None())
})

test('{Some, None} as functions', (t) => {
  t.true(Some(1).isSome())
  t.true(Some(1) instanceof Some)

  t.true(None(1).isNone())
  t.true(None(1) instanceof None)
})

test('::of', (t) => {
  t.true(Some.of(1).isSome())
  t.true(Some.of(1) instanceof Some)

  t.true(None.of(1).isNone())
  t.true(None.of(1) instanceof None)
})

// encase :: Option f => (a -> b) -> (a -> f b)
test('::encase', (t) => {
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

  t.is(f1().extractOr(0), 1)
  t.is(f2(2).extractOr(0), 3)
  t.deepEqual(f3(1, 5, 9, 12).extractOr([]), [1, 5, 9, 12])
  t.true(f4().isNone())

  t.true(f5().isSome())
  t.true(f6().isSome())
  t.true(f7().isSome())
  t.true(f8().isSome())
  t.true(f9().isSome())
  t.true(fF().isSome())
})

// is :: a -> Boolean
test('::is', (t) => {
  t.true(Option.is(Some(1)))
  t.true(Option.is(None(1)))

  t.false(Option.is(new Error('Bar')))
  t.false(Option.is(12))
  t.false(Option.is(Option))
  t.false(Option.is(Option.some))
  t.false(Option.is(Option.none))
})

// into :: Option f => a -> f a
test('::into', (t) => {
  t.deepEqual(Option.into(1), Some.of(1))
  t.deepEqual(Option.into(NaN), Option.zero())
  t.true(Option.into(undefined).isNone())
  t.true(Option.into(null).isNone())
})

// alt :: Alt f => f a ~> f a -> f a
test('.alt', (t) => {
  const a = Some.of('a')
  const b = Some.of('b')
  const c = Some.of('c')
  const d = Option.none()
  const ƒ = (f) => `${f}!`

  t.is(a.alt(b).alt(c), a.alt(b.alt(c)), 'associativity')
  t.deepEqual(a.alt(b).map(ƒ), a.map(ƒ).alt(b.map(ƒ)), 'distributivity')

  t.is(a.alt(d).alt(c), a.alt(d.alt(c)), 'associativity with None')
  t.is(d.alt(b).alt(c), d.alt(b.alt(c)), 'associativity with None')
})

// ap :: Apply f => f a ~> f (a -> b) -> f b
test('.ap', (t) => {
  const a = Some.of(1)
  const b = Some.of((value) => value + 1)
  const c = Some.of((value) => value * 2)

  t.deepEqual(a.ap(b), Some.of(2), 'ap must apply the function in Apply b to the value in Apply a')
  t.deepEqual(a.ap(b).ap(c), Some.of(4))
  t.deepEqual(Option.none().ap(b).ap(c), Option.none())

  t.deepEqual(a.ap(b).ap(c), a.ap(b.ap(c.map((f) => (g) => (x) => f(g(x))))), 'composition')
})

// chain :: Chain m => m a ~> (a -> m b) -> m b
test('.chain', (t) => {
  const m = Some.of(1)
  const f = (v) => Some.of(v + 1)
  const g = (v) => Some.of(v * 2)

  t.deepEqual(m.chain(f), Some(2), 'chain must apply the function in Chain f to the value in Chain m')
  t.deepEqual(m.chain(f).chain(f).chain(g), Some(6))
  t.deepEqual(None().chain(f).chain(f).chain(g), None())

  t.deepEqual(m.chain(f).chain(g), m.chain((x) => f(x).chain(g)), 'associativity')
})

// equals :: Setoid a => a ~> a -> Boolean
test('.equals', (t) => {
  const a = Some.of(1)
  const b = Some.of(2)
  const c = Some.of(1)
  const d = Some.of(1)

  t.true(a.equals(c))
  t.false(a.equals(b))
  t.false(Some(1).equals(None()))
  t.true(None().equals(None()))

  t.true(a.equals(a), 'reflexivity')
  t.is(a.equals(c), c.equals(a), 'symmetry')
  t.is(a.equals(c), c.equals(d), 'transitivity 1')
  t.is(c.equals(d), d.equals(a), 'transitivity 2')
})

// extend :: Extend w => w a ~> (w a -> b) -> w b
test('.extend', (t) => {
  const w = Some.of(1)
  const g = (ov) => ov.extractOr(0) + 1
  const f = (ov) => ov.extractOr(0) * 2

  t.deepEqual(w.extend(g), Some.of(2), 'extend must apply the function g to the Chain w')
  t.deepEqual(Option.none().extend(g), Option.none())
  t.deepEqual(w.extend(g).extend(f), Some.of(4), 'extend must apply the function g to the Chain w')

  t.deepEqual(w.extend(g).extend(f), w.extend((_w) => f(_w.extend(g))))
})

// extractOr :: Option w => w a ~> (a) -> a
test('.extractOr', (t) => {
  const w = Some.of(1)
  const f = (ov) => ov.extractOr(0) + 1

  t.is(w.extractOr(0), 1)
  t.is(Option.none().extractOr(0), 0)
  t.is(w.extend(f).extractOr(0), 2)

  t.deepEqual(w.extend((_w) => w.extractOr(0)), w, 'left identity')
  t.deepEqual(w.extend(f).extractOr(0), f(w), 'right identity')
})

// extractOrElse :: Option w => w a ~> (() -> a) -> a
test('.extractOrElse', (t) => {
  const w = Some.of(1)
  const f = (ov) => ov.extractOr(0) + 1
  const d = () => 0

  t.is(w.extractOrElse(d), 1)
  t.is(Option.none().extractOrElse(d), 0)
  t.is(w.extend(f).extractOrElse(d), 2)

  t.deepEqual(w.extend((_w) => w.extractOrElse(d)), w, 'left identity')
  t.deepEqual(w.extend(f).extractOrElse(d), f(w), 'right identity')
})

// filter :: Filterable f => f a ~> (a -> Boolean) -> f a
test('.filter', (t) => {
  const v = Some.of(1)
  const w = Some.of(2)
  const p = (val) => val > 0
  const q = (val) => val % 2 === 0

  t.deepEqual(v.filter(p), v)
  t.deepEqual(v.filter(q), Option.zero())

  t.deepEqual(w.filter((x) => p(x) && q(x)), w.filter(p).filter(q), 'distributivity')
  t.deepEqual(v.filter(() => true), v, 'identity')
  t.deepEqual(v.filter(() => false), w.filter(() => false), 'annihilation')
})

// isNone :: Option f => f a ~> () -> Boolean
test('.isNone', (t) => {
  t.false(Some.of(1).isNone())
  t.true(None.of(1).isNone())
})

// isSome :: Option f => f a ~> () -> Boolean
test('.isSome', (t) => {
  t.true(Some.of(1).isSome())
  t.false(None.of(1).isSome())
})

// iter :: Option f => f a ~> () -> Iterator a
test('.iter', (t) => {
  t.deepEqual(Some.of(1).iter().next(), { done: false, value: 1 })
  t.deepEqual(Option.zero().iter().next(), { done: true, value: undefined })

  const iter = Some.of(2).iter()

  t.is(iter.next().value, 2)
  t.true(iter.next().done)

  let saved

  for (const value of Some.of(3).iter()) {
    saved = value
  }
  t.is(saved, 3)
})

// map :: Functor f => f a ~> (a -> b) -> f b
test('.map', (t) => {
  const u = Some.of(1)
  const f = (val) => val + 1
  const g = (val) => val * 2

  t.deepEqual(u.map(f), Some.of(2))
  t.deepEqual(u.map(f).map(g), Some.of(4))
  t.deepEqual(Option.zero().map(f).map(g), Option.zero())
  t.deepEqual(Option.zero().map(f), Option.zero())
  t.deepEqual(u.map((v) => Some.of(v)), Some.of(Some.of(1)))
  t.deepEqual(u.map((v) => Some.of(v)).extractOr(Some.of(0)), Some.of(1))

  t.deepEqual(u.map((a) => a), u, 'identity')
  t.deepEqual(u.map((x) => f(g(x))), u.map(g).map(f), 'composition')
})

// mapOr :: Option f => f a ~> (b, (a -> b)) -> f b
test('.mapOr', (t) => {
  const u = Some.of(1)
  const f = (val) => val + 1
  const g = (val) => val * 2
  const d = 100

  t.deepEqual(u.mapOr(d, f), Some.of(2))
  t.deepEqual(u.mapOr(d, f).mapOr(d, g), Some.of(4))
  t.deepEqual(Option.zero().mapOr(d, f).mapOr(d, g), Some.of(200))
  t.deepEqual(Option.zero().mapOr(d, f), Some.of(100))
  t.deepEqual(u.mapOr(d, (v) => Some.of(v)), Some.of(Some.of(1)))
  t.deepEqual(u.mapOr(d, (v) => Some.of(v)).extractOr(Some.of(0)), Some.of(1))

  t.deepEqual(u.mapOr(d, (a) => a), u, 'identity')
  t.deepEqual(u.mapOr(d, (x) => f(g(x))), u.mapOr(d, g).mapOr(d, f), 'composition')
})

// mapOrElse :: Option f => f a ~> ((() -> b), (a -> b)) -> f b
test('.mapOrElse', (t) => {
  const u = Some.of(1)
  const f = (val) => val + 1
  const g = (val) => val * 2
  const d = () => 100

  t.deepEqual(u.mapOrElse(d, f), Some.of(2))
  t.deepEqual(u.mapOrElse(d, f).mapOrElse(d, g), Some.of(4))
  t.deepEqual(Option.zero().mapOrElse(d, f).mapOrElse(d, g), Some.of(200))
  t.deepEqual(Option.zero().mapOrElse(d, f), Some.of(100))
  t.deepEqual(u.mapOrElse(d, (v) => Some.of(v)), Some.of(Some.of(1)))
  t.deepEqual(u.mapOrElse(d, (v) => Some.of(v)).extractOr(Some.of(0)), Some.of(1))

  t.deepEqual(u.mapOrElse(d, (a) => a), u, 'identity')
  t.deepEqual(u.mapOrElse(d, (x) => f(g(x))), u.mapOrElse(d, g).mapOrElse(d, f), 'composition')
})

test.todo('Option.or')

test.todo('Option.orElse')
