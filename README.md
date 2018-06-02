# @es2/result-option [![Maintainability](https://api.codeclimate.com/v1/badges/1448aef0f57513e42c0c/maintainability)](https://codeclimate.com/github/sergeysova/es2-result-option.js/maintainability) [![Build Status](https://travis-ci.org/sergeysova/es2-result-option.js.svg?branch=master)](https://travis-ci.org/sergeysova/es2-result-option.js) [![Coverage Status](https://coveralls.io/repos/github/sergeysova/es2-result-option.js/badge.svg?branch=master)](https://coveralls.io/github/sergeysova/es2-result-option.js?branch=master)

## Readme



## Installation

```bash
npm install @es2/result-option
```

Package written for ECMAScript v5+.

### CommonJS

```js
const { Option, Some, None, Result } = require('@es2/result-option')

Some(2)
Option.Some(2)
```

### ECMAScript Module

```js
import { Option, Some, None, Result } from '@es2/result-option'

Some(2)
Option.Some(2)
```

### TypeScript

```ts
import { Ok, ResultClass } from '@es2/result-option'

const ResultClass<number, string> = Ok(12)
```

## Examples

```js
function divide(numerator, denominator) {
  return numerator === 0
    ? None()
    : Some(numerator / denominator)
}

const result = divide(12, 3)
  .unwrapOr(0)

assert(result, 4)
```

```ts
function checkOptional(optional: Option<number>) {
  if (optional.isSome()) {
    console.log(`has value ${optional.unwrap()}`)
  }
  else {
    console.log(`has no value`)
  }
}
```

```js
let msg = Some('foo bar')

// Destroy option, extract string
let unwrappedMessage = msg.unwrapOr('default message')
// 'foo bar'
```

```ts
function getNumberOver5(): Option<number> {
  const number = Math.floor(Math.random() * 10)

  if (number > 5) {
    return None()
  }

  return Some()
}

function printNumber(num: Option<number>) {
  console.log(`Generated number: ${num.unwrapOr(0)}`)
}

printNumber(getNumberOver5().or(Some(10)))
```

```ts
declare function getUser(id: number): Promise<Option<User>>

return (await getUser(1))
  .or(User.default())
  .unwrap()
```


## Documentation

<details><summary>Option</summary>

