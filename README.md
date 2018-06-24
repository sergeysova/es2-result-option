# @es2/result-option [![Maintainability](https://api.codeclimate.com/v1/badges/1448aef0f57513e42c0c/maintainability)](https://codeclimate.com/github/sergeysova/es2-result-option/maintainability) [![Build Status](https://travis-ci.org/sergeysova/es2-result-option.svg?branch=master)](https://travis-ci.org/sergeysova/es2-result-option) [![Coverage Status](https://coveralls.io/repos/github/sergeysova/es2-result-option/badge.svg?branch=master)](https://coveralls.io/github/sergeysova/es2-result-option?branch=master)

## Readme

Read [documentation](https://result-option.sergeysova.com)


## Installation

```bash
npm install @es2/result-option
```

Package written for ECMAScript v5+.

### CommonJS

```js
const { Option, Some, None, Result } = require('@es2/result-option')

Some.of(2)
Option.some(2)
```

### ECMAScript Module

```js
import { Option, Some, None, Result } from '@es2/result-option'

Some.of(2)
Option.some(2)
```

### TypeScript

```ts
import { Ok, ResultClass } from '@es2/result-option'

const ResultClass<number, string> = Ok.of(12)
```

## Examples

```js
function divide(numerator, denominator) {
  return numerator === 0
    ? Option.zero()
    : Option.some(numerator / denominator)
}

const result = divide(12, 3)
  .extractOr(0)

assert(result, 4)
```

```ts
function checkOptional(optional: Option<number>) {
  if (optional.isSome()) {
    console.log(`has value ${optional.extractOr(null)}`)
  }
  else {
    console.log(`has no value`)
  }
}
```

```js
let msg = Some.of('foo bar')

// Destroy option, extract string
let unwrappedMessage = msg.extractOr('default message')
// 'foo bar'
```

```ts
function getNumberOver5(): Option<number> {
  const number = Math.floor(Math.random() * 10)

  if (number > 5) {
    return Option.none()
  }

  return Some(number)
}

function printNumber(num: Option<number>) {
  console.log(`Generated number: ${num.extractOr(0)}`)
}

printNumber(getNumberOver5().or(Some(10)))
```

```ts
declare function getUser(id: number): Promise<Option<User>>

return (await getUser(1))
  .extractOrElse(() => User.default())
```
