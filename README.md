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


# Documentation

<details><summary>Option</summary>

- [`Option`](#option)
- [`Option.fromNullable` Create option based on value](#optionfromnullable)
- [`Option.isOption`](#optionisoption)
- [`Option.encase`](#optionencase)
- [`Option.wrap`](#optionwrap)
- [`Option.into`](#optioninto)
- [`Option.some` and `Some`](#some)
- [`Option.none` and `None`](#none)
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

- [`Result`](#result)
- [`Result.of`](#resultof)
- [`Result.isResult`](#resultisresult)
- [`Result.into`](#resultinto)
- [`Result.encase`](#resultencase)
- [`Ok` and `Result.ok`](#ok)
- [`Err` and `Result.err`](#err)

- [`isOk`](#isok)
- [`isErr`](#iserr)
- [`equals`](#equals-1)
- [`either`](#either)
- [`map`](#map-1)
- [`mapErr`](#maperr)
- [`bimap`](#bimap)
- [`chain`](#chain-1)
- [`chainErr`](#chainerr)
- [`iter`](#iter-1)
- [`and`](#and-1)
- [`andThen`](#andthen-1)
- [`or`](#or-1)
- [`orElse`](#orelse-1)
- [`unwrap`](#unwrap-1)
- [`unwrapOr`](#unwrapor-1)
- [`unwrapOrElse`](#unwraporelse-1)
- [`unwrapErr`](#unwraperr)
- [`expect`](#expect)
- [`expectErr`](#expecterr)
- [`promise`](#promise)
- [`swap`](#swap)
- [`extract`](#extract)
- [`extractErr`](#extracterr)

</details>

<details><summary>Interoperability</summary>
</details>


## Option

Package exports `Option` and shortcuts for `Some`, `None`.

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


### Option.fromNullable

Create option of passed value.

<details><summary><code>Option.fromNullable :: Option f => a -> f a</code></summary>

```hs
Option.fromNullable :: Option f => a -> f a
```
</details>

`None` returned if passed `null` or `undefined` to `Option.fromNullable`, otherwise returns `Some`.

```js
Option.fromNullable(null).isNone() === true
Option.fromNullable('').isSome() === true
Option.fromNullable([]).isSome() === true
Option.fromNullable(123).isSome() === true
```


### Option.isOption

Check if option passed.

<details><summary><code>Option.isOption :: Option f => f a -> Boolean</code></summary>

```hs
Option.isOption :: Option f => f a -> Boolean
```
</details>


If passed instance of `Option` returns `true`.

```js
Option.isOption(1) === false
Option.isOption(None()) === true
Option.isOption(Option.some(1)) === true
```

### Option.encase

Wrap function that throws to function that returns `Option`.

<details><summary><code>Option.encase :: Option f => (r -> a) -> (r -> f a)</code></summary>

```hs
Option.encase :: Option f => (r -> a) -> (r -> f a)
```
</details>


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

### Option.wrap

Wrap function that throws or returns `null`, `undefined`, `Nan` to function that returns `Option`.

<details><summary><code>Option.wrap :: Option f => (r -> a) -> (r -> f a)</code></summary>

```hs
Option.wrap :: Option f => (r -> a) -> (r -> f a)
```
</details>

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

### Option.into

Convert any value to option.

<details><summary><code>Option.into :: Option f => a -> f a</code></summary>

```hs
Option.into :: Option f => a -> f a
```
</details>

If passed `Option` just returns it.<br/>
Otherwise wrap result with `Option.fromNullable`.

```js
Option.into(1).isSome() === true
Option.into(Some(1)).unwrap() === 1
Option.into(null).isNone() === true
Option.into(None()).isNone() === true
```

### Some

Create some value.

<details><summary><code>Some :: Option f => a -> f a</code></summary>

```hs
Option.some :: Option f => a -> f a
Some :: Option f => a -> f a
Some.of :: Option f => a -> f a
```
</details>

Wrap any passed value to `Some`

```js
Option.some(1)
Some(2)
Some(null) /** @see Option.fromNullable */
Some.of(3)
```

### None

Create none value.

<details><summary><code>None :: Option f => () -> f a</code></summary>

```hs
Option.none :: Option f => () -> f a
None :: Option f => () -> f a
None.of :: Option f => () -> f a
```
</details>

Just return empty `Option` (instance of Some).

```js
Option.none()
None()
Option.none().equals(None()) === true
None.of()
```

### isSome

Check if passed `Some`.

<details><summary><code>isSome :: Option f => f a ~> Boolean</code></summary>

```hs
isSome :: Option f => f a ~> Boolean
Some.isSome :: Option f => f a -> Boolean
```
</details>

`exampleOption.isSome()` is shortcut for `Some.isSome(exampleOption)`

```js
Some(1).isSome() === true
None.isNone(Some(1)) === false
None(1).isSome() === false
```

### isNone


Check if passed `None`.

<details><summary><code>isNone :: Option f => f a ~> Boolean</code></summary>

```hs
isNone :: Option f => f a ~> Boolean
None.isNone :: Option f => f a -> Boolean
```
</details>

`exampleOption.isNone()` is shortcut for `None.isNone(exampleOption)`

```js
Some(1).isNone() === false
None.isNone(Some(1)) === false
None(1).isNone() === true
```

### equals

Check if passed options is equals.

<details><summary><code>equals :: Option f => f a ~> f b -> Boolean</code></summary>

```hs
equals :: Option f => f a ~> f b -> Boolean
```
</details>

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

### unwrap

Get value from option.

<details><summary><code>unwrap :: Option f => f a ~> a!</code></summary>

```hs
unwrap :: Option f => f a ~> a!
```
</details>

If `unwrap` called on `None` throws `OptionException('unwrap() called on None value')`<br/>
Otherwise return value.

```js
Some(1).unwrap() === 1
None().unwrap() // Oops! 'unwrap() called on None value'
```

### unwrapOr

Get value from option, or use default.

<details><summary><code>unwrapOr :: Option f => f a ~> a -> a</code></summary>

```hs
unwrapOr :: Option f => f a ~> a -> a
```
</details>


If `unwrapOr` called on `None` returns argument.

```js
Some(1).unwrapOr(2) === 1
None().unwrapOr(2) === 2
```

### unwrapOrElse

Get value from option, or call function.

<details><summary><code>unwrapOrElse :: Option f => f a ~> (() -> a) -> a</code></summary>

```hs
unwrapOrElse :: Option f => f a ~> (() -> a) -> a
```
</details>

If `unwrapOrElse` passed on `None` calls argument function to get default value.


```js
Some(1).unwrapOrElse(() => 2) === 1
None(1).unwrapOrElse(() => 2) === 2
```

### map

Apply function to a value inside option.

<details><summary><code>map :: Option f => f a ~> (a -> b) -> f b</code></summary>

```hs
map :: Option f => f a ~> (a -> b) -> f b
```
</details>

If `map` called on `None` returns `None`, function do not call.<br/>
If passed function returns `null` or `undefined` returns `Null`.<br/>
`map` call always returns `Option`.

```js
const incr = (v) => v + 1
Some(1).map(incr).unwrap() === 2
None().map(incr).isNone() === true
```

### mapOr

Apply function to a value inside option or default.

<details><summary><code>mapOr :: Option f => f a ~> (b, (a -> b)) -> b</code></summary>

```hs
mapOr :: Option f => f a ~> (b, (a -> b)) -> b
```
</details>

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

### mapOrElse

Apply function to a value inside option or call function to get value.

<details><summary><code>mapOrElse :: Option f => f a ~> ((() -> b), (a -> b)) -> b</code></summary>

```hs
mapOrElse :: Option f => f a ~> ((() -> b), (a -> b)) -> b
```
</details>

If `mapOrElse` called on `None` first argument called to get default value.<br/>
If any passed function returns `null` or `undefined` returns `None`.<br/>
`mapOrElse` call always returns `Option`.

```js
const incr = (v) => v + 1
const getDef = () => 2
Some(1).mapOrElse(getDef, incr).unwrap() === 2
None().mapOrElse(getDef, incr).unwrap() === 3
```

### chain

Apply function that returns `Option` to value inside `Option`. <br/>
If passed function returns not option, `Option.fromNullable` used to convert to option.

<details><summary><code>chain :: Option f => f a ~> (a -> f b) -> f b</code></summary>

```hs
chain :: Option f => f a ~> (a -> f b) -> f b
```
</details>

`chain` is an alias for [`andThen`](#andthen).

### iter

Get iterator of option value.

<details><summary><code>iter :: (Option f, Iterator i) => f a ~> i a</code></summary>

```hs
iter :: (Option f, Iterator i) => f a ~> i a
```
</details>

If `iter` called on `None` returns done iterator.

```js
Some(5).iter().next().value === 5
None().iter().next().done === true
None().iter().next().value === undefined
```

### and

Return passed option if current is `Some`.

<details><summary><code>and :: Option f => f a ~> f b -> f b</code></summary>

```hs
and :: Option f => f a ~> f b -> f b
```
</details>

If `and` called on `None` returns `None`.<br/>
If passed not option, `Option.fromNullable` used to convert to option.<br/>
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

### andThen

Call function that returns option if current is `Some`.

<details><summary><code>andThen :: Option f => f a ~> (a -> f b) -> f b</code></summary>

```hs
andThen :: Option f => f a ~> (a -> f b) -> f b
```
</details>

If `andThen` called on `None` returns `None`.<br/>
If passed function returns not option, `Option.fromNullable` used to convert to option.<br/>
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

### filter

Check value inside option.

<details><summary><code>filter :: Option f => f a ~> (a -> Boolean) -> f a</code></summary>

```hs
filter :: Option f => f a ~> (a -> Boolean) -> f a
```
</details>

If `filter` called on `None` passed function not called and returns `None`. <br/>
If passed function returns "falsy" value, `filter` call returns `None`. <br/>
Otherwise returns `Some` with current value.

```js
const isEven = (n) => n % 2 === 0

None().filter(isEven).isNone() === true
Some(2).filter(isEven).unwrap() === 2
Some(3).filter(isEven).isNone() === true
```

### or

Return passed option if current is `None`.

<details><summary><code>or :: Option f => f a ~> f a -> f a</code></summary>

```hs
or :: Option f => f a ~> f a -> f a
```
</details>

If `or` called on `None` returns passed option. <br/>
If passed not option, `Option.fromNullable` used to convert to option.<br/>
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

### orElse

Call function to get option if current `None`.

<details><summary><code>orElse :: Option f => f a ~> (() -> f a) -> f a</code></summary>

```hs
orElse :: Option f => f a ~> (() -> f a) -> f a
```
</details>

If `orElse` called on `None` calls passed function to get option.<br/>
If passed function returns not option, `Option.fromNullable` used to convert to option.<br/>
Otherwise return `Some` with current value.

Like ecmascript type casting in `||`.

```js
// 2 || (() => 1)()
Some(2).orElse(() => Some(1)).unwrap() === 2

// null || (() => 1)()
None().orElse(() => Some(1)).unwrap() === 1
```


### Result

Package exports `Result` and shortcuts for `Some`, `None`.

`Result` is the type used for returning and propagating errors instead of exceptions.<br/>
`Ok` representing success and containing a value, `Err` representing error and containing an error value.


### Result.of

Create result of passed value or error.

<details><summary><code>Result.of :: Result f => a -> f a</code></summary>

```hs
Result.of :: Result f => a -> f a
```
</details>

If passed instance of `Error`, returns `Err`. Otherwise returns `Ok`.

```js
Result.of(1).isOk() === true
Result.of(null).isOk() === true
Result.of(new Error()).isErr() === true
```


### Result.isResult

Check if passed instance of `Result`.

<details><summary><code>Result.isResult :: Result f => f a b -> Boolean</code></summary>

```hs
Result.isResult :: Result f => f a b -> Boolean
```
</details>

If passed `Ok` or `Err` returns `true`. Otherwise returns `false`.

```js
Result.isResult(Ok(1)) === true
Result.isResult(Result.err(2)) === true
Result.isResult(1) === false
Result.isResult(new Error()) === false
```

### Result.into

Converts passed value to `Result`.

<details><summary><code>Result.into :: Result f => a -> f a</code></summary>

```hs
Result.into :: Result f => a -> f a
```
</details>

```js
Result.into(1).isOk() === true
Result.into(new Error('foo')).isErr() === true
Result.into(Ok(1)).unwrap() === 1
Result.into(Err(2)).unwrapErr() === 2
```

### Result.encase

Wrap function that throws to function that returns `Result`.

<details><summary><code>Result.encase :: Result f => (r -> a) -> (r -> f a b)</code></summary>

```hs
Result.encase :: Result f => (r -> a) -> (r -> f a b)
```
</details>

```js
const fail = () => {
  throw new Error('1')
}
const safeFail = Result.encase(fail)
const safe = Result.encase((a, b) => a + b)

safeFail().unwrapErr().message === '1'
safe(1, 2).unwrap() == 3
```

### Ok

Create success result value.

<details><summary><code>Ok :: Result f => a -> f a b</code></summary>

```hs
Ok :: Result f => a -> f a b
Result.ok :: Result f => a -> f a b
Ok.of :: Result f => a -> f a b
```
</details>

Just wrap passed value to `Ok`.

```js
Ok(1)
Result.ok(2)
Ok.of(3)
```

### Err

Create fail result value.

<details><summary><code>Err :: Result f => b -> f a b</code></summary>

```hs
Err :: Result f => b -> f a b
Result.err :: Result f => b -> f a b
Err.of :: Result f => b -> f a b
```
</details>

Just wrap passed value to `Err`.

```js
Err(1)
Result.err(2)
Err.of(3)
```

### isOk

Check if passed value is `Ok`.

<details><summary><code>isOk :: Result f => f a b ~> Boolean</code></summary>

```hs
isOk :: Result f => f a b ~> Boolean
Ok.isOk :: Result f => f a b -> Boolean
```
</details>

If passed `Ok` instance of `Result` returns `true`, otherwise returns `false`.

```js
Ok(1).isOk() === true
Ok.isOk(Ok(1)) === true
Err(2).isOk() === false
Ok.isOk(Err(2)) === false
```

### isErr

Check if passed value is `Err`.

<details><summary><code>isErr :: Result f => f a b ~> Boolean</code></summary>

```hs
isErr :: Result f => f a b ~> Boolean
Err.isErr :: Result f => f a b -> Boolean
```
</details>

If passed `Err` instance of `Result` returns `true`, otherwise returns `false`.

```js
Err(1).isErr() === true
Err.isErr(Err(1)) === true
Ok(2).isErr() === false
Err.isErr(Ok(2)) === false
```

### equals

Check if passed result is equals current.

<details><summary><code>equals :: Result f => f ~> f -> Boolean</code></summary>

```hs
equals :: Result f => f ~> f -> Boolean
```
</details>

If passed `Ok` and `Err` returns `false`. Otherwise check inner values with `===`.

```js
Ok(1).equals(Ok(1)) === true
Ok(2).equals(Err(2)) === false
Ok(3).equals(Ok(4)) === false
```

### either

Transform `Result` to single value.

<details><summary><code>either :: Result f => f a b ~> (a -> r) -> (b -> r) -> r</code></summary>

```hs
either :: Result f => f a b ~> (a -> r) -> (b -> r) -> r
```
</details>

Apply one of two functions depending on contents, unifying their result.<br/>
If current result is `Ok` then the first function `mapFn` is applied, if it is `Err` then the second function `errFn` is applied.

```js
const sq = (x) => x * x
const ng = (x) => -x

Ok(2).either(sq, ng) === 4
Err(2).either(sq, ng) === -2
```

### map

Apply function to `Ok` inner value.

<details><summary><code>map :: Result f => f a b ~> (a -> q) -> f q</code></summary>

```hs
map :: Result f => f a b ~> (a -> q) -> f q
```
</details>

If `map` called on `Err` value, returns `Err` with it inner value.

```js
Ok(3).map((a) => a + a).unwrap() === 6
Err(5).map((a) => a + a).isErr() === true
Err(5).map((a) => a + a).unwrapErr() === 5
Ok(3).map((a) => a + a).map((b) => b - 1).unwrap() === 5
```

### mapErr

Apply function `Err` inner value.

<details><summary><code>mapErr :: Result f => f a b ~> (b -> r) -> f r</code></summary>

```hs
mapErr :: Result f => f a b ~> (b -> r) -> f r
```
</details>

If `mapErr` called on `Ok` value, returns `Ok` with it inner value.


```js
Ok(2).mapErr((e) => e + 3).unwrap() === 2
Err(2).mapErr((e) => e + 3).unwrapErr() === 5
Err(4).mapErr((e) => e * 2).mapErr((e) => e - 1).map((v) => v + 1).unwrapErr() === 7
```

### bimap

Apply two functions to `Ok` and `Err` inner values.

<details><summary><code>bimap :: Result f => f a b ~> (a -> q) -> (b -> z) -> f q z</code></summary>

```hs
bimap :: Result f => f a b ~> (a -> q) -> (b -> z) -> f q z
```
</details>


Sugar for chained `map` and `mapErr` calls.<br/>
If `bimap` called on `Ok` value then first function applied; if called on `Err` then second function applied.<br/>
Type of `Result` not changed after `bimap` call.

```js
const a = (x) => x * x
const b = (y) => y + y

Ok(4).bimap(a, b).unwrap() === 16
Err(4).bimap(a, b).unwrapErr() === 8

Ok(4).bimap(a, b)
// equals
Ok(4).map(a).mapErr(b)
```

### chain


### chainErr


### iter


### and


### andThen


### or


### orElse


### unwrap


### unwrapOr


### unwrapOrElse


### unwrapErr


### expect


### expectErr


### promise


### swap


### extract


### extractErr