- [`Option`](#option)
- [`Option.of` Create option based on value](#optionof)
- [`Option.isOption`](#optionisoption)
- [`Option.encase`](#optionencase)
- [`Option.wrap`](#optionwrap)
- [`Option.into`](#optioninto)
- [`Option.some` and `Some`](#optionsome)
- [`Option.none` and `None`](#optionnone)
- [`isSome` and `Some.isSome`](#issome)
- [`isNone` and `None.isNone`](#isnone)
- [`equals`](#equals)
- [`unwrap`](#unwrap)
- [`unwrapOr`](#unwrapor)
- [`unwrapOrElse`](#unwraporelse)
- [`map`](#map)
- [`mapOr`](#mapor)
- [`mapOrElse`](#maporelse)
- [`chain`](#chain)
- [`iter`](#iter)
- [`and`](#and)
- [`andThen`](#andthen)
- [`filter`](#filter)
- [`or`](#or)
- [`orElse`](#orelse)

</details>

<details><summary>Result</summary>
</details>

<details><summary>Interoperability</summary>
</details>


### Option

Package exports `Option` and shortcuts for `Some`, `None`

`Option` represents an optional value: every `Option` is either `Some` and contains value, or `None`, and does not. `Option`s have a number of uses:
- Initial values
- Return values for functions that are not defined over their entire input range (partial functions)
- Optional fields
- Optional function arguments
- Nullable pointers

```js
import { Option, Some, None } from '@es2/result-option'
```

`Some` and `None` is shortcuts for `Option.some` and `Option.none`.


#### Option.of

Create option of passed value.

```hs
of :: Option f => a -> f a
```

`None` returned if passed `null` or `undefined` to `Option.of`, otherwise returns `Some`.

```js
Option.of(null).isNone() === true
Option.of('').isSome() === true
Option.of([]).isSome() === true
Option.of(123).isSome() === true
```


#### Option.isOption

Check if option passed.

```hs
isOption :: Option f => f a -> Boolean
```

If passed instance of `Option` returns `true`.

```js
Option.isOption(1) === false
Option.isOption(None()) === true
Option.isOption(Option.some(1)) === true
```

#### Option.encase

Wrap function that throws to function that returns `Option`.

```hs
encase :: Option f => (r -> a) -> (r -> f a)
```

Example

```js
const foo = (value) => {
  if (!value) {
    throw new Error('Not exists')
  }
  return value + 2
}

const safeFoo = Option.encase(foo)

safeFoo().isNone() === true
safeFoo(2).isSome() === true
safeFoo(2).unwrap() === 4
```

#### Option.wrap

Wrap function that throws or returns `null`, `undefined`, `Nan` to function that returns `Option`.

```hs
wrap :: Option f => (r -> a) -> (r -> f a)
```

Example

```js
const bar = (a, b) => a / b
const safeBar = Option.wrap(bar)

const panic = () => {
  throw new Error('PANIC TEST')
}
const safePanic = Option.wrap(panic)

safeBar(0, 0).isNone() === true
safePanic().isNone() === true
safeBar(2, 1).unwrap() === 2
```

#### Option.into

Convert any value to option.

```hs
into :: Option f -> a -> f a
```

If passed `Option` just returns it.<br/>
Otherwise wrap result with `Option.of`.

```js
Option.into(1).isSome() === true
Option.into(Some(1)).unwrap() === 1
Option.into(null).isNone() === true
Option.into(None()).isNone() === true
```

#### Option.some

Create some value.

```hs
Some :: Option f => a -> f a
some :: Option f => a -> f a
```

Wrap any passed value to `Some`

```js
Option.some(1)
Some(2)
Some(null) /** @see Option.of */
```

#### Option.none

Create none value.

```hs
None :: Option f, a => b -> f a
none :: Option f, a => b -> f a
```

Just return empty `Option` (instance of Some).

```js
Option.none()
None()
Option.none().equals(None()) === true
```

#### isSome

Check if passed `Some`.

```hs
isSome :: Option f => f a ~> Boolean
isSome :: Option f => f a -> Boolean
```

`exampleOption.isSome()` is shortcut for `Some.isSome(exampleOption)`

```js
Some(1).isSome() === true
None.isNone(Some(1)) === false
None(1).isSome() === false
```

#### isNone


Check if passed `None`.

```hs
isNone :: Option f => f a ~> Boolean
isNone :: Option f => f a -> Boolean
```

`exampleOption.isNone()` is shortcut for `None.isNone(exampleOption)`

```js
Some(1).isNone() === false
None.isNone(Some(1)) === false
None(1).isNone() === true
```

#### equals

Check if passed options is equals.

```hs
equals :: (Option f, a, b) => f a ~> f b -> Boolean
```

If passed `Some` and `None` returns `false`. Check equality with `===`.

```js
Some(1).equals(Some(1)) === true
Some(1).equals(Some(2)) === false
Some([1]).equals(Some([1])) === false

const list = [1, 2]
Some(list).equals(Some(list)) === true
None().equals(None()) === true
None().equals(Some(1)) === false
```

#### unwrap

Get value from option.

```hs
unwrap :: Option f => f a ~> a!
```

If `unwrap` called on `None` throws `OptionException('unwrap() called on None value')`<br/>
Otherwise return value.

```js
Some(1).unwrap() === 1
None().unwrap() // Oops! 'unwrap() called on None value'
```

#### unwrapOr

Get value from option, or use default.

```hs
unwrapOr :: Option f => f a ~> a -> a
```

If `unwrapOr` called on `None` returns argument.

```js
Some(1).unwrapOr(2) === 1
None().unwrapOr(2) === 2
```

#### unwrapOrElse

Get value from option, or call function.

```hs
unwrapOrElse :: Option f => f a ~> (() -> a) -> a
```

If `unwrapOrElse` passed on `None` calls argument function to get default value.


```js
Some(1).unwrapOrElse(() => 2) === 1
None(1).unwrapOrElse(() => 2) === 2
```

#### map

Apply function to a value inside option.

```hs
map :: Option f => f a ~> (a -> b) -> f b
```

If `map` called on `None` returns `None`, function do not call.<br/>
If passed function returns `null` or `undefined` returns `Null`.<br/>
`map` call always returns `Option`.

```js
const incr = (v) => v + 1
Some(1).map(incr).unwrap() === 2
None().map(incr).isNone() === true
```

#### mapOr

Apply function to a value inside option or default.

```hs
mapOr :: Option f => f a ~> (b, (a -> b)) -> b
```

If `mapOr` called on `None` function called on default value (first argument).<br/>
If passed function returns `null` or `undefined` returns `None`.<br/>
If default value is `null` or `undefined` returns `None`.<br/>
`mapOr` call always returns `Option`.

```js
const incr = (v) => v + 1
const def = 2
Some(1).mapOr(def, incr).unwrap() === 2
None().mapOr(def, incr).unwrap() === 3
```

#### mapOrElse

Apply function to a value inside option or call function to get value.

```hs
mapOrElse :: Option f => f a ~> ((() -> b), (a -> b)) -> b
```

If `mapOrElse` called on `None` first argument called to get default value.<br/>
If any passed function returns `null` or `undefined` returns `None`.<br/>
`mapOrElse` call always returns `Option`.

```js
const incr = (v) => v + 1
const getDef = () => 2
Some(1).mapOrElse(getDef, incr).unwrap() === 2
None().mapOrElse(getDef, incr).unwrap() === 3
```

#### chain

Apply function that returns `Option` to value inside `Option`. <br/>
If passed function returns not option, `Option.of` used to convert to option.

```hs
chain :: Option f => f a ~> (a -> f b) -> f b
```

`chain` is an alias for [`andThen`](#andthen).

#### iter

Get iterator of option value.

```hs
iter :: (Option f, Iterator i) => f a ~> i a
```

If `iter` called on `None` returns done iterator.

```js
Some(5).iter().next().value === 5
None().iter().next().done === true
None().iter().next().value === undefined
```

#### and

Return passed option if current is `Some`.

```hs
and :: Option f => f a ~> f b -> f b
```

If `and` called on `None` returns `None`.<br/>
If passed not option, `Option.of` used to convert to option.<br/>
Otherwise returns passed option.

Like ecmascript type casting in `&&`.

```js
// null && 5
None().and(Some(5)).isNone() === true

// 1 && 2
Some(1).and(Some(2)).unwrap() === 2

// 5 && null
Some(5).and(None()).isNone() === true
```

#### andThen

Call function that returns option if current is `Some`.

```hs
andThen :: Option f => f a ~> (a -> f b) -> f b
```

If `andThen` called on `None` returns `None`.<br/>
If passed function returns not option, `Option.of` used to convert to option.<br/>
Otherwise call passed function to get `Option`.

Like ecmascript type casting in `&&`.

```js
const sq = (x) => Some(x * x)

// 2 && sq(2) && sq(2)
Some(2).andThen(sq).andThen(sq).unwrap() === 16

// null && sq(null)
None().andThen(sq).isNone() === true

// 2 && (() => null)(2)
Some(2).andThen(() => None()).isNone() === true
```

#### filter

Check value inside option.

```hs
filter :: Option f => f a ~> (a -> Boolean) -> f a
```

If `filter` called on `None` passed function not called and returns `None`. <br/>
If passed function returns "falsy" value, `filter` call returns `None`. <br/>
Otherwise returns `Some` with current value.

```js
const isEven = (n) => n % 2 === 0

None().filter(isEven).isNone() === true
Some(2).filter(isEven).unwrap() === 2
Some(3).filter(isEven).isNone() === true
```

#### or

Return passed option if current is `None`.

```hs
or :: Option f => f a ~> f a -> f a
```

If `or` called on `None` returns passed option. <br/>
If passed not option, `Option.of` used to convert to option.<br/>
Otherwise return `Some` with current value.

Like ecmascript type casting in `||`.

```js
// 2 || 3
Some(2).or(Some(3)).unwrap() === 2

// null || 3
None().or(Some(3)).unwrap() === 3

// 2 || null
Some(2).or(None()).unwrap() === 2

// null || null
None().or(None()).isNone() === true
```

#### orElse

Call function to get option if current `None`.

```hs
orElse :: Option f => f a ~> (() -> f a) -> f a
```

If `orElse` called on `None` calls passed function to get option.<br/>
If passed function returns not option, `Option.of` used to convert to option.<br/>
Otherwise return `Some` with current value.

Like ecmascript type casting in `||`.

```js
// 2 || (() => 1)()
Some(2).orElse(() => Some(1)).unwrap() === 2

// null || (() => 1)()
None().orElse(() => Some(1)).unwrap() === 1
```

