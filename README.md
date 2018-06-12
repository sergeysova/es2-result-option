# @es2/result-option [![Maintainability](https://api.codeclimate.com/v1/badges/1448aef0f57513e42c0c/maintainability)](https://codeclimate.com/github/sergeysova/es2-result-option.js/maintainability) [![Build Status](https://travis-ci.org/sergeysova/es2-result-option.js.svg?branch=master)](https://travis-ci.org/sergeysova/es2-result-option.js) [![Coverage Status](https://coveralls.io/repos/github/sergeysova/es2-result-option.js/badge.svg?branch=master)](https://coveralls.io/github/sergeysova/es2-result-option.js?branch=master)

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
